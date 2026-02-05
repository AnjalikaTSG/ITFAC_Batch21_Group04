Feature: Plants API

  @API_Us_05_214064R
  Scenario: Verify Sorting by Name
    Given I have a valid user token
    And there are multiple plants in the database
    When I send a GET request to plants endpoint "/api/plants/paged" with sort "name,asc"
    Then I should receive a 200 OK status
    And the plants list should be sorted by Name ascending
