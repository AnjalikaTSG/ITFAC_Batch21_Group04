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
    When I send a POST request to create a plant under category ID 6
    Then the response status code should be 200 or 201
    And the response body should contain the created plant with a generated ID
    And the plant name in response should be "Testing Rose"

  @API_Ad_02_215011L @negative @validation
  Scenario: API_Ad_02_215011L - Verify API validation for Negative Quantity
    Given I have plant details with name "Negative Qty Plant" and price 10.0 and quantity -5
    When I send a POST request to create a plant under category ID 9
    Then the response status code should be 400
    And the response body should contain a validation error message "Quantity cannot be negative"

  @API_Ad_03_215011L @get @positive
  Scenario: API_Ad_03_215011L - Verify API request to Get All Plants
    When I send a GET request to retrieve all plants
    Then the response status code should be 200
    And the response body should be a JSON array of plant objects

  @API_Ad_04_215011L @edit @negative
  Scenario: API_Ad_04_215011L - Verify API request to Edit a Plant
    Given a plant with ID 130 exists
    When I send a PUT request to update plant ID 130 with name "Editeded Name" and price 50.0
    Then the response status code should be 400
    And the response body should contain a validation error message "Quantity is required"

  @API_Ad_05_215011L @delete @negative
  Scenario: API_Ad_05_215011L - Verify Delete Non-Existent Plant
    Given a plant with ID 9999 does not exist
    When I send a DELETE request to remove plant ID 9999
    Then the response status code should be 204
    And the response body should be empty

  @API_Us_01_215011L @get @user
  Scenario: API_Us_01_215011L - Verify User can retrieve Plant List via API
    Given I have a valid user authentication token
    When I send a GET request to retrieve all plants
    Then the response status code should be 200
    And the response body should be a JSON array of plant objects

  @API_Us_02_215011L @get @user
  Scenario: API_Us_02_215011L - Verify User can Filter Plants by Category via API
    Given I have a valid user authentication token
    When I send a GET request to retrieve plants filtered by category ID 1
    Then the response status code should be 200
    And the response body should only contain plants in category ID 1

  @API_Us_03_215011L @post @user @forbidden
  Scenario: API_Us_03_215011L - Verify User is Forbidden from Adding Plants
    Given I have a valid user authentication token
    And I have plant details with name "Test Plant" and price 100.00 and quantity 10
    When I send a POST request to create a plant under category ID 8
    Then the response status code should be 403
    And the response body should contain a forbidden error message

  @API_Us_04_215011L @delete @user @forbidden
  Scenario: API_Us_04_215011L - Verify User is Forbidden from Deleting Plants
    Given I have a valid user authentication token
    And a plant with ID 1 exists
    When I send a DELETE request to remove plant ID 1
    Then the response status code should be 403
    And the response body should contain a forbidden error message

@API_Us_05_215011L @put @user @forbidden
  Scenario: API_Us_05_215011L - Verify User is Forbidden from Editing Plants
    Given I have a valid user authentication token
    And a plant with ID 1 exists
    When I send a PUT request to update plant ID 1 with name "Any Name", price 900.00, and quantity 1
    Then the response status code should be 403
    And the response body should contain a forbidden error message