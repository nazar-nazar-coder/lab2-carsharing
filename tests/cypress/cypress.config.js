const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    specPattern: 'e2e/**/*.cy.js',
    supportFile: false,
    video: false,
    defaultCommandTimeout: 8000,
  },
});
