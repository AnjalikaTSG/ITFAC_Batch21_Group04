Feature: Dashboard and Navigation

  # -------- user -------- 
  
  # -------- Scenario 1 -------- 
  Scenario: Dashboard loads immediately after login
    Given the user is on the login page
    When the user logs in with username "testuser" and password "test123" sc1
    Then the user should be redirected to the Dashboard page

  #  -------- Scenario 2 --------
  Scenario: Sidebar navigation visible for logged in user
    Given the user logs in with username "testuser" and password "test123" sc2
    And the user is on the Dashboard page sc2
    When the user observes the left navigation menu sc2
    Then the sidebar menu items should be visible sc2

  #  -------- Scenario 3 --------
  Scenario: Active menu highlight when Categories menu is selected
    Given the user logs in with username "testuser" and password "test123" sc3
    And the user is on the Dashboard page sc3
    And the navigation menu is visible
    When the user clicks on the "Categories" menu
    Then the "Categories" menu item should be highlighted

  #  -------- Scenario 4--------
  Scenario: Dashboard summary cards are visible
    Given the user logs in with username "testuser" and password "test123" sc4
    And the user is on the Dashboard page sc4
    When the user observes the dashboard summary cards
    Then the following dashboard summary cards should be visible:

  
  # -------- Scenario 5--------
  Scenario: Logout from dashboard
    Given the user logs in with username "testuser" and password "test123" sc5
    And the user is on the Dashboard page sc5
    And the navigation menu is visible sc5
    When the user clicks on the Logout option
    Then the user should be logged out and redirected to the Login page


  # -------- Admin --------

  # -------- Scenario 6 --------
  Scenario: Admin dashboard loads immediately after login
    Given the admin user is on the login page 
    When the admin logs in with username "admin" and password "admin123" sc6
    Then the admin should be redirected to the Dashboard page 

  # -------- Scenario 7 --------
  Scenario: Sidebar navigation visible for Admin
    Given the admin logs in with username "admin" and password "admin123" sc7
    And the admin is on the Dashboard page sc7
    When the admin observes the left navigation menu sc7
    Then the sidebar menu items should be visible sc7

  # -------- Scenario 8 --------
  Scenario: Active menu highlight when Plants menu is selected
    Given the admin logs in with username "admin" and password "admin123" sc8
    And the admin is on the Dashboard page sc8
    And the navigation menu is visible sc8
    When the admin clicks on the "Plants" menu sc8
    Then the "Plants" menu item should be highlighted sc8


  # -------- Scenario 9 --------
  Scenario: Admin is redirected to correct page when clicking a menu item
    Given the admin logs in with username "admin" and password "admin123" sc9
    And the admin is on the Dashboard page sc9
    And the navigation menu is visible sc9
    When the admin clicks on the "Categories" menu sc9
    Then the admin should be redirected to the "Categories" page sc9

  
  # -------- Scenario 10 --------
    Scenario: Admin is redirected when clicking Action button on dashboard summary card
    Given the admin logs in with username "admin" and password "admin123" sc10
    And the admin is on the Dashboard page sc10 
    And the dashboard summary cards are visible sc10
    When the admin clicks the Action button on the "Sales" on the Sales summary card sc10
    Then the admin should be redirected to the "sales" page sc10
