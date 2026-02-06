import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

// Shared Step for Status Code
// Expects @apiResponse to be set by the previous step
Then("I should receive a {int} OK status", (statusCode) => {
  cy.get("@apiResponse").then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});

Given("I have a valid admin token", () => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: { username: "admin", password: "admin123" },
    failOnStatusCode: false,
  }).then((res) => {
    const token = res.body.token || res.body.accessToken;
    cy.wrap(token).as("adminToken");
  });
});

Given("I have a valid user token", () => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: { username: "testuser", password: "test123" },
    failOnStatusCode: false,
  }).then((res) => {
    const token = res.body.token || res.body.accessToken;
    cy.wrap(token).as("userToken");
  });
});

Given("I perform login as {string}", (role) => {
  cy.visit("/ui/login");
  if (role === "admin") {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
  } else {
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("test123");
  }
  cy.get('button[type="submit"]').click();
});
