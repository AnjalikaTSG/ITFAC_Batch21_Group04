Feature: Category API tests for admin and user

  
  # Admin API scenarios (6)
  

#API_Ad_01_214066B
  Scenario: Admin can create a main category successfully
    Given I am authenticated as "admin" with password "admin123" via API
    When I create a category via API with name "API_Ad_01" and no parent
    Then the API response status should be 201
    And the created category should have the name "API_Ad_01"

  Scenario: Admin cannot create a category with invalid name length
    Given I am authenticated as "admin" with password "admin123" via API
    When I create a category via API with name "Ab" and no parent
    Then the API response status should be 400

#API_Ad_02_214066B
  Scenario: Admin can update an existing category
    Given I am authenticated as "admin" with password "admin123" via API
    And I have created a category via API with name "API_Ad_01"
    When I update that category via API to have name "API_Ad_02"
    Then the API response status should be 200
    And the updated category should have the name "API_Ad_02"

#API_Ad_03_214066B
  Scenario: Admin can delete an existing category
    Given I am authenticated as "admin" with password "admin123" via API
    And I have created a category via API with name "API_Ad_02"
    When I delete that category via API
    Then the API response status should be 204

#API_Ad_04_214066B
  Scenario: Admin can list categories with pagination and search
    Given I am authenticated as "admin" with password "admin123" via API
    And I have created a category via API with name "API_Ad_04"
    When I get the category list via API with page "0" and size "5"
    Then the API response status should be 200
    When I search categories via API by name "API_Ad_04"
    Then the API response should contain at least one category with name "API_Ad_04"

#API_Ad_05_214066B
  Scenario: Category API requires authorization
    When I send a GET request to the Category API endpoint without authorization
    Then the API response status should be 401

  
  # User API scenarios (5)
  

#API_Us_01_214066B
  Scenario: User can get the category list
    Given I am authenticated as "testuser" with password "test123" via API
    When I get the category list via API with page "0" and size "10"
    Then the API response status should be 200

#API_Us_05_214066B
  Scenario: User can search categories by name via API
    Given I am authenticated as "testuser" with password "test123" via API
    When I search categories via API by name "API_Ad_04"
    Then the API response status should be 200

#API_Us_02_214066B
  Scenario: User cannot create a category via API
    Given I am authenticated as "testuser" with password "test123" via API
    When I create a category via API with name "API_Us_02" and no parent
    Then the API response status should be 403

#API_Us_03_214066B
  Scenario: User cannot update a category via API
    Given I am authenticated as "testuser" with password "test123" via API
    And I have an existing category id from API search by name "API_Ad_04"
    When I update that category via API to have name "API_Us_03"
    Then the API response status should be 403

#API_Us_04_214066B
  Scenario: User cannot delete a category via API
    Given I am authenticated as "testuser" with password "test123" via API
    And I have an existing category id from API search by name "API_Ad_04"
    When I delete that category via API
    Then the API response status should be 403