const { defineConfig } = require("cypress");
const cucumber = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature", // Tell Cypress to look for .feature files
    defaultCommandTimeout: 10000,
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
    baseUrl: 'http://localhost:8081', // CHANGE THIS to the port in your properties file
  },
});