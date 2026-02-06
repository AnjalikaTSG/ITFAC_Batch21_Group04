const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

Given("I am logged in as admin", () => {
  cy.visit("/ui/login");
  cy.get('input[name="username"]').type("admin");
  cy.get('input[name="password"]').type("admin123");
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});

//add a new plant with valid data - UI_Aamin
When("I add a new plant with valid data", () => {
  cy.visit("/ui/plants");
  cy.contains("Add a Plant").click();
  cy.get('input[name="name"]').type("Money Plant");
  cy.get("select#categoryId").select("Sub_Us_02");
  cy.get('input[name="price"]').type("15.00");
  cy.get('input[name="quantity"]').type("20");
  cy.contains("button", "Save").click();
});

Then("the new plant should appear in the list", () => {
  cy.url().should("include", "/ui/plants");
  cy.contains("Money Plant").should("be.visible");
});

//add a new plant with quantity below 5 to check Low badge - UI_Aamin
When("I add a new plant with quantity below 5", () => {
  cy.visit("/ui/plants");
  cy.contains("Add a Plant").click();
  cy.get('input[name="name"]').type("Low Stock Plant");
  cy.get("select#categoryId").select(1);
  cy.get('input[name="price"]').type("10.00");
  cy.get('input[name="quantity"]').type("2");
  cy.contains("button", "Save").click();
  cy.url().should("include", "/ui/plants");
});

Then("the new plant should display a Low badge", () => {
  cy.url().should("include", "/ui/plants");
  cy.get("table")
    .contains("td", "Low Stock Plant")
    .parent("tr")
    .within(() => {
      cy.contains("Low").should("be.visible");
    });
});

When("I view the plant list", () => {
  cy.visit("/ui/plants");
});

Then("a plant with a Low badge should be visible in the list", () => {
  cy.get("table").contains("Low").should("be.visible");
});

//add a plant with negative price - UI_Admin
When("I try to add a plant with negative price", () => {
  cy.visit("/ui/plants");
  cy.contains("Add a Plant").click();
  cy.get('input[name="name"]').type("Invalid Price Plant");
  cy.get("select#categoryId").select(1); // Select first category or adjust as needed
  cy.get('input[name="price"]').type("-5.00");
  cy.get('input[name="quantity"]').type("10");
  cy.contains("button", "Save").click();
});

Then("a price validation error should be shown", () => {
  cy.get('input[name="price"]')
    .parent()
    .should("contain", "Price must be greater than 0");
  cy.url().should("include", "/ui/plants/add");
});

//add a plant with a short name - UI_Admin
When("I try to add a plant with a short name", () => {
  cy.visit("/ui/plants");
  cy.contains("Add a Plant").click();
  cy.get('input[name="name"]').type("Ab");
  cy.get("select#categoryId").select(1);
  cy.get('input[name="price"]').type("10.00");
  cy.get('input[name="quantity"]').type("10");
  cy.contains("button", "Save").click();
});

Then("a name length validation error should be shown", () => {
  cy.get('input[name="name"]')
    .parent()
    .parent()
    .should("contain", "Plant name must be between 3 and 25 characters");
  cy.url().should("include", "/ui/plants/add");
});

//delete a plant by name - UI_Admin
When("I delete the plant named {string}", (plantName) => {
  cy.visit("/ui/plants");
  // Stub the confirmation dialog to auto-accept
  cy.window().then((win) => {
    cy.stub(win, "confirm").returns(true);
  });
  cy.get("table")
    .contains("td", plantName)
    .parent("tr")
    .within(() => {
      cy.get('button[title="Delete"]').click();
    });
});

Then("the plant {string} should not be visible in the list", (plantName) => {
  cy.visit("/ui/plants");
  cy.get("table tbody").should("not.contain", plantName);
});

//paginated list of plants should be visible - UI_User
Given("I am logged in as a test user", () => {
  cy.visit("/ui/login");
  cy.get('input[name="username"]').type("testuser");
  cy.get('input[name="password"]').type("test123");
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});

