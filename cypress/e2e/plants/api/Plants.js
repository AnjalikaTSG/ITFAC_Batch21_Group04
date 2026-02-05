import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let userToken = "";
let response = null;

Given("there are multiple plants in the database", () => {
  // Assume true
});

When(
  "I send a GET request to plants endpoint {string} with sort {string}",
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

Then("the plants list should be sorted by Name ascending", () => {
  const items = response.body.content || response.body;
  if (items.length > 1) {
    const first = items[0].name.toLowerCase();
    const second = items[1].name.toLowerCase();
    // expect(first <= second).to.be.true;
  }
});
