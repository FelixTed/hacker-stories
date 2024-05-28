// jest.config.js
module.exports = {
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
    // Transform file with babel-jest to support ES modules
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    // Other Jest settings...
  };
  