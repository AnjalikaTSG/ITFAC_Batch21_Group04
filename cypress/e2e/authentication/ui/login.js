import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the application login page", () => {
  cy.visit("/ui/login"); 
});

When("I enter valid username {string} and password {string}", (username, password) => {
 
  cy.get('input[name="username"]').type(username); 
  cy.get('input[name="password"]').type(password);
});

When("I click the login button", () => {
  cy.get('button[type="submit"]').click(); 
});

Then("I should see the dashboard page", () => {
  cy.url().should("include", "/dashboard"); 
});
