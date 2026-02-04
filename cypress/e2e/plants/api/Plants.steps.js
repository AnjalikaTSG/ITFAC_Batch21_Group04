import { Given, When, Then, Before, After } from "@badeball/cypress-cucumber-preprocessor";
import {
  getHeaders,
  loginAdmin,
  createPlant,
  deletePlantById,
  deleteExistingPlantByName,
  buildPlantData
} from "./Plants.Api";

// Test context
let plantData = {};
let response = {};
let authToken = "";
let createdPlantId = null;

const API_BASE_URL = Cypress.config("baseUrl");

// ==================== HOOKS ====================

Before(() => {
  plantData = {};
  response = {};
  createdPlantId = null;
});

After(() => {
  if (createdPlantId) {
    const headers = getHeaders(authToken);
    deletePlantById(createdPlantId, headers).then((res) => {
      if (res.status === 200 || res.status === 204) {
        cy.log(`✓ Cleanup: Plant with ID ${createdPlantId} deleted successfully`);
      } else {
        cy.log(`⚠ Cleanup: Failed to delete plant ID ${createdPlantId}, Status: ${res.status}`);
      }
    });
  }
});

// ==================== GIVEN STEPS ====================

Given("the API base URL is configured", () => {
  expect(API_BASE_URL).to.not.be.empty;
  cy.log(`API Base URL: ${API_BASE_URL}`);
});

Given("I have a valid admin authentication token", () => {
  loginAdmin().then((res) => {
    if (res.status === 200 && res.body.token) {
      authToken = res.body.token;
      cy.log("Admin authentication token obtained successfully");
    } else {
      cy.log("Proceeding without authentication token (API may not require auth)");
      authToken = "";
    }
  });
});

Given("I have plant details with name {string} and price {float} and quantity {int}", (name, price, quantity) => {
  const headers = getHeaders(authToken);

  deleteExistingPlantByName(name, headers).then(() => {
    plantData = buildPlantData(name, price, quantity);
    cy.log(`Plant data prepared: ${JSON.stringify(plantData)}`);
  });
});

// ==================== WHEN STEPS ====================

When("I send a POST request to create a plant under category ID {int}", (categoryId) => {
  const headers = getHeaders(authToken);

  createPlant(categoryId, plantData, headers).then((res) => {
    response = res;
    cy.log(`Response Status: ${res.status}`);
    cy.log(`Response Body: ${JSON.stringify(res.body)}`);
  });
});

// ==================== THEN STEPS ====================

Then("the response status code should be {int} or {int}", (code1, code2) => {
  cy.log(`Actual Status: ${response.status}, Expected: ${code1} or ${code2}`);
  expect([code1, code2]).to.include(response.status);
  cy.log(`✓ Status code ${response.status} matches expected (${code1} or ${code2})`);
});

Then("the response body should contain the created plant with a generated ID", () => {
  expect(response.body).to.not.be.null;
  expect(response.body).to.have.property("id");
  expect(response.body.id).to.not.be.null;
  createdPlantId = response.body.id;
  cy.log(`✓ Plant created with ID: ${response.body.id}`);
});

Then("the plant name in response should be {string}", (expectedName) => {
  expect(response.body).to.have.property("name");
  expect(response.body.name).to.eq(expectedName);
  cy.log(`✓ Plant name matches: ${expectedName}`);
});
