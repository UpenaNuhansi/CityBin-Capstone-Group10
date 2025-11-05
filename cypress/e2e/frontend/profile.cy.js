describe('CityBin - User Profile', () => {
    // Login once before all tests
    before(() => {
    // Setup for admin-sessions... (kept as is)
    cy.session('admin-sessions', () => {
      cy.visit('/login');
      cy.get('input[placeholder="Email"]').type('admin@citybin.com');
      cy.get('input[placeholder="Password"]').type('Admin1234', { log: false });
      cy.contains('button', 'Sign In').click();
      cy.url({ timeout: 20000 }).should('include', '/admin/dashboard');
    });
  });

  //  Restore session before each test and navigate to Bin Management
  beforeEach(() => {
    // Session restoration (kept as is)
    cy.session('admin-session', () => {
      cy.visit('/login');
      cy.get('input[placeholder="Email"]').type('admin@citybin.com');
      cy.get('input[placeholder="Password"]').type('Admin1234', { log: false });
      cy.contains('button', 'Sign In').click();
      cy.url({ timeout: 20000 }).should('include', '/admin/dashboard');
    });

    cy.visit('/admin/profile', { timeout: 30000 });
  });

  // ✅ 1. Profile Info Display

  it('should display user info', () => {
    cy.contains('Profile').should('be.visible');

    // the Email is rendered as static text (<p>), not an input — verify it here
    cy.contains('p', 'Email')
      .next('p')
      .should('contain.text', 'admin@citybin.com');

    cy.contains('p', 'Username')
      .next('p')
      .should('contain.text', 'Admin');  

    cy.contains('p', 'Role')
      .next('p')
      .should('contain.text', 'admin');

  
  });

//   it('should update profile details', () => {
//     cy.get('input[placeholder="Phone"]').clear().type('0771234567');
//     cy.contains('button', 'Update').click();
//     cy.contains('Profile updated successfully').should('exist');
//   });
});
