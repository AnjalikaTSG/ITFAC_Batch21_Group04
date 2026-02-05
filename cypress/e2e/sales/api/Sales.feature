Feature: Sales API

  @API_Ad_04_214064R
  Scenario: GET Sales List with Pagination
    Given I have a valid admin token
    And there are at least 20 sales records
    When I send a GET request to "/api/sales/page" with page "0" and size "5"
    Then I should receive a 200 OK status
    And the response content should be a valid list

  @API_Us_04_214064R
  Scenario: GET Sales with Filter Params
    Given I have a valid user token
    When I send a GET request to sales endpoint "/api/sales/page" with sort "totalPrice,desc"
    Then I should receive a 200 OK status
    And the list should be sorted by Total Price descending
