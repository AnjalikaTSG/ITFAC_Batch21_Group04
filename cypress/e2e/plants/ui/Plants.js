import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I navigate to the Plant List page", () => {
  cy.visit("/ui/plants");
});

When("I click the Edit button for the first plant", () => {
  cy.get("table tbody tr")
    .first()
    .find("button, a")
    .contains(/Edit|Update/i)
    .click();
});

When("I change the plant name to {string}", (name) => {
  cy.get('input[name="name"]').clear().type(name);
});

When("I click the Cancel button", () => {
  cy.contains("button, a", "Cancel").click();
});

Then("I should be redirected to the Plant List page", () => {
  cy.url().should("include", "/ui/plants");
  cy.url().should("not.include", "/edit");
});

Then("the first plant name should not be {string}", (name) => {
  cy.get("table tbody tr").first().should("not.contain", name);
});

Given("I navigate to the Add Plant page", () => {
  cy.visit("/ui/plants/add");
});

When("I enter {string} in the Name field", (name) => {
  cy.get('input[name="name"]').type(name);
});

When("I select the first category", () => {
  cy.get("select").then(($select) => {
    const options = $select.find("option");
    if (options.length > 1) {
      cy.wrap($select).select(options[1].value); // Select first real option
    } else {
      cy.wrap($select).select(options[0].value);
    }
  });
});

When("I enter {string} in the Price field", (price) => {
  cy.get('input[name="price"]').type(price);
});

When("I enter {string} in the Quantity field", (qty) => {
  cy.get('input[name="quantity"]').type(qty);
});

When("I click the Save button", () => {
  cy.contains("button", "Save").click();
});

Then("I expect an error message {string}", (msg) => {
  cy.contains(msg).should("be.visible");
});

Given("a valid category exists", () => {
  cy.visit("/ui/categories");
  cy.wait(500); // Wait for load
  cy.get("body").then(($body) => {
    if (
      $body.text().includes("No category found") ||
      $body.find("table tbody tr").length === 0
    ) {
      cy.log("Creating Test Category...");
      cy.visit("/ui/categories/add");
      cy.get('input[name="name"]').type("TestCat");
      cy.contains("button", "Save").click();
      cy.contains("TestCat").should("be.visible");
    } else {
      cy.log("Category already exists.");
    }
  });
});

Given("a plant named {string} exists", (plantName) => {
  // Ensure category exists first
  cy.visit("/ui/categories");
  cy.wait(500);
  cy.get("body").then(($body) => {
    if (
      $body.text().includes("No category found") ||
      $body.find("table tbody tr").length === 0
    ) {
      cy.visit("/ui/categories/add");
      cy.get('input[name="name"]').type("TestCat");
      cy.contains("button", "Save").click();
    }
  });

  // Check plants
  cy.visit("/ui/plants");
  cy.wait(500);
  cy.contains("table tbody tr", plantName).then(
    ($row) => {
      if ($row.length === 0) {
        cy.log(`Creating Plant ${plantName}...`);
        cy.visit("/ui/plants/add");
        cy.get('input[name="name"]').type(plantName);
        cy.get('select[name="category"]').then(($select) => {
          const options = $select.find("option");
          if (options.length > 1) {
            cy.wrap($select).select(options[1].value);
          } else {
            cy.wrap($select).select(options[0].value);
          }
        });
        cy.get('input[name="price"]').type("20");
        cy.get('input[name="quantity"]').type("10");
        cy.contains("button", "Save").click();
        cy.contains(plantName).should("be.visible");
      }
    },
    { timeout: 10000 },
  ); // Handle if not found - Cypress fails if not found in contains.
  // Better approach: check body text or list
  cy.get("body").then(($body) => {
    if (!$body.text().includes(plantName)) {
      cy.log(`Creating Plant ${plantName}...`);
      cy.visit("/ui/plants/add");
      cy.get('input[name="name"]').type(plantName);
      cy.get('select[name="category"]').then(($select) => {
        const options = $select.find("option");
        if (options.length > 1) {
          cy.wrap($select).select(options[1].value);
        } else {
          cy.wrap($select).select(options[0].value);
        }
      });
      cy.get('input[name="price"]').type("20.00");
      cy.get('input[name="quantity"]').type("10");
      cy.contains("button", "Save").click();
      cy.contains(plantName).should("be.visible");
    }
  });
});

When("I click the Edit button for plant {string}", (plantName) => {
  cy.contains("tr", plantName)
    .find("button, a")
    .filter(":not(.btn-danger)") // Exclude Delete button
    .first()
    .click();
});

Then("the plant name should remain {string}", (plantName) => {
  cy.contains("tr", plantName).should("be.visible");
});
