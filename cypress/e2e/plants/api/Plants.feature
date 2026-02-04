@api @plants
Feature: Plants API - Admin Operations
  As an Admin user
  I want to manage plants via API
  So that I can create and manage plant inventory

  Background:
    Given the API base URL is configured
    And I have a valid admin authentication token

  @API_Ad_01_215011L @create @positive
  Scenario: API_Ad_01_215011L - Verify API request to Create a Plant
    Given I have plant details with name "Testing Rose" and price 10.0 and quantity 100
    When I send a POST request to create a plant under category ID 8
    Then the response status code should be 200 or 201
    And the response body should contain the created plant with a generated ID
    And the plant name in response should be "Testing Rose"
