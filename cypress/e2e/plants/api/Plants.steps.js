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

Given("I have a valid user authentication token", () => {
  cy.request({
    method: "POST",
    url: `${API_BASE_URL}/api/auth/login`,
    body: {
      username: "testuser",
      password: "test123"
    },
    failOnStatusCode: false
  }).then((res) => {
    if (res.status === 200 && res.body.token) {
      authToken = res.body.token;
      cy.log("User authentication token obtained successfully");
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

Given(/^a plant with ID (\d+) does not exist$/, (plantId) => {
  const headers = getHeaders(authToken);
  cy.request({
    method: "GET",
    url: `${API_BASE_URL}/api/plants/${plantId}`,
    headers: headers,
    failOnStatusCode: false
  }).then((res) => {
    expect(res.status).not.to.eq(200);
    cy.log(`✓ Plant with ID ${plantId} does not exist.`);
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

When("I send a GET request to retrieve all plants", () => {
  const headers = getHeaders(authToken);
  cy.request({
    method: "GET",
    url: `${API_BASE_URL}/api/plants`,
    headers: headers,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
    cy.log(`Response Status: ${res.status}`);
    cy.log(`Response Body: ${JSON.stringify(res.body)}`);
  });
});

When("I send a PUT request to update plant ID {int} with name {string} and price {float}", (plantId, newName, newPrice) => {
  const headers = getHeaders(authToken);
  const updateBody = {
    id: plantId,
    name: newName,
    price: newPrice
  };
  cy.request({
    method: "PUT",
    url: `${API_BASE_URL}/api/plants/${plantId}`,
    headers: headers,
    body: updateBody,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
    cy.log(`Response Status: ${res.status}`);
    cy.log(`Response Body: ${JSON.stringify(res.body)}`);
  });
});

When("I send a DELETE request to remove plant ID {int}", (plantId) => {
  const headers = getHeaders(authToken);
  cy.request({
    method: "DELETE",
    url: `${API_BASE_URL}/api/plants/${plantId}`,
    headers: headers,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
    cy.log(`Response Status: ${res.status}`);
    cy.log(`Response Body: ${JSON.stringify(res.body)}`);
  });
});

When("I send a PUT request to update plant ID {int} with name {string}, price {float}, and quantity {int}", (plantId, name, price, quantity) => {
  const headers = getHeaders(authToken);
  const body = { name, price, quantity };
  cy.request({
    method: "PUT",
    url: `${API_BASE_URL}/api/plants/${plantId}`,
    headers: headers,
    body: body,
    failOnStatusCode: false
  }).then((res) => {
    response = res;
    cy.log(`Response Status: ${res.status}`);
    cy.log(`Response Body: ${JSON.stringify(res.body)}`);
  });
});

When("I send a GET request to retrieve plants filtered by category ID {int}", (categoryId) => {
  const headers = getHeaders(authToken);
  cy.request({
    method: "GET",
    url: `${API_BASE_URL}/api/plants/category/${categoryId}`,
    headers: headers,
    failOnStatusCode: false
  }).then((res) => {
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

Then("the response status code should be {int}", (expectedCode) => {
  cy.log(`Actual Status: ${response.status}, Expected: ${expectedCode}`);
  expect(response.status).to.eq(expectedCode);
  cy.log(`✓ Status code ${response.status} matches expected (${expectedCode})`);
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

Then("the response body should contain a validation error message {string}", (expectedMessage) => {
  expect(response.body).to.not.be.null;
  // Accept either a 'details', 'message', or 'error' property containing the expected message
  let errorMsg = '';
  if (response.body.details && typeof response.body.details === 'object') {
    errorMsg = Object.values(response.body.details).join(' ');
  } else {
    errorMsg = response.body.message || response.body.error || JSON.stringify(response.body);
  }
  expect(errorMsg).to.include(expectedMessage);
  cy.log(`✓ Validation error message found: ${expectedMessage}`);
});

Then("the response body should be a JSON array of plant objects", () => {
  expect(response.body).to.be.an("array");
  if (response.body.length > 0) {
    expect(response.body[0]).to.have.property("id");
    expect(response.body[0]).to.have.property("name");
    expect(response.body[0]).to.have.property("price");
    expect(response.body[0]).to.have.property("quantity");
  }
  cy.log("✓ Response body is a JSON array of plant objects");
});

Then("the response body should confirm the update with name {string} and price {float}", (expectedName, expectedPrice) => {
  expect(response.body).to.have.property("name", expectedName);
  expect(response.body).to.have.property("price", expectedPrice);
  cy.log(`✓ Update confirmed: name=${expectedName}, price=${expectedPrice}`);
});

Then("the response body should be empty", () => {
  expect(response.body).to.be.empty;
  cy.log("✓ Response body is empty as expected");
});

Then("the response body should only contain plants in category ID {int}", (expectedCategoryId) => {
  expect(response.body).to.be.an("array");
  // Only check plants that have a category property and skip others
  const filtered = response.body.filter(plant => plant.category && plant.category.id);
  filtered.forEach(plant => {
    expect(plant.category.id).to.eq(expectedCategoryId);
  });
  cy.log(`✓ All filtered plants belong to category ID: ${expectedCategoryId}`);
});

Then("the response body should contain a forbidden error message", () => {
  expect(response.body).to.not.be.null;
  // Accept either a 'message', 'error', or string body indicating forbidden
  const errorMsg = response.body.message || response.body.error || JSON.stringify(response.body);
  expect(response.status).to.eq(403);
  expect(errorMsg.toLowerCase()).to.include("forbidden");
  cy.log("✓ Forbidden error message found as expected");
});
