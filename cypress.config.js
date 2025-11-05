const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // frontend (React)
    setupNodeEvents(on, config) {},
    env: {
      apiUrl: "http://localhost:5001/api" // backend (Express)
    },
    experimentalPromptCommand: true
  },
  reporter: 'mochawesome',
  reporterOptions: {
  reportDir: 'cypress/reports',
  overwrite: false,
  html: true,
  json: true
}
,


});
