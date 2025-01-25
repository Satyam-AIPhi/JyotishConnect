### **Base URL Prefix:**  
All endpoints are prefixed with `/api/v1`. For example:  
```
http://localhost:7000/api/v1/
```

---

## **Authentication Endpoints**  

| Method | Endpoint                         | Access      | Description                                 |
|--------|----------------------------------|-------------|---------------------------------------------|
| POST   | `/signup`                        | Public      | Register a new regular user                 |
| POST   | `/signup/astrologer`             | Public      | Register a new astrologer user              |
| POST   | `/login`                         | Public      | Log in a user and set JWT cookie            |
| POST   | `/google`                        | Public      | Authenticate using Google credentials       |
| GET    | `/signout`                       | Public      | Sign out by clearing the JWT cookie         |

---

## **User Endpoints**  

Requires a valid JWT token (via `verifyToken` middleware).

| Method | Endpoint                   | Access      | Description                                |
|--------|----------------------------|-------------|--------------------------------------------|
| PUT    | `/users/update/:id`        | Authenticated | Update own user details                  |
| DELETE | `/users/delete/:id`        | Authenticated | Delete own user account                  |
| GET    | `/users/:id`               | Authenticated | Retrieve specific user details           |

---

## **Astrologer Endpoints**  

| Method | Endpoint                                                        | Access                   | Description                                           |
|--------|-----------------------------------------------------------------|--------------------------|-------------------------------------------------------|
| GET    | `/astrologers/list`                                             | Public                   | Get a list of astrologers with filtering options      |
| GET    | `/astrologers/:id`                                              | Public                   | Get detailed profile of an astrologer                 |
| GET    | `/astrologers/specializations/list`                             | Public                   | List all available specializations                    |
| PUT    | `/astrologers/update/:astrologerId`                             | Astrologer Protected     | Update own astrologer profile                         |
| POST   | `/astrologers/specializations/add`                              | Astrologer Protected     | Add or update specializations for the logged-in astrologer |
| DELETE | `/astrologers/specializations/:specializationId`                | Astrologer Protected     | Remove a specialization from the astrologer's profile |
| POST   | `/astrologers/specializations/create`                           | Admin Protected          | Create a new specialization (Admin only)              |

---

## **Review Endpoints**  

| Method | Endpoint                                                          | Access             | Description                                                       |
|--------|-------------------------------------------------------------------|--------------------|-------------------------------------------------------------------|
| GET    | `/reviews/astrologer/:astrologerId`                              | Public             | Get reviews for a specific astrologer, with optional filters         |
| POST   | `/reviews/create`                                                 | Authenticated      | Create a new review                                               |
| PUT    | `/reviews/:reviewId/edit`                                         | Authenticated      | Edit an existing review (only by its creator)                     |
| POST   | `/reviews/:reviewId/reply`                                        | Authenticated      | Add a reply to a review (by review owner or astrologer)            |
| PUT    | `/reviews/:reviewId/reply/:replyId/edit`                          | Authenticated      | Edit a reply to a review (only by its author)                     |
| POST   | `/reviews/:reviewId/helpful`                                      | Authenticated      | Mark or unmark a review as helpful                                |

---



Consultation Services
Chat with Astrologer: Real-time text consultations with professional astrologers.
Talk to Astrologer: Voice consultations for personalized guidance.
Live Video Consultations: Face-to-face sessions for detailed discussions.
Astrological Reports and Tools
Free Kundli: Generates personalized birth charts.
Kundli Matching: Compatibility analysis for marriages.
Horoscopes: Daily, weekly, monthly, and yearly predictions tailored to zodiac signs.
Chinese Horoscope: Insights based on Chinese astrology.
Additional Services
Book a Pooja: Schedule and book religious ceremonies.
Astromall: Purchase spiritual products like gemstones, rudraksha, and yantras.
Today Panchang: Daily Panchang details, including auspicious times.
Educational Content
Blog: Articles on various astrological topics.
User Engagement
Free Live Astrology Sessions: Interactive sessions to gain insights.
Personalized Notifications: Updates on sessions, horoscopes, and special offers.


