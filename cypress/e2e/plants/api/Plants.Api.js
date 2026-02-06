// API Base URL from cypress config
const API_BASE_URL = Cypress.config("baseUrl");

// Helper function to get headers
export const getHeaders = (authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "accept": "application/json"
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
};

// Login API - Get admin authentication token
export const loginAdmin = () => {
  return cy.request({
    method: "POST",
    url: `${API_BASE_URL}/api/auth/login`,
    body: {
      username: "admin",
      password: "admin123"
    },
    failOnStatusCode: false
  });
};

// Get all plants
export const getAllPlants = (headers) => {
  return cy.request({
    method: "GET",
    url: `${API_BASE_URL}/api/plants`,
    headers: headers,
    failOnStatusCode: false
  });
};

// Create a plant under a category
export const createPlant = (categoryId, plantData, headers) => {
  return cy.request({
    method: "POST",
    url: `${API_BASE_URL}/api/plants/category/${categoryId}`,
    headers: headers,
    body: plantData,
    failOnStatusCode: false
  });
};

// Delete a plant by ID
export const deletePlantById = (plantId, headers) => {
  return cy.request({
    method: "DELETE",
    url: `${API_BASE_URL}/api/plants/${plantId}`,
    headers: headers,
    failOnStatusCode: false
  });
};

// Find and delete plant by name
export const deleteExistingPlantByName = (plantName, headers) => {
  return getAllPlants(headers).then((res) => {
    if (res.status === 200 && Array.isArray(res.body)) {
      const existingPlant = res.body.find(p => p.name === plantName);
      if (existingPlant) {
        cy.log(`Found existing plant "${plantName}" with ID ${existingPlant.id}, deleting...`);
        return deletePlantById(existingPlant.id, headers).then((delRes) => {
          if (delRes.status === 200 || delRes.status === 204) {
            cy.log(`✓ Pre-cleanup: Deleted existing plant "${plantName}"`);
          }
        });
      }
    }
  });
};

// Build plant data object
export const buildPlantData = (name, price, quantity) => {
  return {
    id: 0,
    name: name,
    price: price,
    quantity: quantity,
    category: {
      id: 0,
      name: name,
      parent: null,
      subCategories: []
    }
  };
};
