Feature: Authentication API

  @API_Ad_01_214064R
  Scenario: Admin Token Generation - Valid
    When I send a POST request to "/api/auth/login" with admin credentials
    Then I should receive a 200 OK status
    And the response should contain a valid JWT token

  @API_Ad_02_214064R
  Scenario: Admin Endpoint Access - With Token
    Given I have a valid admin token
    When I send a GET request to "/api/sales" with the token
    Then I should receive a 200 OK status
    And the response should contain admin data

  @API_Ad_03_214064R
  Scenario: Admin - Privilege Escalation
    Given I have a valid user token
    When I send a DELETE request to "/api/categories/999" with the user token
    Then I should receive a 403 Forbidden status

#  @API_Us_01_214064R
#  Scenario: User Token - Refresh
#    Given I have a valid refresh token
#    When I send a POST request to "/api/auth/refresh" with the refresh token
#    Then I should receive a 200 OK status
#    And the response should contain a new access token

  @API_Us_02_214064R
  Scenario: User Endpoint Access - With Token
    Given I have a valid user token
    When I send a GET request to "/api/plants" with the user token
    Then I should receive a 200 OK status

  @API_Us_03_214064R
  Scenario: User Access to Another User's Data
    Given I have a valid user token for User A
    When I send a DELETE request to "/api/sales/999" with the user token
    Then I should receive a 403 Forbidden or 404 Not Found status




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



  @API_Us_05_214064R
  Scenario: Verify Sorting by Name
    Given I have a valid user token
    And there are multiple plants in the database
    When I send a GET request to plants endpoint "/api/plants/paged" with sort "name,asc"
    Then I should receive a 200 OK status
    And the plants list should be sorted by Name ascending
  


  @API_Ad_05_214064R
  Scenario: API Error Handling (Global)
    Given I have a valid admin token
    When I send a POST request to "/api/categories" with invalid data type
    Then I should receive a 400 Bad Request status
    And the response should contain a clear error message