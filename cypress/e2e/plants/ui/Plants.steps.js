const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given('I am logged in as admin', () => {
  cy.visit('/ui/login');
  cy.get('input[name="username"]').type('admin');
  cy.get('input[name="password"]').type('admin123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

//add a new plant with valid data - UI_Aamin
When('I add a new plant with valid data', () => {
  cy.visit('/ui/plants');
  cy.contains('Add a Plant').click();
  cy.get('input[name="name"]').type('Money Plant');
  cy.get('select#categoryId').select('Ferns');
  cy.get('input[name="price"]').type('15.00');
  cy.get('input[name="quantity"]').type('20');
  cy.contains('button', 'Save').click();
});

Then('the new plant should appear in the list', () => {
  cy.url().should('include', '/ui/plants');
  cy.contains('Money Plant').should('be.visible');
});

//add a new plant with quantity below 5 to check Low badge - UI_Aamin
When('I add a new plant with quantity below 5', () => {
  cy.visit('/ui/plants');
  cy.contains('Add a Plant').click();
  cy.get('input[name="name"]').type('Low Stock Plant');
  cy.get('select#categoryId').select(1); // Select first category or adjust as needed
  cy.get('input[name="price"]').type('10.00');
  cy.get('input[name="quantity"]').type('2');
  cy.contains('button', 'Save').click();
  cy.url().should('include', '/ui/plants');
});

Then('the new plant should display a Low badge', () => {
  cy.url().should('include', '/ui/plants');
  cy.get('table').contains('td', 'Low Stock Plant').parent('tr').within(() => {
    cy.contains('Low').should('be.visible');
  });
});

When('I view the plant list', () => {
  cy.visit('/ui/plants');
});

Then('a plant with a Low badge should be visible in the list', () => {
  cy.get('table').contains('Low').should('be.visible');
});

//add a plant with negative price - UI_Admin
When('I try to add a plant with negative price', () => {
  cy.visit('/ui/plants');
  cy.contains('Add a Plant').click();
  cy.get('input[name="name"]').type('Invalid Price Plant');
  cy.get('select#categoryId').select(1); // Select first category or adjust as needed
  cy.get('input[name="price"]').type('-5.00');
  cy.get('input[name="quantity"]').type('10');
  cy.contains('button', 'Save').click();
});

Then('a price validation error should be shown', () => {
  cy.get('input[name="price"]').parent().should('contain', 'Price must be greater than 0');
  cy.url().should('include', '/ui/plants/add'); // Still on add page
});

//add a plant with a short name - UI_Admin
When('I try to add a plant with a short name', () => {
  cy.visit('/ui/plants');
  cy.contains('Add a Plant').click();
  cy.get('input[name="name"]').type('Ab');
  cy.get('select#categoryId').select(1); // Select first category or adjust as needed
  cy.get('input[name="price"]').type('10.00');
  cy.get('input[name="quantity"]').type('10');
  cy.contains('button', 'Save').click();
});

Then('a name length validation error should be shown', () => {
  cy.get('input[name="name"]').parent().parent().should('contain', 'Plant name must be between 3 and 25 characters');
  cy.url().should('include', '/ui/plants/add'); // Still on add page
});

//delete a plant by name - UI_Admin
When('I delete the plant named {string}', (plantName) => {
  cy.visit('/ui/plants');
  // Stub the confirmation dialog to auto-accept
  cy.window().then((win) => {
    cy.stub(win, 'confirm').returns(true);
  });
  cy.get('table').contains('td', plantName).parent('tr').within(() => {
    cy.get('button[title="Delete"]').click();
  });
});

Then('the plant {string} should not be visible in the list', (plantName) => {
  cy.visit('/ui/plants');
  cy.get('table tbody').should('not.contain', plantName);
});

//paginated list of plants should be visible - UI_User
Given('I am logged in as a test user', () => {
  cy.visit('/ui/login');
  cy.get('input[name="username"]').type('testuser');
  cy.get('input[name="password"]').type('test123');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

When('I navigate to the Plant List page', () => {
  cy.contains('Plants').click();
  cy.url().should('include', '/ui/plants');
});

Then('the paginated list of plants should be visible', () => {
  cy.get('table').should('be.visible');
  cy.get('table tbody tr').should('have.length.greaterThan', 0);
  cy.get('.pagination').should('be.visible');
});

Then('no Add, Edit, or Delete controls should be present', () => {
  cy.contains('Add a Plant').should('not.exist');
  // Allow 'Edit' and 'Delete' in the table header, but not in the body
  cy.get('table thead').should('contain', 'Actions');
  cy.get('table tbody').should('not.contain', 'Edit');
  cy.get('table tbody').find('button, a').should('not.exist');
  // Optionally, ensure there are no action buttons or links in the body
});

Given('a plant named {string} exists in the list', (plantName) => {
  cy.url().then((url) => {
    if (!url.includes('/ui/plants')) {
      cy.visit('/ui/plants');
    }
  });
  cy.get('body').then(($body) => {
    if (!$body.text().includes(plantName)) {
      cy.contains('Add a Plant').click();
      cy.get('input[name="name"]').clear().type(plantName);
      cy.get('select#categoryId').select(1); // Adjust as needed
      cy.get('input[name="price"]').clear().type('10.00');
      cy.get('input[name="quantity"]').clear().type('10');
      cy.contains('button', 'Save').click();
      cy.url().should('include', '/ui/plants');
      cy.contains(plantName).should('be.visible');
    }
  });
});

When('I search for the plant {string}', (plantName) => {
  cy.get('input[placeholder="Search plant"]').clear().type(plantName);
  cy.contains('button', 'Search').click();
});

Then('only the plant {string} should be visible in the list', (plantName) => {
  cy.get('table tbody tr').each(($row) => {
    cy.wrap($row).contains('td', plantName).should('be.visible');
  });
});

Given('multiple plants with different prices exist', () => {
  cy.visit('/ui/plants');
  // Assert that there are at least 3 rows and at least 2 unique prices
  cy.get('table tbody tr').should('have.length.greaterThan', 2);
  cy.get('table tbody tr td:nth-child(4)').then($cells => {
    const prices = [...$cells].map(cell => parseFloat(cell.innerText));
    const uniquePrices = Array.from(new Set(prices));
    expect(uniquePrices.length).to.be.greaterThan(1);
  });
});

When('I sort the plant list by Price', () => {
  cy.contains('th', 'Price').click();
});

Then('the plants should be ordered by Price', () => {
  cy.get('table thead tr th').then($headers => {
    const priceIndex = [...$headers].findIndex(th => th.innerText.trim().toLowerCase() === 'price');
    expect(priceIndex).to.be.greaterThan(-1);

    cy.get(`table tbody tr td:nth-child(${priceIndex + 1})`).then($cells => {
      const prices = [...$cells].map(cell => parseFloat(cell.innerText));
      const isSortedAsc = prices.every((v, i, a) => !i || a[i - 1] <= v);
      const isSortedDesc = prices.every((v, i, a) => !i || a[i - 1] >= v);

      if (!(isSortedAsc || isSortedDesc)) {
        // Try toggling the sort direction by clicking the header again
        cy.get('table thead tr th').eq(priceIndex).click();
        cy.get(`table tbody tr td:nth-child(${priceIndex + 1})`).then($cells2 => {
          const prices2 = [...$cells2].map(cell => parseFloat(cell.innerText));
          const isSortedAsc2 = prices2.every((v, i, a) => !i || a[i - 1] <= v);
          const isSortedDesc2 = prices2.every((v, i, a) => !i || a[i - 1] >= v);
          expect(isSortedAsc2 || isSortedDesc2, `Prices are sorted: ${prices2.join(', ')}`).to.be.true;
        });
      } else {
        expect(true).to.be.true;
      }
    });
  });
});

Then('the Add Plant button should not be visible', () => {
  cy.contains('button', 'Add a Plant').should('not.exist');
  cy.contains('Add a Plant').should('not.exist'); // Covers both button and plain text
});

Given('a plant with ID {int} exists', (plantId) => {
  // Optionally, ensure the plant exists. If not needed, leave this empty or check for its presence.
  cy.visit(`/ui/plants`);
  // Optionally check for the row, or skip if always present in your test DB.
});

When('I manually visit the Edit Plant page for ID {int}', (plantId) => {
  cy.visit(`/ui/plants/edit/${plantId}`);
});

Then('I should see an Access Denied page', () => {
  cy.contains('403').should('be.visible');
  cy.contains(/Access Denied|Forbidden/i).should('be.visible');
  // Optionally, check that the edit form is not present
  cy.get('form').should('not.exist');
});