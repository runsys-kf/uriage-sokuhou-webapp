const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: 'jest-environment-jsdom',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js$',
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/pages/(.*)$': '<rootDir>/pages/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^next/dist/shared/lib/router-context$': 'next/dist/shared/lib/router-context.shared-runtime',
    },
    testPathIgnorePatterns: ['/node_modules/', '/__tests__/mockData/'],
    verbose: true,
};

module.exports = createJestConfig(customJestConfig);