describe("login page testing with email", () => {
  after(() => {
    cy.visit("/logout"); // make sure to log out after all tests are run
    cy.wait(5000); //wait entirely for the logout process to complete
  });
  it("should visit login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it("should error for email with wrong syntax", () => {
    cy.get('[data-test-id="input-email"]').as("email").type("a.com{enter}");
    cy.get("@email").should("have.attr", "aria-invalid", "true");
    cy.get("@email").clear(); //clear text input
    cy.get("@email").type("a@gmail{enter}");
    cy.get("@email").should("have.attr", "aria-invalid", "true");
    cy.get("@email").clear();
  });
  it("should enter for correct syntax email", () => {
    cy.get('[data-test-id="input-email"]')
      .as("email")
      .type("admin@gmail.com{enter}");
    cy.get("@email").should("have.attr", "aria-invalid", "false");
    cy.get('[data-test-id="input-password"]'); //make sure password input exists
  });
  it("should show error for invalid password syntax", () => {
    cy.get('[data-test-id="input-password"]').as("password").type("123");
    cy.get("@password").should("have.attr", "aria-invalid", "true");
    cy.get("@password").clear();
  });
  it("should not allow entrance with inccorect details", () => {
    cy.get('[data-test-id="input-password"]')
      .as("password")
      .type("123ABC{enter}");
    cy.get("@password").should("have.attr", "aria-invalid", "false");
    cy.url().should("include", "/login"); //make sure no redirect happened
  });
  it("should redirect when authenticated user info is entered", () => {
    cy.get('[data-test-id="input-password"]').as("password").clear();
    cy.get('[data-test-id="input-email"]').as("email").clear();
    cy.get("@email").type("mock@gmail.com{enter}");
    cy.get("@password").type("mockpass{enter}");
    cy.url().should("eq", "http://localhost:3000/");
  });
});
