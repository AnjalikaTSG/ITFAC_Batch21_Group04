import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let adminToken = "";
let userToken = "";
let refreshToken = "";
let response = null;

// --- API_Ad_01 ---

When("I send a POST request to {string} with admin credentials", (url) => {
  cy.request({
    method: "POST",
    url: url,
    body: {
      username: "admin",
      password: "admin123",
    },
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
    cy.wrap(res).as("apiResponse");
    if (res.body.token) {
      adminToken = res.body.token;
    }
    // Assume access_token or token
    if (res.body.accessToken) {
      adminToken = res.body.accessToken;
    }
  });
});

Then("the response should contain a valid JWT token", () => {
  expect(response.body).to.have.property("token"); // or accessToken
  // basic check if it looks like a JWT
  // expect(response.body.token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
});

// --- API_Ad_02 ---

When("I send a GET request to {string} with the token", (url) => {
  cy.get("@adminToken").then((token) => {
    cy.request({
      method: "GET",
      url: url,
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

Then("the response should contain admin data", () => {
  expect(response.body).to.not.be.null;
});

// --- API_Ad_03 ---

When("I send a POST request to {string} with the user token", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "POST",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        some: "data",
      },
      failOnStatusCode: false,
    }).then((res) => {
      response = res;
      cy.wrap(res).as("apiResponse");
    });
  });
});

When("I send a GET request to {string} with the user token", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "GET",
      url: url,
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

When("I send a DELETE request to {string} with the user token", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "DELETE",
      url: url,
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

Then("I should receive a {int} Forbidden status", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

// --- API_Us_01 ---

Given("I have a valid refresh token", () => {
  // Ensure we have logged in to get refresh token
  if (refreshToken) return;
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: {
      username: "testuser",
      password: "test123",
    },
    failOnStatusCode: false,
  }).then((res) => {
    refreshToken = res.body.refreshToken;
  });
});

When("I send a POST request to {string} with the refresh token", (url) => {
  cy.request({
    method: "POST",
    url: url,
    body: {
      refreshToken: refreshToken,
    },
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
    cy.wrap(res).as("apiResponse");
  });
});

Then("the response should contain a new access token", () => {
  expect(response.body).to.have.property("accessToken").or.property("token");
});

// --- API_Us_02 (Reuse steps) ---

// --- API_Us_03 ---

Given("I have a valid user token for User A", () => {
  // Authenticate as User A (using default user credentials for now)
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: {
      username: "testuser",
      password: "test123",
    },
    failOnStatusCode: false,
  }).then((res) => {
    const token = res.body.token || res.body.accessToken;
    cy.wrap(token).as("userToken");
  });
});

When("I send a GET request to User B's data endpoint {string}", (url) => {
  cy.get("@userToken").then((token) => {
    // In a real scenario, we'd replace IDs dynamically.
    // For now use the URL provided in feature file
    cy.request({
      method: "GET",
      url: url,
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

Then(
  "I should receive a {int} Forbidden or {int} Not Found status",
  (s1, s2) => {
    expect([s1, s2]).to.include(response.status);
  },
);
