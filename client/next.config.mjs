/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn-icons-png.flaticon.com',
      'img.freepik.com',
      'srcs.unsplash.com',
      'cdn.pixabay.com',
      'pujayagna.com',
      'images.unsplash.com',
      'i.pinimg.com',
      'www.indastro.com',
      'i.ibb.co'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', 
        destination: 'http://localhost:7000/api/v1/:path*', 
      },
    ];
  },  
};

export default nextConfig;