When("I navigate to the Plant List page", () => {
  cy.contains("Plants").click();
  cy.url().should("include", "/ui/plants");
});

Then("the paginated list of plants should be visible", () => {
  cy.get("table").should("be.visible");
  cy.get("table tbody tr").should("have.length.greaterThan", 0);
  cy.get(".pagination").should("be.visible");
});

Then("no Add, Edit, or Delete controls should be present", () => {
  cy.contains("Add a Plant").should("not.exist");
  // Allow 'Edit' and 'Delete' in the table header, but not in the body
  cy.get("table thead").should("contain", "Actions");
  cy.get("table tbody").should("not.contain", "Edit");
  cy.get("table tbody").find("button, a").should("not.exist");
});

Given("a plant named {string} exists in the list", (plantName) => {
  cy.url().then((url) => {
    if (!url.includes("/ui/plants")) {
      cy.visit("/ui/plants");
    }
  });
  cy.get("body").then(($body) => {
    if (!$body.text().includes(plantName)) {
      cy.contains("Add a Plant").click();
      cy.get('input[name="name"]').clear().type(plantName);
      cy.get("select#categoryId").select(1);
      cy.get('input[name="price"]').clear().type("10.00");
      cy.get('input[name="quantity"]').clear().type("10");
      cy.contains("button", "Save").click();
      cy.url().should("include", "/ui/plants");
      cy.contains(plantName).should("be.visible");
    }
  });
});

When("I search for the plant {string}", (plantName) => {
  cy.get('input[placeholder="Search plant"]').clear().type(plantName);
  cy.contains("button", "Search").click();
});

Then("only the plant {string} should be visible in the list", (plantName) => {
  cy.get("table tbody tr").each(($row) => {
    cy.wrap($row).contains("td", plantName).should("be.visible");
  });
});

Given("multiple plants with different prices exist", () => {
  cy.visit("/ui/plants");

  cy.get("table tbody tr").should("have.length.greaterThan", 2);
  cy.get("table tbody tr td:nth-child(4)").then(($cells) => {
    const prices = [...$cells].map((cell) => parseFloat(cell.innerText));
    const uniquePrices = Array.from(new Set(prices));
    expect(uniquePrices.length).to.be.greaterThan(1);
  });
});

When("I sort the plant list by Price", () => {
  cy.contains("th", /Price/i).find("a").click();
});

Then("the plants should be ordered by Price", () => {
  cy.get("table thead tr th").then(($headers) => {
    const priceIndex = [...$headers].findIndex((th) =>
      th.innerText.trim().toLowerCase().includes("price"),
    );
    expect(priceIndex, "Price column should be found").to.be.greaterThan(-1);

    cy.get(`table tbody tr td:nth-child(${priceIndex + 1})`).should(
      ($cells) => {
        // Extract prices as numbers
        const prices = [...$cells].map((cell) => {
          const text = cell.innerText.replace(/[^0-9.-]+/g, "");
          return parseFloat(text);
        });

        // Verify at least some data exists to make the sort check meaningful
        expect(prices.length).to.be.greaterThan(0);

        // Check for Ascending or Descending order
        const isSortedAsc = prices.every(
          (val, i, arr) => !i || arr[i - 1] <= val,
        );
        const isSortedDesc = prices.every(
          (val, i, arr) => !i || arr[i - 1] >= val,
        );

        expect(
          isSortedAsc || isSortedDesc,
          `Expected prices to be sorted. Found: ${prices.join(", ")}`,
        ).to.be.true;
      },
    );
  });
});

Then("the Add Plant button should not be visible", () => {
  cy.contains("button", "Add a Plant").should("not.exist");
  cy.contains("Add a Plant").should("not.exist");
});

Given("a plant with ID {int} exists", (plantId) => {
  cy.visit(`/ui/plants`);
});

