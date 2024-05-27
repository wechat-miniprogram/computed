module.exports = {
  preset: 'ts-jest',
  bail: 1,
  verbose: true,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/__test__/**'],
}
