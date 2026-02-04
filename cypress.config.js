const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { webcrypto } = require("crypto");

module.exports = defineConfig({
  e2e: {
    specPattern: "**/*.feature", // Tell Cypress to look for .feature files
    async setupNodeEvents(on, config) {
      // Polyfill global crypto for @cucumber/* when running under esbuild
      if (!global.crypto) {
        global.crypto = webcrypto;
      }

      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
    baseUrl: 'http://localhost:8080', // CHANGE THIS to the port in your properties file
  },
});