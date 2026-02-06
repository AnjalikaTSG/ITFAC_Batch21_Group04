import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

//  -------- Scenario 1 --------
Given("the user is on the login page", () => {
  cy.visit("/ui/login");
});

When(
  "the user logs in with username {string} and password {string} sc1",
  (username, password) => {
    cy.get('input[name="username"]')
      .should("be.visible")
      .clear()
      .type(username);

    cy.get('input[name="password"]')
      .should("be.visible")
      .clear()
      .type(password);

    cy.get('button[type="submit"]').should("be.enabled").click();
  }
);

Then("the user should be redirected to the Dashboard page", () => {
  cy.url().should("include", "/dashboard");
  cy.contains("h3", "Dashboard").should("be.visible");
});

//  -------- Scenario 2 --------
Given(
  "the user logs in with username {string} and password {string} sc2",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the user is on the Dashboard page sc2", () => {
  cy.url().should("include", "/dashboard");
});

When("the user observes the left navigation menu sc2", () => {
  cy.get(".sidebar").should("be.visible");
});

Then("the sidebar menu items should be visible sc2", () => {
  cy.contains(".sidebar", "Dashboard").should("be.visible");
  cy.contains(".sidebar", "Categories").should("be.visible");
  cy.contains(".sidebar", "Plants").should("be.visible");
  cy.contains(".sidebar", "Sales").should("be.visible");
});

//  -------- Scenario 3 --------
Given(
  "the user logs in with username {string} and password {string} sc3",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the user is on the Dashboard page sc3", () => {
  cy.url().should("include", "/dashboard");
});

Given("the navigation menu is visible", () => {
  cy.get(".sidebar").should("be.visible");
});

When("the user clicks on the {string} menu", (menuName) => {
  cy.contains(".sidebar a", menuName).click();
});

Then("the {string} menu item should be highlighted", (menuName) => {
  cy.contains(".sidebar a", menuName).should("have.class", "active");
});

//  -------- Scenario 4 --------
Given(
  "the user logs in with username {string} and password {string} sc4",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the user is on the Dashboard page sc4", () => {
  cy.url().should("include", "/dashboard");
});

When("the user observes the dashboard summary cards", () => {
  cy.get(".card.dashboard-card").should("be.visible");
});

Then("the following dashboard summary cards should be visible:", () => {
  cy.contains(".card.dashboard-card", "Categories").should("be.visible");
  cy.contains(".card.dashboard-card", "Plants").should("be.visible");
  cy.contains(".card.dashboard-card", "Sales").should("be.visible");
  cy.contains(".card.dashboard-card", "Inventory").should("be.visible");
});

//  -------- Scenario 5 --------
Given(
  "the user logs in with username {string} and password {string} sc5",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the user is on the Dashboard page sc5", () => {
  cy.url().should("include", "/dashboard");
});

Given("the navigation menu is visible sc5", () => {
  cy.get(".sidebar").should("be.visible");
});

When("the user clicks on the Logout option", () => {
  cy.contains(".sidebar a", "Logout").click();
});

Then("the user should be logged out and redirected to the Login page", () => {
  cy.url().should("include", "/ui/login");
  cy.get('input[name="username"]').should("be.visible");
});

//  -------- Admin --------

//  -------- Scenario 6 --------
Given("the admin user is on the login page", () => {
  cy.visit("/ui/login");
});

When(
  "the admin logs in with username {string} and password {string} sc6",
  (username, password) => {
    cy.get('input[name="username"]')
      .should("be.visible")
      .clear()
      .type(username);

    cy.get('input[name="password"]')
      .should("be.visible")
      .clear()
      .type(password);

    cy.get('button[type="submit"]').should("be.enabled").click();
  }
);

Then("the admin should be redirected to the Dashboard page", () => {
  cy.url().should("include", "/dashboard");
  cy.contains("h3", "Dashboard").should("be.visible");
});

//  -------- Scenario 7 --------
Given(
  "the admin logs in with username {string} and password {string} sc7",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the admin is on the Dashboard page sc7", () => {
  cy.url().should("include", "/dashboard");
});

When("the admin observes the left navigation menu sc7", () => {
  cy.get(".sidebar").should("be.visible");
});

Then("the sidebar menu items should be visible sc7", () => {
  cy.contains(".sidebar", "Dashboard").should("be.visible");
  cy.contains(".sidebar", "Categories").should("be.visible");
  cy.contains(".sidebar", "Plants").should("be.visible");
  cy.contains(".sidebar", "Sales").should("be.visible");
});

//  -------- Scenario 8 --------
Given(
  "the admin logs in with username {string} and password {string} sc8",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the admin is on the Dashboard page sc8", () => {
  cy.url().should("include", "/dashboard");
});

Given("the navigation menu is visible sc8", () => {
  cy.get(".sidebar").should("be.visible");
});

When("the admin clicks on the {string} menu sc8", (menuName) => {
  cy.contains(".sidebar a", menuName).click();
});

Then("the {string} menu item should be highlighted sc8", (menuName) => {
  cy.contains(".sidebar a", menuName).should("have.class", "active");
});

//  -------- Scenario 9 --------
Given(
  "the admin logs in with username {string} and password {string} sc9",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the admin is on the Dashboard page sc9", () => {
  cy.url().should("include", "/dashboard");
});

Given("the navigation menu is visible sc9", () => {
  cy.get(".sidebar").should("be.visible");
});

When("the admin clicks on the {string} menu sc9", (menuName) => {
  cy.contains(".sidebar a", menuName).click();
});

Then("the admin should be redirected to the {string} page sc9", (menuName) => {
  // Convert menu name to URL-friendly path
  const path = menuName.toLowerCase();
  cy.url().should("include", `/${path}`);
});

//  -------- Scenario 10 --------
Given(
  "the admin logs in with username {string} and password {string} sc10",
  (username, password) => {
    cy.login(username, password);
  }
);

Given("the admin is on the Dashboard page sc10", () => {
  cy.url().should("include", "/dashboard");
});

Given("the dashboard summary cards are visible sc10", () => {
  cy.get(".dashboard-card").should("be.visible");
});

When(
  "the admin clicks the Action button on the {string} on the Sales summary card sc10",
  (cardName) => {
    cy.contains(".dashboard-card", cardName).find("a").click();
  }
);

Then("the admin should be redirected to the {string} page sc10", (cardPath) => {
  const path = cardPath.toLowerCase();
  cy.url().should("include", `/${path}`);
});
