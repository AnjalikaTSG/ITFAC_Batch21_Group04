Feature: Category UI tests for admin and user

  # ----------------------------
  # Admin UI scenarios (8)
  # ----------------------------

#UI_Ad_01_214066B
  Scenario: Admin can add a main category successfully
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I click the Add Category button
    And I enter category name "UI_Ad_01"
    And I leave the parent category as main
    And I save the category form
    Then I should see the category "UI_Ad_01" in the category list

  Scenario: Admin can add a sub category successfully
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I ensure there is at least one main category named "UI_Ad_01"
    And I click the Add Category button
    And I enter category name "UI_Ad_Sub1"
    And I select parent category "UI_Ad_01"
    And I save the category form
    Then I should see the category "UI_Ad_Sub1" in the category list

#UI_Ad_02_214066B
  Scenario: Admin sees validation when category name is empty
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I click the Add Category button
    And I leave the category name empty
    And I save the category form
    Then I should see the category name required validation message

#UI_Ad_04_214066B
  Scenario: Admin can edit an existing category
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I ensure there is at least one main category named "UI_Ad_01"
    And I click the edit button for category "UI_Ad_01"
    And I change the category name to "UI_Ad_04"
    And I save the category form
    Then I should see the category "UI_Ad_04" in the category list

  Scenario: Admin can delete an existing category with confirmation
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I ensure there is at least one main category named "UI_Ad_04"
    And I click the delete button for category "UI_Ad_04"
    And I confirm the category delete popup
    Then I should not see the category "UI_Ad_04" in the category list

#UI_Ad_03_214066B
  Scenario: Admin sees validation when category name is too short
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I click the Add Category button
    And I enter category name "Ab"
    And I save the category form
    Then I should see the category name length validation message

#UI_Ad_05_214066B
  Scenario: Admin can sort the category list by ID
    Given I open the application login page
    When I enter valid username "admin" and password "admin123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I click the ID column header
    Then the category list should be sorted by ID in ascending or descending order

  # ----------------------------
  # User UI scenarios (5)
  # ----------------------------

#UI_Us_01_214066B
  Scenario: User can view the category list
    Given I open the application login page
    When I enter valid username "testuser" and password "test123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    Then I should see the category table displayed

#UI_Us_02_214066B
  Scenario: User can search categories by name
    Given I open the application login page
    When I enter valid username "testuser" and password "test123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I search categories by name "UI_Us_02"
    Then the category search results should show only categories related to "UI_Us_02"

#UI_Us_03_214066B
  Scenario: User can filter categories by parent
    Given I open the application login page
    When I enter valid username "testuser" and password "test123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    And I filter categories by parent "UI_Us_02"
    Then the category list should show only sub categories of "UI_Us_02"

#UI_Us_04_214066B
  Scenario: User cannot see admin actions on category list
    Given I open the application login page
    When I enter valid username "testuser" and password "test123"
    And I click the login button
    Then I should see the dashboard page
    When I navigate to the category list page
    Then I should not see the Add Category button
    And I should not see edit or delete buttons for categories

#UI_Us_05_214066B
  Scenario: User cannot access add category page directly
    Given I open the application login page
    When I enter valid username "testuser" and password "test123"
    And I click the login button
    Then I should see the dashboard page
    When I open the add category page URL directly
    Then I should see the access denied page for categories