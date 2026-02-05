Feature: Category API

  @API_Ad_05_214064R
  Scenario: API Error Handling (Global)
    Given I have a valid admin token
    When I send a POST request to "/api/categories" with invalid data type
    Then I should receive a 400 Bad Request status
    And the response should contain a clear error message
