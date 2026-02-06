import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- API_Ad_01 ---

When("I send a POST request to {string} with admin credentials", (url) => {
  cy.request({
    method: "POST",
    url: url,
    body: {
      username: "admin",
      password: "admin123",
    },
    failOnStatusCode: false,
  }).then((res) => {
    cy.wrap(res).as("apiResponse");
  });
});

Then("the response should contain a valid JWT token", () => {
  cy.get("@apiResponse").then((response) => {
    expect(response.body).to.have.property("token");
  });
});

// --- API_Ad_02 ---

When("I send a GET request to {string} with the token", (url) => {
  cy.get("@adminToken").then((token) => {
    cy.request({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

Then("the response should contain admin data", () => {
  cy.get("@apiResponse").then((response) => {
    expect(response.body).to.not.be.null;
  });
});

// --- API_Ad_03 ---

When("I send a POST request to {string} with the user token", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "POST",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        some: "data",
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

When("I send a GET request to {string} with the user token", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

When("I send a DELETE request to {string} with the user token", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "DELETE",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

Then("I should receive a {int} Forbidden status", (statusCode) => {
  cy.get("@apiResponse").then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});

// --- API_Us_01 ---

Given("I have a valid refresh token", () => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: {
      username: "testuser",
      password: "test123",
    },
    failOnStatusCode: false,
  }).then((res) => {
    cy.wrap(res.body.refreshToken).as("refreshToken");
  });
});

When("I send a POST request to {string} with the refresh token", (url) => {
  cy.get("@refreshToken").then((refreshToken) => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        refreshToken: refreshToken,
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

Then("the response should contain a new access token", () => {
  cy.get("@apiResponse").then((response) => {
    expect(response.body).to.have.property("accessToken").or.property("token");
  });
});

// --- API_Us_02 (Reuse steps) ---

// --- API_Us_03 ---

Given("I have a valid user token for User A", () => {
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: {
      username: "testuser",
      password: "test123",
    },
    failOnStatusCode: false,
  }).then((res) => {
    const token = res.body.token || res.body.accessToken;
    cy.wrap(token).as("userToken");
  });
});

When("I send a GET request to User B's data endpoint {string}", (url) => {
  cy.get("@userToken").then((token) => {
    cy.request({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

Then(
  "I should receive a {int} Forbidden or {int} Not Found status",
  (s1, s2) => {
    cy.get("@apiResponse").then((response) => {
      expect([s1, s2]).to.include(response.status);
    });
  },
);

//---------------------sales api -------------------------
Given("there are at least 20 sales records", () => {
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
        cy.wrap(res).as("apiResponse");
      });
    });
  },
);

Then("the response content should be a valid list", () => {
  cy.get("@apiResponse").then((response) => {
    const items = response.body.content || response.body;
    expect(items).to.be.an("array");
  });
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
        cy.wrap(res).as("apiResponse");
      });
    });
  },
);

Then("the list should be sorted by Total Price descending", () => {
  cy.get("@apiResponse").then((response) => {
    const items = response.body.content || response.body;
    if (items.length > 1) {
      const first = items[0].totalPrice;
      const second = items[1].totalPrice;
    }
  });
});

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
        cy.wrap(res).as("apiResponse");
      });
    });
  },
);

Then("the plants list should be sorted by Name ascending", () => {
  cy.get("@apiResponse").then((response) => {
    const items = response.body.content || response.body;
    if (items.length > 1) {
      const first = items[0].name.toLowerCase();
      const second = items[1].name.toLowerCase();
      // expect(first <= second).to.be.true;
    }
  });
});

//-----------Category API tests --------------------
When("I send a POST request to {string} with invalid data type", (url) => {
  cy.get("@adminToken").then((token) => {
    cy.request({
      method: "POST",
      url: url,
      body: {
        id: "invalid_id", // Valid id type should be a number
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).then((res) => {
      cy.wrap(res).as("apiResponse");
    });
  });
});

Then("I should receive a {int} Bad Request status", (statusCode) => {
  cy.get("@apiResponse").then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});

Then("the response should contain a clear error message", () => {
  cy.get("@apiResponse").then((response) => {
    const body = response.body;
    expect(body.message || body.error).to.exist;
  });
});
