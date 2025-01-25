'use client';

export function HeroSection() {
  return (
    <section className="relative bg-[url(https://cdn.pixabay.com/photo/2016/04/11/06/56/golden-1321410_1280.png)] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 sm:bg-gradient-to-r"></div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
        <div className="max-w-xl text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            200+ Celebs recommends
            <strong className="block font-extrabold text-rose-500">Astrotalk</strong>
          </h1>

          <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
            Chat With Astrologer
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center">

            <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-gray-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
              Chat Now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold w-full h-12 rounded-lg shadow-md hover:from-orange-500 hover:to-yellow-500">Chat with Astrologer</button>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold w-full h-12 rounded-lg shadow-md hover:from-orange-500 hover:to-yellow-500">Talk to Astrologer</button>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold w-full h-12 rounded-lg shadow-md hover:from-orange-500 hover:to-yellow-500">Astromall Shop</button>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold w-full h-12 rounded-lg shadow-md hover:from-orange-500 hover:to-yellow-500">Book A Pooja</button>
          </div>

        </div>
      </div>
    </section>
  )
}

