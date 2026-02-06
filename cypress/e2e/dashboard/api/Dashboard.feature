Feature: Dashboard and Navigation

  # -------- user -------- 
  
  # -------- Scenario 1 -------- 
  Scenario: User can fetch category summary successfully
    Given I am authenticated as a Standard User via API
    When I send a GET request to fetch category summary as user sc1
    Then the response status should be 200 sc1
    And the response should return category summary data sc1


# -------- Scenario 2 --------
  Scenario: User can fetch plant summary successfully
    Given I am authenticated as a Standard User via API
    When I send a GET request to fetch plant summary as user sc2
    Then the response status should be 200 sc2
    And the response should return plant summary data sc2 

# -------- Scenario 3 --------
  Scenario: User can fetch sales summary successfully
    Given I am authenticated as a Standard User via API
    When I send a GET request to fetch sales summary as user sc3
    Then the response status should be 200 sc3
    And the response should return sales summary data sc3

# -------- Scenario 4 --------
Scenario: User can filter categories by parent ID
    Given I am authenticated as a Standard User via API
    When I send a GET request to fetch categories with parentId sc4
    Then the response status should be 200 sc4
    And the response should return only categories belonging to that parent ID sc4


#  -------- Scenario 5 --------
  Scenario: API returns empty list when no categories exist
    Given I am authenticated as a Standard User via API
    And I mock the Get Categories API to return an empty list
    When I trigger the request to fetch categories sc5
    Then the response status should be 200 sc5
    And the response should return an empty category list sc5


 # -------- Scenario 6 -------- 
  Scenario: Admin can fetch category summary successfully
    Given I am authenticated as Admin via API
    When I send a GET request to fetch category summary as admin sc6
    Then the response status should be 200 sc6
    And the response should return category summary data sc6


# -------- Scenario 7 --------
  Scenario: Admin can fetch plant summary successfully
    Given I am authenticated as Admin via API
    When I send a GET request to fetch plant summary as admin sc7
    Then the response status should be 200 sc7
    And the response should return plant summary data sc7

# -------- Scenario 8 --------
  Scenario: Admin can fetch sales summary successfully
    Given I am authenticated as Admin via API
    When I send a GET request to fetch sales summary as admin sc8
    Then the response status should be 200 sc8
    And the response should return sales summary data sc8

  # -------- Scenario 9 --------
  Scenario: Admin can delete a plant by ID
      Given I am authenticated as Admin via API
      When I send a DELETE request to delete the plant by ID
      Then the response status should be 200 sc9

  
  # -------- Scenario 10 --------
  Scenario: API rejects plant creation when plant name is missing
    Given I am authenticated as Admin via API
    When I send a POST request to create a plant without a name
    Then the response status should be 400