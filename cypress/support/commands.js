// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/ui/login");
  cy.get('input[name="username"]').should("be.visible").clear().type(username);
  cy.get('input[name="password"]').should("be.visible").clear().type(password);
  cy.get('button[type="submit"]').should("be.enabled").click();
});

Cypress.Commands.add("getAdminToken", () => {
  return cy
    .request({
      method: "POST",
      url: "/api/auth/login",
      body: {
        username: "admin",
        password: "admin123",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      const token = response.body.token;
      return token;
    });
});

Cypress.Commands.add("getUserToken", () => {
  return cy
    .request({
      method: "POST",
      url: "/api/auth/login",
      body: {
        username: "testuser",
        password: "test123",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      const token = response.body.token;
      return token;
    });
});

// --- ADMIN LOGIN COMMAND ---
Cypress.Commands.add("loginAdmin", () => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: {
      username: "admin",
      password: "admin123",
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    Cypress.env("adminToken", response.body.token);
  });
});

// --- USER LOGIN COMMAND ---
Cypress.Commands.add("loginUser", () => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: {
      username: "testuser",
      password: "test123",
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    Cypress.env("userToken", response.body.token);
  });
});

// --- UI LOGIN COMMANDS ---
Cypress.Commands.add("loginAdminUI", () => {
  cy.visit("/ui/login");
  cy.get('input[name="username"]').type("admin");
  cy.get('input[name="password"]').type("admin123");
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("loginUserUI", () => {
  cy.visit("/ui/login");
  cy.get('input[name="username"]').type("testuser");
  cy.get('input[name="password"]').type("test123");
  cy.get('button[type="submit"]').click();
});

