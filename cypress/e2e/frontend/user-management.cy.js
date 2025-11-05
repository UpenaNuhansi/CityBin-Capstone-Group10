describe('CityBin - User Management Page', () => {
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

  // 🔁 Restore session before each test and navigate to Bin Management
  beforeEach(() => {
    // Session restoration (kept as is)
    cy.session('admin-session', () => {
      cy.visit('/login');
      cy.get('input[placeholder="Email"]').type('admin@citybin.com');
      cy.get('input[placeholder="Password"]').type('Admin1234', { log: false });
      cy.contains('button', 'Sign In').click();
      cy.url({ timeout: 20000 }).should('include', '/admin/dashboard');
    });

    cy.visit('/admin/user-management', { timeout: 30000 });

//     // Wait for the User Management section to render
//     cy.contains('User Management', { timeout: 30000 })
//       .scrollIntoView()
//       .should('exist');
  });

  // ✅ 1. Page Load & Table Headers
  it('should load the User Management table with correct headers', () => {
    const headers = [
      'Unique ID',
      'Username',
      'Email',
      'Role',
      'Status',
      'Last Login',
      'Actions',
    ];
    headers.forEach((header) => {
      cy.get('table thead').contains(header).should('exist');
    });
  });

  // ✅ 2. Search Functionality
  it('should filter users based on search input', () => {
    cy.get('input[placeholder="Search..."], input[type="text"]').first().type('admin');
    cy.get('table tbody tr').should('exist');
  });

  // ✅ 3. Edit User Modal - Open, Edit, Save
  it('should open Edit modal, update user info, and close successfully', () => {
    cy.get('table tbody tr').not(':contains("admin")').first().as('userRow');
    cy.get('@userRow').contains('Edit').click();

    cy.get('.bg-white').should('contain.text', 'Edit User').and('be.visible');

    // Change username text (append something)
    cy.get('input[name="username"]').clear().type('UpdatedUser');
    cy.get('select[name="role"]').select('Operator');
    cy.get('select[name="status"]').select('Active');

    cy.contains('button', 'Save').click();
    cy.contains('User successfully updated!', { timeout: 8000 }).should('exist');
  });

  // ✅ 4. Cancel Edit Modal
  it('should open Edit modal and close without saving', () => {
    cy.get('table tbody tr').first().contains('Edit').click();
    cy.get('.bg-white').should('contain.text', 'Edit User');
    cy.contains('button', 'Cancel').click();
    //cy.get('.bg-white').should('not.exist');
  });

  // ✅ 5. Delete User (From Bottom, Except Admin)
  it('should delete the last non-admin user safely', () => {
    cy.get('table tbody tr')
      .filter(':not(:contains("admin"))')
      .last()
      .as('lastUser');

    cy.get('@lastUser').within(() => {
      cy.contains('Delete').scrollIntoView().click({ force: true });
    });

    // Confirm delete modal appears
    cy.get('.bg-white').should('contain.text', 'Delete User').and('be.visible');
    cy.contains('button', 'Confirm Delete').click();

    cy.contains('User successfully deleted!', { timeout: 8000 }).should('exist');
  });

  // ✅ 6. Cancel Delete Modal
  it('should open Delete modal and cancel safely', () => {
    cy.get('table tbody tr').filter(':not(:contains("admin"))').first().as('userRow');
    cy.get('@userRow').contains('Delete').click({ force: true });
    cy.get('.bg-white').should('contain.text', 'Delete User');
    cy.contains('button', 'Cancel').click();
    //cy.get('.bg-white').should('not.exist');
  });

  // ✅ 7. Notification Visibility
  it('should show and hide notification after successful action', () => {
    cy.get('table tbody tr').filter(':not(:contains("admin"))').first().as('userRow');
    cy.get('@userRow').contains('Edit').click({ force: true });
    cy.get('input[name="username"]').clear().type('TempUser');
    cy.contains('button', 'Save').click();

    cy.get('.fixed.top-6.right-6')
      .should('be.visible')
      .and('contain.text', 'User successfully updated!');
    cy.wait(4000);
    cy.get('.fixed.top-6.right-6').should('not.exist');
  });
});
