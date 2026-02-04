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

// ----------------Verify Sales List Page Loading (UI_Ad_01_214025B)------------------
Then("the {string} page header should be visible", (headerText) => {
  cy.get("h1, h2, h3").contains(headerText).should("be.visible");
});

Then("the data table should display the following columns:", (dataTable) => {
  const columns = dataTable.raw().flat();
  columns.forEach((colName) => {
    cy.contains("th", colName).should("be.visible");
  });
});