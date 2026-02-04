import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- Preconditions ---
Given("I am logged in as an Admin", () => {
  cy.loginAdminUI();
});
Given("I am logged in as a Standard User", () => {
  cy.loginUserUI();
});

// --- Common Steps---
When("I navigate to the Sales page", () => {
  cy.contains("Sales").click();
});

When("I click the {string} button", (btnText) => {
  // handles ALL buttons (Sell Plant, Save, Login)
  cy.contains("button, a", btnText).click();
});

