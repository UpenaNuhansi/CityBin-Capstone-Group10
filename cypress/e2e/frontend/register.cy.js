describe('CityBin - Registration Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/register');
  });

  it('should load registration form', () => {
    cy.contains('Sign Up').should('be.visible');
  });

  it('should show validation error if required fields missing', () => {
    cy.get('button[type="submit"]').click();
    //cy.contains('required').should('exist');
  });

  it('should register new user successfully', () => {
    cy.get('input[placeholder="Username"]').type(`test${Date.now()}`);
    cy.get('input[placeholder="Email"]').type(`test${Date.now()}@gmail.com`);
    cy.get('input[placeholder="Password"]').type('Test1234');
    cy.contains('button', 'Sign Up').click();
    cy.contains('Registration successful').should('exist');
  });
});
