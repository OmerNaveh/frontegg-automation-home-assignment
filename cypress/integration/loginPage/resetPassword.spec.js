const emailAddress = "8454c344-e9f1-40a6-9f04-5fe4d7804a16@mailslurp.com"; //email created using mailslurp api
const inboxId = "8454c344-e9f1-40a6-9f04-5fe4d7804a16";
let confirmationUrl;
describe("test reset password feature", () => {
  it("should go to login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });
  it("should enter email address and click on forgot password", () => {
    cy.wait(2000); // await full page render
    cy.get('[data-test-id="input-email"]').type(`${emailAddress}{enter}`);
    cy.get("#frontegg-login-box-container-default")
      .shadow() //elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="forgot-password-btn"]').click();
      });
    cy.url().should("include", "/forget-password");
  });
  it("should show error for typing invalid email syntax", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //elements are nested in shadow root
      .within(() => {
        cy.get('input[name="email"]').as("email").focus();
        cy.get("@email").focus().clear();
        cy.get('[data-test-id="email-box_error"]')
          .as("error")
          .contains("Email is required");
        cy.get("@email").focus().type("a@.com");
        cy.get('[data-test-id="email-box_error"]')
          .as("error")
          .contains("Must be a valid email");
        cy.get("@email").focus().clear();
        cy.get("@email").focus().type(emailAddress);
      });
  });
  it("should press on remind me to send confirmation email", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="submit-btn"]').click();
        cy.get('[data-test-id="forgot-password-success-title"]'); //success message appears
      });
  });
  it("can receive the confirmation email and extract the confirmation URL", () => {
    // wait for an email in the inbox
    cy.mailslurp()
      .then((mailslurp) => mailslurp.waitForLatestEmail(inboxId, 30000, true))
      .then((email) => {
        expect(email.subject).to.contain("Your Reset Password Request");
        // extract the confirmation code (so we can confirm the user)
        confirmationUrl = /http:\/\/localhost:3000.+target/.exec(email.body);
        //remove unneccessary string parts from end
        confirmationUrl = confirmationUrl["0"].slice(
          0,
          confirmationUrl.length - 9
        );
        // fix syntax of '=' '&' characters
        const equals = /&#x3D;/g;
        const empty = "amp;";
        confirmationUrl = confirmationUrl.replace(equals, "=");
        confirmationUrl = confirmationUrl.replace(empty, "");
      });
  });
  it("should navigate to confirmation url", () => {
    cy.visit(confirmationUrl);
    cy.url().should("include", "/reset-password");
  });
  it("should show errors when entering invalid password syntax", () => {
    cy.wait(2000);
    cy.get("#frontegg-login-box-container-default")
      .shadow() //elements are nested in shadow root
      .within(() => {
        // shorter than 6 characters case
        cy.get('input[name="password"]').as("password").focus();
        cy.get("@password").focus().type("112");
        cy.get('[data-test-id="password-box_error"]')
          .as("passwordError")
          .contains("6 characters minimum");
        cy.get("@password").focus().clear();
        // password required
        cy.get("@passwordError").contains("New password is required");
        // 3 repeating charcters case
        cy.get("@password").focus().type("111234");
        cy.get("@passwordError").contains(
          "avoid 3 or more recurring characters"
        );
        cy.get("@password").focus().clear();
        cy.get("@password").focus().type("abcabc");
        cy.get('input[name="confirmPassword"]').as("confirm").focus();
        cy.get("@confirm").focus().type("abc");
        cy.get('[data-test-id="repeat-password-box_error"]')
          .as("repeatError")
          .contains("Passwords must match");
        cy.get("@confirm").focus().clear();
      });
  });
  it("should start button as diabled and after matching password enable", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="submit-btn"]')
          .as("submit")
          .should("be.disabled");
        cy.get('input[name="confirmPassword"]')
          .as("confirm")
          .focus()
          .type("abcabc");
        cy.get("@submit").should("not.be.disabled");
      });
  });
  it("should redirect when submitting button", () => {
    cy.get("#frontegg-login-box-container-default")
      .shadow() //elements are nested in shadow root
      .within(() => {
        cy.get('[data-test-id="submit-btn"]').click();
      });
    cy.wait(6000); //wait for full redirect
    cy.url().should("include", "/login");
  });
});
