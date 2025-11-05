describe('CityBin - Logout Functionality', () => {
beforeEach(() => {
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').clear().type('admin@citybin.com');
    cy.get('input[placeholder="Password"]').clear().type('Admin1234', { log: false });
    cy.contains('button', 'Sign In').click();
    cy.url({ timeout: 15000 }).should('include', '/admin/dashboard');
  });

  it('should logout and redirect to login', () => {
    cy.contains('Logout').click();
    cy.contains('Logout Confirmation', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Yes').click();
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.contains('Sign In').should('be.visible');
  });
});
