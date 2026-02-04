Feature: Sales Management API

  Background:
    Given I am authenticated as Admin via API

  Scenario: POST Create Sale - Valid Request (API_Ad_01_214025B)
    Given I have a payload for a new sale with Plant ID 1 and Quantity 3
    When I send a POST request to "/api/sales/plant/{id}"
    Then the response status code should be 201
    And the response body should contain a generated ID

  Scenario: Integration: Stock Reduction Check (API_Ad_02_214025B)
    Given I check the current stock of Plant ID 1
    When I create a sale for Plant ID 1 with Quantity 2
    Then the stock of Plant ID 1 should be reduced by 2