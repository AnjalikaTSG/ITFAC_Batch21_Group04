import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let plantIdToSell;
let quantityToSell;
let initialStock;
let adminToken;
let userToken;

Given("I am authenticated as Admin via API", () => {
  cy.loginAdmin().then(() => {
    adminToken = Cypress.env("adminToken");
  });
});

Given("I am authenticated as a Standard User via API", () => {
  cy.loginUser().then(() => {
    userToken = Cypress.env("userToken");
  });
});

//ADMIN ACTIONS
//---------------POST Create Sale - Valid Request (API_Ad_01_214025B)---------------
Given(
  "I have a payload for a new sale with Plant ID {int} and Quantity {int}",
  (pId, qty) => {
    plantIdToSell = pId;
    quantityToSell = qty;
  }
);

When("I send a POST request to {string}", () => {
  cy.then(() => {
    const correctUrl = `/api/sales/plant/${plantIdToSell}`;
    cy.request({
      method: "POST",
      url: correctUrl,
      headers: {
        Authorization: `Bearer ${adminToken}`, // Using Admin Token
      },
      qs: { quantity: quantityToSell },
      failOnStatusCode: false,
    }).as("apiResponse");
  });
});

