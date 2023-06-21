/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "res.cloudinary.com",
      "arifuxd.me",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
