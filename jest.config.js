module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@wikinime/(.*)$': ['<rootDir>/src/$1'],
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
}
