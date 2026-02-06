import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const CATEGORY_LIST_URL = "/ui/categories";
const CATEGORY_ADD_URL = "/ui/categories/add";

function navigateToCategoryList() {
  cy.visit(CATEGORY_LIST_URL);
}

function openAddCategoryForm() {
  cy.contains("a", "Add A Category").click();
}

function enterCategoryName(name) {
  cy.get("input").first().clear().type(name);
}

function selectParentCategory(name) {
  cy.get("select").first().select(name);
}

function saveCategoryForm() {
  cy.contains("button", "Save").click();
}

function ensureCategoryExists(name) {
  navigateToCategoryList();
  cy.contains("body", name).then(($el) => {
    if ($el.length === 0) {
      openAddCategoryForm();
      enterCategoryName(name);
      saveCategoryForm();
      navigateToCategoryList();
    }
  });
}

function clickEditForCategory(name) {
  cy.contains("table tbody tr", name)
    .first()
    .within(() => {
      cy.get("button, a").first().click();
    });
}

function clickDeleteForCategory(name) {
  cy.contains("table tbody tr", name)
    .first()
    .within(() => {
      cy.get("button, a").eq(1).click();
    });
}

// Login

Given("I open the application login page", () => {
  cy.visit("/ui/login");
});

When(
  "I enter valid username {string} and password {string}",
  (username, password) => {
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
  }
);

When("I click the login button", () => {
  cy.get('button[type="submit"]').click();
});

Then("I should see the dashboard page", () => {
  cy.url().should("include", "/dashboard");
});

// ---------- When steps ----------

When("I navigate to the category list page", () => {
  navigateToCategoryList();
});

When("I click the Add Category button", () => {
  openAddCategoryForm();
});

When("I enter category name {string}", (name) => {
  enterCategoryName(name);
});

When("I leave the parent category as main", () => {
  // No action needed since the default is main category
});

When("I select parent category {string}", (parentName) => {
  selectParentCategory(parentName);
});

When("I save the category form", () => {
  saveCategoryForm();
});

When("I ensure there is at least one main category named {string}", (name) => {
  ensureCategoryExists(name);
});

When("I leave the category name empty", () => {
  cy.get("input").first().clear();
});

When("I click the edit button for category {string}", (name) => {
  clickEditForCategory(name);
});

When("I change the category name to {string}", (newName) => {
  enterCategoryName(newName);
});

When("I click the delete button for category {string}", (name) => {
  clickDeleteForCategory(name);
});

When("I confirm the category delete popup", () => {
  cy.on("window:confirm", () => true);
});

When("I click the ID column header", () => {
  cy.contains("th", "ID").click();
});

When("I search categories by name {string}", (searchText) => {
  cy.get('input[placeholder*="Search"], input[type="search"]')
    .clear()
    .type(searchText);
  cy.contains("button", "Search").click();
});

When("I filter categories by parent {string}", (parentName) => {
  cy.get("select").first().select(parentName);
  cy.contains("button", "Search").click();
});

When("I open the add category page URL directly", () => {
  cy.visit(CATEGORY_ADD_URL);
});

// ---------- Then steps ----------

Then("I should see the category {string} in the category list", (name) => {
  navigateToCategoryList();
  cy.contains("table tbody tr", name).should("exist");
});

Then("I should not see the category {string} in the category list", (name) => {
  navigateToCategoryList();
  cy.contains("table tbody tr", name).should("not.exist");
});

Then("I should see the category name required validation message", () => {
  cy.contains("Category name is required").should("be.visible");
});

Then("I should see the category name length validation message", () => {
  cy.contains("Category name must be between 3 and 10 characters").should(
    "be.visible"
  );
});

Then("I should see the category table displayed", () => {
  cy.get("table").should("be.visible");
});

Then(
  "the category search results should show only categories related to {string}",
  (name) => {
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).should("contain.text", name);
    });
  }
);

Then(
  "the category list should show only sub categories of {string}",
  (parentName) => {
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).should("contain.text", parentName);
    });
  }
);

Then("I should not see the Add Category button", () => {
  cy.contains("button", "Add A Category").should("not.exist");
});

Then("I should not see edit or delete buttons for categories", () => {
  cy.get("table tbody tr").each(($row) => {
    cy.wrap($row).find("button, a").should("have.length", 0);
  });
});

Then("I should see the access denied page for categories", () => {
  cy.url().should("include", "/403");
});

Then(
  "the category list should be sorted by ID in ascending or descending order",
  () => {
    cy.get("table tbody tr")
      .then(($rows) => {
        const ids = [];
        $rows.each((_, row) => {
          const text = Cypress.$(row).find("td").first().text().trim();
          const num = Number(text);
          if (!Number.isNaN(num)) {
            ids.push(num);
          }
        });
        return ids;
      })
      .then((ids) => {
        const asc = [...ids].sort((a, b) => a - b);
        const desc = [...ids].sort((a, b) => b - a);
        const isAsc = ids.every((v, i) => v === asc[i]);
        const isDesc = ids.every((v, i) => v === desc[i]);
        expect(isAsc || isDesc).to.be.true;
      });
  }
);
