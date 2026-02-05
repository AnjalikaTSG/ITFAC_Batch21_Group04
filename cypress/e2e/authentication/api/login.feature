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
