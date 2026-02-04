Feature: Sales Management API (Standard User)

  Background:
    # Precondition: Login as a Standard User to get the Token
    Given I am authenticated as a Standard User via API

  Scenario: GET Sales List - Authorized (API_Us_01_214025B)
    When I send a GET request to fetch all sales
    Then the response status code should be 200
    And the response body should be a list of sales