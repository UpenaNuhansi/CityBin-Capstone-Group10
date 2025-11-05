describe('CityBin - Login Functionality', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('should load login page successfully', () => {
    cy.contains('Sign In', { timeout: 10000 }).should('be.visible');
  });

  // it('should show validation error for empty fields', () => {
  //   //cy.get('button[type="submit"]').click();
  //   cy.contains('button', 'Sign In').click();
  //   cy.contains('Please fill out this field').should('exist'); 
  // });

  it('should not login with wrong credentials', () => {
    cy.get('input[placeholder="Email"]').type('wrong@user.com');
    cy.get('input[placeholder="Password"]').type('wrongpass');
    cy.contains('button', 'Sign In').click();
    cy.contains('Network error. Please try again.').should('exist');
  });

  it('should login successfully and redirect to dashboard', () => {
    cy.get('input[placeholder="Email"]').type('admin@citybin.com');
    cy.get('input[placeholder="Password"]').type('Admin1234');
    cy.contains('button', 'Sign In').click();
    cy.url({ timeout: 15000 }).should('include', '/admin/dashboard');
  });
});
