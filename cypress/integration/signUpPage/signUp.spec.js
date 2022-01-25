const uuid = () => Cypress._.random(0, 1e6); //function to create random string
const id = uuid(); // random string created to test creating account
describe("testing sign up feature", () => {
  after(() => {
    cy.visit("/logout");
    cy.wait(5000); //wait entirely for the logout process to complete
  });
  it("should load sign up page", () => {
    cy.visit("/sign-up");
    cy.url().should("include", "/sign-up");
  });
  it("signup button should be disabled before starting to enter dets", () => {
    cy.wait(2000); // await full page render
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="signupSubmit-btn"]').should("be.disabled");
      });
  });

  it("should show email input error when entering invalid email syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        //no '@' and '.' case
        cy.get('input[name="email"]').as("email").focus().type("aaa");
        cy.get('[data-test-id="email-box_error"]')
          .as("emailError")
          .contains("Must be a valid email");
        cy.get("@email").focus().clear();
        // no '.' case
        cy.get("@email").focus().type("aaa@gmail");
        cy.get("@emailError").contains("Must be a valid email");
        cy.get("@email").focus().clear();
        // no '@' case
        cy.get("@email").focus().type("aaa.gmail");
        cy.get("@emailError").contains("Must be a valid email");
        cy.get("@email").focus().clear();
      });
  });
  it("should not show error when entering valid email syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        //no '@' and '.' case
        cy.get('input[name="email"]').as("email").focus().type("aaa@gmail.com");
        cy.get('[data-test-id="email-box_error"]').should("not.exist");
      });
  });
  it("should show name input error when entering invalid name syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        // shorter than 3 letters
        cy.get('input[name="name"]').as("name").focus();
        cy.get("@name").focus().type("aa"); // had to focus again to type
        cy.get('[data-test-id="name-box_error"]').contains(
          "Name must be at least 3 characters"
        );
        cy.get("@name").focus().clear();
      });
  });
  it("should not show error when entering valid name syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('input[name="name"]').as("name").focus().type("aaa");
        cy.get('[data-test-id="name-box_error"]').should("not.exist");
      });
  });
  it("should show companyName input error when entering invalid companyName syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        // shorter than 3 letters
        cy.get('input[name="companyName"]').as("company").focus();
        cy.get("@company").focus().type("aa"); // had to focus again to type
        cy.get('[data-test-id="companyName-box_error"]').contains(
          "Company name must be at least 3 characters"
        );
        cy.get("@company").focus().clear();
      });
  });
  it("should not show error when entering valid company name syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('input[name="companyName"]').as("company").focus().type("aaa");
        cy.get('[data-test-id="companyName-box_error"]').should("not.exist");
      });
  });
  it("should show error for invalid password syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        //shorter than 6 charcters case
        cy.get('input[name="password"]').as("password").focus();
        cy.get("@password").focus().type("aaa");
        cy.get('[data-test-id="password-box_error"]').contains(
          "6 characters minimum"
        );
        cy.get("@password").focus().clear();
        //3 reccuring charcters case
        cy.get("@password").focus().type("aaabbb");
        cy.get('[data-test-id="password-box_error"]').contains(
          "avoid 3 or more recurring characters"
        );
        cy.get("@password").focus().clear();
      });
  });
  it("should not show error for valid password syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('input[name="password"]').as("password").focus().type("abc123");
        cy.get('[data-test-id="password-box_error"]').should("not.exist");
      });
  });
  it("should show error field is required if a field is missing and sign up btn should be disabled", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('input[name="password"]').as("password").focus().clear();
        cy.get('[data-test-id="password-box_error"]').contains(
          "Password is required"
        );
        cy.get('[data-test-id="signupSubmit-btn"]').should("be.disabled");
        cy.get("@password").focus().type("abc123");
      });
  });
  it("sign up button should be enabled after all data was entered", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="signupSubmit-btn"]').should("not.be.disabled");
      });
  });
  it("should show error when trying to create an existing user", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="signupSubmit-btn"]').click();
        cy.get('[data-test-id="signup-error"]').contains("User already exist");
      });
  });
  it("should redirect when successfully signing up", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //all elements are nested in shadow root
      .within(() => {
        cy.get('input[name="email"]').as("email").focus();
        cy.get("@email").focus().clear();
        cy.get("@email").focus().type(`${id}@gmail.com`);
        cy.get('[data-test-id="signupSubmit-btn"]').click();
        cy.wait(2000); //wait for redirect
        cy.url().should("eq", "http://localhost:3000/");
      });
  });
});
