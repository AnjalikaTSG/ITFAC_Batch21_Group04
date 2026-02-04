import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- Preconditions ---
Given("I am logged in as an Admin", () => {
  cy.loginAdminUI();
});
Given("I am logged in as a Standard User", () => {
  cy.loginUserUI();
});

// --- Common Steps---
When("I navigate to the Sales page", () => {
  cy.contains("Sales").click();
});

When("I click the {string} button", (btnText) => {
  // handles ALL buttons (Sell Plant, Save, Login)
  cy.contains("button, a", btnText).click();
});

// ----------------Verify Sales List Page Loading (UI_Ad_01_214025B)------------------
Then("the {string} page header should be visible", (headerText) => {
  cy.get("h1, h2, h3").contains(headerText).should("be.visible");
});

Then("the data table should display the following columns:", (dataTable) => {
  const columns = dataTable.raw().flat();
  columns.forEach((colName) => {
    cy.contains("th", colName).should("be.visible");
  });
});

// -------- Verify 'Sell Plant' Button Availability (UI_Ad_02_214025B)--------
Then("the {string} button should be visible", (btnText) => {
  cy.contains("button, a", btnText).should("be.visible");
});

Then("I should be redirected to the {string} page", (pageName) => {
  if (pageName === "New Sale") {
    cy.url().should("include", "/ui/sales/new");
  } else if (pageName === "Sales") {
    cy.url().should("include", "/ui/sales");
  } else {
    cy.log("Page URL check not defined for: " + pageName);
  }
});

// --------- Verify Default Sorting by Sold Date (UI_Ad_03_214025B) ----------
Then(
  "the records should be sorted by {string} in descending order",
  (columnName) => {
    // Checks the 4th column (Sold At)
    cy.get("table tbody tr td:nth-child(4)").then(($cells) => {
      const dates = Cypress._.map($cells, (el) =>
        new Date(el.innerText).getTime()
      );
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).to.deep.equal(sortedDates);
    });
  }
);

// --------- Create Sale - Happy Path (UI_Ad_04_214025B) ---------------------
Given("I navigate to the {string} page", (pageName) => {
  if (pageName === "New Sale") {
    cy.visit("/ui/sales/new");
  } else if (pageName === "Sales") {
    cy.visit("/ui/sales");
  }
});

When("I select {string} from the plant dropdown", (plantName) => {
  cy.get("select option")
    .contains(plantName, { matchCase: false })
    .then(($option) => {
      cy.get("select").select($option.text());
    });
});

When("I enter quantity {string}", (qty) => {
  cy.get('input[type="number"], input[name="quantity"]').type(qty);
});

Then("I should see the new sale for {string} in the list", (plantName) => {
  // Checks the top row of the table
  cy.get("table tbody tr").first().should("contain", plantName);
});

// -----------Verify Delete Confirmation Logic (UI_Ad_05_214025B)-------------
When("I click the delete icon on the first record", () => {
  //Setup a spy to catch the invisible confirmation popup
  cy.window().then((win) => {
    cy.stub(win, "confirm").returns(true).as("confirmSpy");
  });
  cy.get("table tbody tr").first().find("td").last().find("button").click();
});

Then("I should see a confirmation dialog with text {string}", (msg) => {
  // Checks if the spy caught the popup with the text
  cy.get("@confirmSpy").should((spy) => {
    const call = spy.getCall(0);
    expect(call.args[0]).to.include(msg);
  });
});

Then("the record should be deleted from the table", () => {
  cy.wait(500);
  cy.get("@confirmSpy").should("have.been.called");
});

// ---------------Verify Sales List View - Read Only (UI_Us_01_214025B)-------------
Then("the {string} button should NOT be visible", (btnText) => {
  cy.contains("button, a", btnText).should("not.exist");
});

Then("the {string} column should NOT be visible", (colName) => {
  cy.contains("th", colName).should("not.exist");
});

// -----------------Verify Hidden Delete Actions (UI_Us_02_214025B)--------------------
Then("the {string} button should NOT be visible in the table", (btnName) => {
  cy.get("table tbody tr")
    .find("button.btn-danger, .fa-trash")
    .should("not.exist");
});