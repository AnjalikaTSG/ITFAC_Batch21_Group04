const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "cypress/reports/json", // * Must match the output path in Phase 2 *
  reportPath: "cypress/reports/html",
  metadata: {
    browser: {
      name: "chrome",
      version: "100",
    },
    device: "Local Test Machine",
    platform: {
      name: "windows",
      version: "11",
    },
  },
  customData: {
    title: "Run Info",
    data: [
      { label: "Project", value: "My App" },
      { label: "Release", value: "1.0.0" },
      { label: "Execution Start Time", value: new Date().toISOString() },
    ],
  },
});
