const Astrologer = require('../models/astrologer.model');
const Specialization = require('../models/specialization.model');
const errorHandler = require('../utils/error');
const Review = require('../models/review.model');

exports.listAstrologers = async (req, res, next) => {
  try {
    const {
      specialization,
      language,
      minExperience,
      maxCost,
      status,
      verified,
      tag
    } = req.query;

    const query = {};

    if (specialization) {
      query.specializations = specialization;
    }
    if (language) {
      query.languages = language;
    }
    if (minExperience) {
      query.experience = { $gte: parseInt(minExperience) };
    }
    if (maxCost) {
      query.costPerMinute = { $lte: parseInt(maxCost) };
    }
    if (status === 'online') {
      query.$or = [
        { chatStatus: 'online' },
        { callStatus: 'online' }
      ];
    }
    if (verified) {
      query.verification = 'verified';
    }
    if (tag) {
      query.tag = tag;
    }

    // Get astrologers with basic info
    const astrologers = await Astrologer.find(query)
      .populate('userId', 'name avatar')
      .populate('specializations.specialization')
      .select('-__v');

    // Get ratings for all astrologers
    const astrologersWithRatings = await Promise.all(
      astrologers.map(async (astrologer) => {
        const reviews = await Review.find({ astrologerId: astrologer._id });
        
        const ratingStats = {
          average: 0,
          total: reviews.length,
          distribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
          }
        };

        reviews.forEach(review => {
          ratingStats.distribution[review.rating]++;
        });

        if (reviews.length > 0) {
          ratingStats.average = Number((reviews.reduce((acc, review) => 
            acc + review.rating, 0) / reviews.length).toFixed(1));
        }

        // Convert to plain object to allow adding new properties
        const astrologerObj = astrologer.toObject();
        astrologerObj.ratings = ratingStats;

        return astrologerObj;
      })
    );

    res.status(200).json(astrologersWithRatings);
  } catch (error) {
    next(error);
  }
};

exports.getAstrologerProfile = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findById(req.params.id)
      .populate('userId', 'name avatar')
      .populate('specializations.specialization');

    if (!astrologer) {
      return next(errorHandler(404, 'Astrologer not found'));
    }

    const reviews = await Review.find({ astrologerId: req.params.id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const ratingStats = {
      average: 0,
      total: reviews.length,
      distribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      }
    };

    reviews.forEach(review => {
      ratingStats.distribution[review.rating]++;
    });

    if (reviews.length > 0) {
      ratingStats.average = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    }

    res.status(200).json({
      astrologer,
      reviews,
      ratingStats
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAstrologerProfile = async (req, res, next) => {
  try {
    const { astrologerId } = req.params;

    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      return next(errorHandler(404, 'Astrologer not found'));
    }

    if (req.body.specializations) {
      for (const spec of req.body.specializations) {
        const specializationExists = await Specialization.findById(spec.specialization);
        if (!specializationExists) {
          return next(errorHandler(404, `Specialization ${spec.specialization} not found`));
        }
      }

      astrologer.specializations = req.body.specializations;
    }

    for (let key in req.body) {
      if (key !== 'specializations' && req.body.hasOwnProperty(key)) {
        astrologer[key] = req.body[key];
      }
    }

    await astrologer.save();

    const updatedAstrologer = await Astrologer.findById(astrologerId)
      .populate('specializations.specialization')
      .populate('userId', 'name avatar');

    res.status(200).json(updatedAstrologer);
  } catch (error) {
    next(error);
  }
};