import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let adminToken = "";
let response = null;

When("I send a POST request to {string} with invalid data type", (url) => {
  cy.get("@adminToken").then((token) => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        name: 12345, // Sending number instead of string
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      response = res;
      cy.wrap(res).as("apiResponse");
    });
  });
});

Then("I should receive a {int} Bad Request status", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

Then("the response should contain a clear error message", () => {
  // Check if error message exists in body
  const body = response.body;
  expect(body.message || body.error).to.exist;
});
