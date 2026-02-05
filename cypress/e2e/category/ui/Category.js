import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I navigate to the Category List page", () => {
  cy.visit("/ui/categories");
});

Then("I should not see the {string} button", (buttonText) => {
  cy.contains("button", buttonText).should("not.exist");
});
