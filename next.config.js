/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => { 
    config.externals.push({ sharp: 'commonjs sharp', canvas: 'commonjs canvas' })
    return config;
   },
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}"
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}"
    }
  },
  images: {
    domains: [
      'images.unsplash.com',
      'www.unsplash.com',
      'unsplash.com',
      'source.unsplash.com',
      'i.imgur.com',
      'plus.unsplash.com',
      'dummyimage.com',
      'img.freepik.com',
    ],    
  }
}

module.exports = nextConfig;
