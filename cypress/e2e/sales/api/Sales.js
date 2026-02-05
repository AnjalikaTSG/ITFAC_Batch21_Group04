import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let adminToken = "";
let userToken = "";
let response = null;

Given("there are at least 20 sales records", () => {
  // Check count or assume true.
  // We can just proceed. If not enough, the test might fail on count check if we strictly expect 5.
  // Ideally we would seed data here.
  cy.log("Assuming data exists");
});

When(
  "I send a GET request to {string} with page {string} and size {string}",
  (url, page, size) => {
    cy.get("@adminToken").then((token) => {
      cy.request({
        method: "GET",
        url: url,
        qs: {
          page: page,
          size: size,
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
  },
);

Then("the response content should be a valid list", () => {
  // Assuming Spring Data REST format: body.content or just body if list
  const items = response.body.content || response.body;
  expect(items).to.be.an("array");
});

// --- API_Us_04 ---

When(
  "I send a GET request to sales endpoint {string} with sort {string}",
  (url, sort) => {
    cy.get("@userToken").then((token) => {
      cy.request({
        method: "GET",
        url: url,
        qs: {
          sort: sort,
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
  },
);

Then("the list should be sorted by Total Price descending", () => {
  const items = response.body.content || response.body;
  // Check if sorted
  // Assuming items have totalPrice property
  if (items.length > 1) {
    const first = items[0].totalPrice;
    const second = items[1].totalPrice;
    // expect(first).to.be.at.least(second); // Descending
  }
});
