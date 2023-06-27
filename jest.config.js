module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@wikinime/(.*)$': ['<rootDir>/src/$1'],
    'swiper/react': ['<rootDir>/node_modules/swiper/react/swiper-react.js'],
    'swiper/css': '<rootDir>/node_modules/swiper/swiper.min.css',
  },
  transformIgnorePatterns: ['/node_modules/(?!swiper|ssr-window|dom7)'],
}
