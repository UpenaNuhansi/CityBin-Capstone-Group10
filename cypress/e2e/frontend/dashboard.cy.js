describe('CityBin - Admin Dashboard', () => {
//   beforeEach(() => {
//     cy.loginAsAdmin();
//     cy.visit('/admin/dashboard');
//   });
beforeEach(() => {
    cy.visit('/login');
    cy.get('input[placeholder="Email"]').clear().type('admin@citybin.com');
    cy.get('input[placeholder="Password"]').clear().type('Admin1234', { log: false });
    cy.contains('button', 'Sign In').click();
    cy.url({ timeout: 15000 }).should('include', '/admin/dashboard');
  });


  it('should display key dashboard elements', () => {
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Total Bins').should('be.visible');
    cy.contains('Active Bins').should('be.visible');
    cy.contains('Full Bins').should('be.visible');
    cy.contains('Maintenance Issues').should('be.visible');
    cy.contains('Common Announcements').should('be.visible');
    //cy.get('[data-testid="chart"]').should('exist');
  });


  it('should navigate to user management', () => {
    cy.contains('User Management').click();
    cy.url().should('include', '/admin/user-management');
  });

  it('should navigate to bins management', () => {
    cy.contains('Bin Management').click();
    cy.url().should('include', '/admin/bin-management');
  });

  it('should navigate to bins management', () => {
    cy.contains('Data Analytics & Reports').click();
    cy.url().should('include', '/admin/data-analytics-reports');
  });

  it('should navigate to alerts & notifications', () => {
    cy.contains('Alerts & Notifications').click();
    cy.url().should('include', '/admin/alerts-notifications');
  });

  it('should navigate to system settings', () => {
    cy.contains('System Settings').click();
    cy.url().should('include', '/admin/system-settings');
  });

  it('should navigate to admin profile', () => {
    cy.contains('Profile').click();
    cy.url().should('include', '/admin/profile');
  });

//   it('should match dashboard snapshot', () => {
//   cy.visit('/admin/dashboard');
//   cy.matchImageSnapshot('dashboard-ui');
// });

});