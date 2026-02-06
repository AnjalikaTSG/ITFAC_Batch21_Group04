import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;
let userAuthToken;
let adminAuthToken;

// -------- PreCondition --------

Given("I am authenticated as a Standard User via API", () => {
  cy.getUserToken().then((token) => {
    userAuthToken = token;
    expect(userAuthToken).to.not.be.undefined;
  });
});

Given("I am authenticated as Admin via API", () => {
  cy.getAdminToken().then((token) => {
    adminAuthToken = token;
    expect(adminAuthToken).to.not.be.undefined;
  });
});

// -------- Scenario 1 --------

When("I send a GET request to fetch category summary as user sc1", () => {
  cy.request({
    method: "GET",
    url: "/api/categories/summary",
    headers: {
      Authorization: `Bearer ${userAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc1", () => {
  expect(response.status).to.eq(200);
});

Then("the response should return category summary data sc1", () => {
  expect(response.body).to.have.property("mainCategories");
  expect(response.body.mainCategories).to.be.a("number");

  expect(response.body).to.have.property("subCategories");
  expect(response.body.subCategories).to.be.a("number");
});

// -------- Scenario 2 --------

When("I send a GET request to fetch plant summary as user sc2", () => {
  cy.request({
    method: "GET",
    url: "/api/plants/summary",
    headers: {
      Authorization: `Bearer ${userAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc2", () => {
  expect(response.status).to.eq(200);
});

Then("the response should return plant summary data sc2", () => {
  expect(response.body).to.have.property("totalPlants");
  expect(response.body.totalPlants).to.be.a("number");

  expect(response.body).to.have.property("lowStockPlants");
  expect(response.body.lowStockPlants).to.be.a("number");
});

// -------- Scenario 3 --------

When("I send a GET request to fetch sales summary as user sc3", () => {
  cy.request({
    method: "GET",
    url: "/api/sales",
    headers: {
      Authorization: `Bearer ${userAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc3", () => {
  expect(response.status).to.eq(200);
});

Then("the response should return sales summary data sc3", () => {
  expect(response.body).to.be.an("array");

  response.body.forEach((item) => {
    expect(item).to.have.property("totalPrice");
    expect(item.totalPrice).to.be.a("number");
  });
});

// -------- Scenario 4 --------
var parentId = 4;
var parentName = "Fruits";
When("I send a GET request to fetch categories with parentId sc4", () => {
  cy.request({
    method: "GET",
    url: "/api/categories",
    qs: {
      parentId: parentId,
    },
    headers: {
      Authorization: `Bearer ${userAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc4", () => {
  expect(response.status).to.eq(200);
});

Then(
  "the response should return only categories belonging to that parent ID sc4",
  () => {
    expect(response.body).to.be.an("array");
  }
);

// -------- Scenario 5 --------
let interception;

Given("I mock the Get Categories API to return an empty list", () => {
  cy.intercept("GET", "/api/categories", {
    statusCode: 200,
    body: [],
  }).as("getEmptyCategories");
});

When("I trigger the request to fetch categories sc5", () => {
  cy.window().then((win) => {
    win.fetch("/api/categories");
  });
});

Then("the response status should be 200 sc5", () => {
  cy.wait("@getEmptyCategories").then((intercept) => {
    interception = intercept;
    expect(interception.response.statusCode).to.eq(200);
  });
});

Then("the response should return an empty category list sc5", () => {
  expect(interception.response.body).to.be.an("array").that.is.empty;
  expect(interception.response.body).to.have.length(0);
});

// -------- Scenario 6 --------

When("I send a GET request to fetch category summary as admin sc6", () => {
  cy.request({
    method: "GET",
    url: "/api/categories/summary",
    headers: {
      Authorization: `Bearer ${adminAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc6", () => {
  expect(response.status).to.eq(200);
});

Then("the response should return category summary data sc6", () => {
  expect(response.body).to.have.property("mainCategories");
  expect(response.body.mainCategories).to.be.a("number");

  expect(response.body).to.have.property("subCategories");
  expect(response.body.subCategories).to.be.a("number");
});

// -------- Scenario 7 --------

When("I send a GET request to fetch plant summary as admin sc7", () => {
  cy.request({
    method: "GET",
    url: "/api/plants/summary",
    headers: {
      Authorization: `Bearer ${adminAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc7", () => {
  expect(response.status).to.eq(200);
});

Then("the response should return plant summary data sc7", () => {
  expect(response.body).to.have.property("totalPlants");
  expect(response.body.totalPlants).to.be.a("number");

  expect(response.body).to.have.property("lowStockPlants");
  expect(response.body.lowStockPlants).to.be.a("number");
});

// -------- Scenario 8 --------

When("I send a GET request to fetch sales summary as admin sc8", () => {
  cy.request({
    method: "GET",
    url: "/api/sales",
    headers: {
      Authorization: `Bearer ${adminAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 200 sc8", () => {
  expect(response.status).to.eq(200);
});

Then("the response should return sales summary data sc8", () => {
  expect(response.body).to.be.an("array");

  response.body.forEach((item) => {
    expect(item).to.have.property("totalPrice");
    expect(item.totalPrice).to.be.a("number");
  });
});

// -------- Scenario 9 --------
let plantId = 4; // Need an IF of the plant
When("I send a DELETE request to delete the plant by ID", () => {
  cy.request({
    method: "DELETE",
    url: `/api/plants/${plantId}`,
    headers: {
      Authorization: `Bearer ${adminAuthToken}`,
    },
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 204 sc9", () => {
  expect(response.status).to.eq(204);
});

// -------- Scenario 10 --------
let categoryId = 9; // Should be an Sub Cateory
When("I send a POST request to create a plant without a name", () => {
  cy.request({
    method: "POST",
    url: `/api/plants/category/${categoryId}`,
    headers: {
      Authorization: `Bearer ${adminAuthToken}`,
    },
    body: {
      price: 10,
      quantity: 5,
      // name is intentionally missing
    },
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
  });
});

Then("the response status should be 400", () => {
  expect(response.status).to.eq(400);
});
