Feature: Sales Management API (Standard User)

  Background:
    # Precondition: Login as a Standard User to get the Token
    Given I am authenticated as a Standard User via API

  Scenario: GET Sales List - Authorized (API_Us_01_214025B)
    When I send a GET request to fetch all sales
    Then the response status code should be 200
    And the response body should be a list of sales

  Scenario: Security: POST Create Sale - Forbidden (API_Us_02_214025B)
    When I attempt to create a sale for Plant ID 1 as a Standard User
    Then the response status code should be 403

  Scenario: Security: DELETE Sale - Forbidden (API_Us_03_214025B)
    When I attempt to delete Sale ID 1 as a Standard User
    Then the response status code should be 403

  Scenario: GET Specific Sale by ID (API_Us_04_214025B)
    When I send a GET request for Sale ID 23 as a Standard User
    Then the response status code should be 200
    And the response body should contain a generated ID

  Scenario: Security: Unauthorized Access - No Token (API_Us_05_214025B)
    When I send a GET request to fetch all sales without an auth token
    Then the response status code should be 401