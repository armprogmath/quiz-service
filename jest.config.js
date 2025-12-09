module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',         // if your tsconfig.json has src as base
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
};
