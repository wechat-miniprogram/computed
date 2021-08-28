module.exports = {
  preset: "ts-jest",
  bail: 1,
  verbose: true,
  testEnvironment: "jsdom",
  testURL: "https://jest.test",
  moduleFileExtensions: ["js", "ts"],
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!**/__test__/**"],
  snapshotSerializers: ["miniprogram-simulate/jest-snapshot-plugin"],
};
