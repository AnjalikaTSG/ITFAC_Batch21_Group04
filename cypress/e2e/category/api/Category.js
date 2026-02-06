import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const AUTH_LOGIN_URL = "/api/auth/login";
const CATEGORY_API_URL = "/api/categories";

let adminToken;
let userToken;
let currentToken;
let lastResponse;
let lastCategoryId;

function loginViaApi(username, password) {
  return cy
    .request({
      method: "POST",
      url: AUTH_LOGIN_URL,
      body: { username, password },
      failOnStatusCode: false,
    })
    .then((response) => {
      const token = response.body.token || response.body.accessToken;
      return { response, token };
    });
}

function getAuthHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- Given steps ----------

Given(
  "I am authenticated as {string} with password {string} via API",
  (username, password) => {
    loginViaApi(username, password).then(({ response, token }) => {
      lastResponse = response;
      if (username === "admin") {
        adminToken = token;
        currentToken = token;
      } else {
        userToken = token;
        currentToken = token;
      }
    });
  }
);

Given(
  "I have created a category via API with name {string}",
  (categoryName) => {
    const token = currentToken;
    cy.request({
      method: "POST",
      url: CATEGORY_API_URL,
      headers: getAuthHeader(token),
      body: {
        "name": categoryName,
        "parentId": null
      },
      failOnStatusCode: false,
    }).then((response) => {
      lastResponse = response;
      if (response.body && response.body.id) {
        lastCategoryId = response.body.id;
      }
    });
  }
);

Given(
  "I have an existing category id from API search by name {string}",
  (categoryName) => {
    const token = currentToken;
    cy.request({
      method: "GET",
      url: `${CATEGORY_API_URL}?name=${encodeURIComponent(categoryName)}`,
      headers: getAuthHeader(token),
      failOnStatusCode: false,
    }).then((response) => {
      const first = response.body && response.body.content
        ? response.body.content[0]
        : response.body[0];
      lastCategoryId = first && first.id;
    });
  }
);

// ---------- When steps ----------

When(
  "I create a category via API with name {string} and no parent",
  (categoryName) => {
    const token = currentToken;
    cy.request({
      method: "POST",
      url: CATEGORY_API_URL,
      headers: getAuthHeader(token),
      body: {
        "name": categoryName,
        "parentId": null
      },
      failOnStatusCode: false,
    }).then((response) => {
      lastResponse = response;
      if (response.body && response.body.id) {
        lastCategoryId = response.body.id;
      }
    });
  }
);

When(
  "I update that category via API to have name {string}",
  (newName) => {
    const token = currentToken;
    cy.request({
      method: "PUT",
      url: `${CATEGORY_API_URL}/${lastCategoryId}`,
      headers: getAuthHeader(token),
      body: {
        "name": newName,
        "parentId": null
      },
      failOnStatusCode: false,
    }).then((response) => {
      lastResponse = response;
    });
  }
);

When("I delete that category via API", () => {
  const token = currentToken;
  cy.request({
    method: "DELETE",
    url: `${CATEGORY_API_URL}/${lastCategoryId}`,
    headers: getAuthHeader(token),
    failOnStatusCode: false,
  }).then((response) => {
    lastResponse = response;
  });
});

When(
  "I get the category list via API with page {string} and size {string}",
  (page, size) => {
    const token = currentToken;
    cy.request({
      method: "GET",
      url: `${CATEGORY_API_URL}?page=${page}&size=${size}`,
      headers: getAuthHeader(token),
      failOnStatusCode: false,
    }).then((response) => {
      lastResponse = response;
    });
  }
);

When("I search categories via API by name {string}", (name) => {
  const token = currentToken;
  cy.request({
    method: "GET",
    url: `${CATEGORY_API_URL}?name=${encodeURIComponent(name)}`,
    headers: getAuthHeader(token),
    failOnStatusCode: false,
  }).then((response) => {
    lastResponse = response;
  });
});

When(
  "I send a GET request to the Category API endpoint without authorization",
  () => {
    cy.request({
      method: "GET",
      url: CATEGORY_API_URL,
      failOnStatusCode: false,
    }).then((response) => {
      lastResponse = response;
    });
  }
);

// ---------- Then steps ----------

Then("the API response status should be {int}", (statusCode) => {
  expect(lastResponse.status).to.eq(statusCode);
});

Then("the API response status should be 200 or 204", () => {
  expect([200, 204]).to.include(lastResponse.status);
});

Then("the created category should have the name {string}", (name) => {
  expect(lastResponse.body.name).to.eq(name);
});

Then("the updated category should have the name {string}", (name) => {
  expect(lastResponse.body.name).to.eq(name);
});

Then(
  "the API response should contain at least one category with name {string}",
  (name) => {
    const body = lastResponse.body;
    const list = body && body.content ? body.content : body;
    const found = (list || []).some((cat) => cat.name === name);
    expect(found).to.be.true;
  }
);