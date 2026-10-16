import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // application instrumentée servie par scripts/serve-e2e.js
    baseUrl: 'http://localhost:4300',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    setupNodeEvents(on, config) {
      // récupère la couverture de chaque test et génère le rapport (coverage-e2e/)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
  },
});
