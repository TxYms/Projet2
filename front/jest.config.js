module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  // Code mesuré : toute l'application, sauf les tests et les faux services utilisés par les tests
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*-mock.service.ts',
  ],
  // Rapport HTML dans coverage/lcov-report/index.html + résumé dans le terminal
  coverageReporters: ['html', 'lcov', 'text', 'text-summary'],
  // Les tests échouent si la couverture des lignes passe sous 80 %
  coverageThreshold: {
    global: {
      statements: 80,
      lines: 80,
    },
  },
};
