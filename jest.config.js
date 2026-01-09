// module.exports = {
//     moduleFileExtensions: ['js', 'json', 'ts'],
//     rootDir: 'src',         // if your tsconfig.json has src as base
//     testRegex: '.*\\.spec\\.ts$',
//     transform: {
//         '^.+\\.(t|j)s$': 'ts-jest',
//     },
//     collectCoverageFrom: ['**/*.(t|j)s'],
//     coverageDirectory: '../coverage',
//     testEnvironment: 'node',
// };

// jest.config.js in quiz-service root
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    moduleFileExtensions: ['js', 'json', 'ts'],


    // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    //     prefix: '<rootDir>/',
    // }),

    moduleNameMapper: {
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    },

    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },


};

