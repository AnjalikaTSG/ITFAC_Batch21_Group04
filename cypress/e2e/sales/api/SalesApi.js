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

// --------------Integration: Stock Reduction Check (API_Ad_02_214025B)----------
Given("I check the current stock of Plant ID {int}", (id) => {
  cy.request({
    method: "GET",
    url: `/api/plants/${id}`,
    headers: { Authorization: `Bearer ${adminToken}` },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    initialStock = response.body.quantity;
    cy.log("Initial Stock: " + initialStock);
  });
});

When("I create a sale for Plant ID {int} with Quantity {int}", (id, qty) => {
  cy.then(() => {
    cy.request({
      method: "POST",
      url: `/api/sales/plant/${id}`,
      headers: { Authorization: `Bearer ${adminToken}` },
      qs: { quantity: qty },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
    });
  });
});

// ------------POST Create Sale - Overselling Stock (Negative) (API_Ad_03_214025B)------
When(
  "I attempt to sell more than the available stock for Plant ID {int}",
  (id) => {
    cy.then(() => {
      const excessiveQty = initialStock + 5;
      cy.request({
        method: "POST",
        url: `/api/sales/plant/${id}`,
        headers: { Authorization: `Bearer ${adminToken}` },
        qs: { quantity: excessiveQty },
        failOnStatusCode: false,
      }).as("apiResponse");
    });
  }
);

//-------------POST Create Sale - Invalid Quantity (Zero/Negative) (API_Ad_04_214025B)---
When(
  "I attempt to sell Plant ID {int} with invalid quantity {int}",
  (id, badQty) => {
    cy.then(() => {
      cy.request({
        method: "POST",
        url: `/api/sales/plant/${id}`,
        headers: { Authorization: `Bearer ${adminToken}` },
        qs: { quantity: badQty },
        failOnStatusCode: false,
      }).as("apiResponse");
    });
  }
);

//--------------Verify Unauthorized Access (API_Ad_05_214025B)--------------
When(
  "I attempt to create a sale for Plant ID {int} without an auth token",
  (id) => {
    cy.request({
      method: "POST",
      url: `/api/sales/plant/${id}`,
      // No Headers included here!
      qs: { quantity: 1 },
      failOnStatusCode: false,
    }).as("apiResponse");
  }
);

// USER ACTIONS
// -------------GET Sales List - Authorized (API_Us_01_214025B)-----------
When("I send a GET request to fetch all sales", () => {
  cy.then(() => {
    cy.request({
      method: "GET",
      url: "/api/sales",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      failOnStatusCode: false,
    }).as("apiResponse");
  });
});