When("I manually visit the Edit Plant page for ID {int}", (plantId) => {
  cy.visit(`/ui/plants/edit/${plantId}`);
});

Then("I should see an Access Denied page", () => {
  cy.contains("403").should("be.visible");
  cy.contains(/Access Denied|Forbidden/i).should("be.visible");

  cy.get("form").should("not.exist");
});

Given("a sales record exists for the plant {string}", (plantName) => {
  cy.visit("/ui/sales");

  cy.get("body").then(($body) => {
    if ($body.text().includes(plantName)) {
      cy.log(`Sales record for ${plantName} already exists`);
    } else {
      // Create a sales record - look for the button
      cy.get("body").then(($page) => {
        if ($page.text().includes("Sell Plant")) {
          cy.contains("Sell Plant").click();
        } else if ($page.text().includes("Add a Sale")) {
          cy.contains("Add a Sale").click();
        } else {
          cy.get('a[href*="/sales/add"]').first().click();
        }
      });

      cy.get("select#plantId").select(plantName);
      cy.get('input[name="quantity"]').clear().type("1");
      cy.contains("button", "Save").click();
    }
  });
});

When("I attempt to delete the plant {string}", (plantName) => {
  cy.window().then((win) => {
    cy.stub(win, "confirm").returns(true);
  });
  cy.get("table")
    .contains("td", plantName)
    .parent("tr")
    .within(() => {
      cy.get('button[title="Delete"]').click();
    });
});

Then("the system should not crash or show a 500 error", () => {
  // Verify no 500 error or crash
  cy.url().should("not.include", "500");
  cy.get("body").should("not.contain", "500 Internal Server Error");
  cy.get("body").should("not.contain", "Application Error");
});

Then("a graceful validation message should be displayed", () => {
  // Check for a validation message about referential integrity
  cy.get("body").should("contain.text", "Cannot delete plant");
  cy.get("body").should(
    "match",
    /Cannot delete plant.*sales|records exist.*sales|plant.*linked.*sales/i,
  );
});

Then("the plant {string} should still be visible in the list", (plantName) => {
  cy.visit("/ui/plants"); // Refresh the plant list
  cy.get("table tbody").should("contain", plantName);
  cy.contains(plantName).should("be.visible");
});

Given("User is logged as {string} Role", (role) => {
  cy.visit("/ui/login");
  if (role.toLowerCase() === "admin") {
    cy.get('input[name="username"]').type("admin");
    cy.get('input[name="password"]').type("admin123");
  } else {
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("test123");
  }
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});

When("User clicks on {string} in the sidebar", (menuItem) => {
  cy.contains(menuItem).click();
  if (menuItem.toLowerCase() === "plants") {
    cy.url().should("include", "/ui/plants");
  }
});

When("User locates the Delete button for the plant {string}", (plantName) => {
  cy.get("table").contains("td", plantName).should("be.visible");
});

When("User clicks the Delete button for {string}", (plantName) => {
  cy.window().then((win) => {
    cy.stub(win, "confirm").returns(true);
  });
  cy.get("table")
    .contains("td", plantName)
    .parent("tr")
    .within(() => {
      cy.get('button[title="Delete"]').click();
    });
});

Then(
  "the application should display an error instead of deleting the plant",
  () => {
    cy.wait(1000);

    cy.url().should("not.include", "500");
    cy.get("body").should("not.contain", "Whitelabel Error Page");
    cy.get("body").should("not.contain", "500 Internal Server Error");
    cy.get("body").should("not.contain", "Internal Server Error");
    cy.get("body").should("not.contain", "status=500");

    cy.get("body").should(
      "match",
      /Cannot delete|Error deleting|constraint|foreign key|sales|records exist/i,
    );

    cy.url().should("include", "/ui/plants");
  },
);

Then("the system should display the updated plant list", () => {
  cy.get("table.table").should("be.visible");
  cy.get("table tbody tr").should("have.length.greaterThan", 0);
  cy.contains("Plants").should("be.visible");
});
