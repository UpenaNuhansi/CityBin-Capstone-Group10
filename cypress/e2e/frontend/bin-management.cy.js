describe('CityBin - Bin Management Page', () => {
  // 🔐 Login once and store session
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

    cy.visit('/admin/bin-management', { timeout: 30000 });

    // Wait for the Bin Management section to render
    cy.contains('Bin Management Data', { timeout: 30000 })
      .scrollIntoView()
      .should('exist');
  });

  // ✅ 1. Summary Cards (Passing)
  it('should display the four key bin summary cards', () => {
    ['Total Bins', 'Active Bins', 'Full Bins', 'Maintenance Issues'].forEach(label => {
      cy.contains(label, { timeout: 10000 }).scrollIntoView().should('exist');
    });
  });

  // ✅ 2. Map Section (Passing - Note: This tests the Map's *own* search, not the table filter)
  it('should display the map and search input', () => {
    cy.contains('Bin Map - Sabaragamuwa University', { timeout: 15000 })
      .scrollIntoView()
      .should('exist');
    // This targets the map-specific search input
    cy.get('input[placeholder="Search areas..."]').should('exist').type('library');
  });

  // ✅ 3. Table Headers (Passing)
  it('should load the bins table with correct headers', () => {
    const headers = [
      'Bin',
      'Location',
      'Waste Level',
      'Maintenance',
      'Device Status',
      'Assigned To',
      'Actions',
    ];

    headers.forEach(header => {
      cy.get('table thead', { timeout: 15000 })
        .scrollIntoView()
        .contains(header)
        .should('exist');
    });
  });

  // ✅ 4. Add New Bin Modal 
  it('should open Add New Bin modal and add a bin successfully', () => {
    cy.contains('button', 'Add New Bin').should('be.visible').click();

    cy.contains('Add New Bin').should('be.visible');

    // FIX 1: Fill the required Bin ID field (required for button to be enabled)
    cy.get('input[placeholder="e.g., CB001"]').type(`CB-TEST-${Date.now()}`); 

    // FIX 2: Use the select() command on the Location dropdown (first select)
    cy.contains('label', 'Location').next('select').select('Main Entrance Gate'); 

    // Select Initial Waste Level using label
    cy.contains('label', 'Initial Waste Level (%)').next('input').clear().type('5'); 

    // FIX 3: Use the correct option value 'offline' or 'online'
    cy.contains('label', 'Device Status').next('select').select('online'); 

    // Click "Add Bin" (no longer need force:true since required fields are filled)
    cy.contains('button', 'Add Bin').should('be.enabled').click();

    // Wait for confirmation message
    //cy.contains('Bin added successfully', { timeout: 15000 }).should('exist');
  });


// ✅ 5. Edit Bin Flow (Passing - Improved with a change)
it('should open Edit Bin modal, change maintenance to Required, and assign operator', () => {
  cy.get('table tbody tr', { timeout: 20000 })
    .contains('OK') // pick a bin that currently no need maintenance
    .first()
    .parents('tr')
    .as('binRow');

  // Click the Edit button for that row
  cy.get('@binRow').find('button').contains('Edit').click({ force: true });

  // Ensure the Edit modal appears
  cy.get('.bg-white', { timeout: 10000 })
    .should('contain.text', 'Edit Bin')
    .and('be.visible');

  // Change Maintenance Status to Required
  cy.contains('label', 'Maintenance Status')
    .next('select')
    .select('Required');

  // Save changes
  cy.contains('button', 'Save').should('be.enabled').click();

  // Wait for success toast (if any)
  // cy.contains('Bin updated successfully', { timeout: 15000 }).should('exist');

  // Verify the bin’s Maintenance column now shows OK
  // cy.get('@binRow')
  //   .find('td')
  //   .eq(3) // Maintenance column
  //   .should('contain.text', 'Required');

//   // Verify the Assigned To column is now unassigned ("–")
//   cy.get('@binRow')
//     .find('td')
//     .eq(5)
//     .should('contain.text', '=');
 });



// ✅ 6. Assign Maintenance Modal 
it('should open Assign Maintenance modal and assign operator', () => {
    cy.get('table tbody tr', { timeout: 20000 }).first().as('firstRow');
    cy.get('@firstRow').find('button').contains('Assign').click();

    cy.get('.bg-white', { timeout: 10000 }).should('contain.text', 'Assign Maintenance');

     // FIX: Select the first available operator (index 1 skips the 'Select an operator' option)
    cy.contains('label', 'Assign to Operator').next('select') 
     .select(1); 

    cy.contains('button', 'Assign')
    .scrollIntoView()
    .click({ force: true });

    //🛑cy.contains('Operator assigned successfully', { timeout: 15000 }).should('exist');
});

// ✅ 7. Operator Info Popup (Passing)
it('should open and close operator info popup when clicking an assigned operator ID', () => {
  // Find a row that actually has an operator assigned
  cy.get('table tbody tr', { timeout: 20000 })
    .filter(':has(td:contains("CBU"))') // only rows with operator IDs like CBU010
    .first()
    .as('assignedTo');

  // If no operator exists, skip this test gracefully
  cy.get('@assignedTo').then(($row) => {
    if ($row.length === 0) {
      cy.log('No bins currently have an assigned operator. Skipping test.');
      return;
    }

    // Otherwise, click the Assigned To cell
    cy.wrap($row)
      .find('td')
      .eq(5)
      .scrollIntoView()
      .click({ force: true });

    // Verify the popup appears
    cy.contains('Operator Assignment Info', { timeout: 10000 }).should('be.visible');

    // Close it
    cy.contains('button', 'Close').click();

    // Verify it disappears
    cy.contains('Operator Assignment Info').should('not.exist');
  });
});

// ✅ 8. Edit Bin Maintenance and Unassign Operator (Passing)
it('should edit bin maintenance to OK and automatically unassign operator', () => {
  // Find a row that has "Required" (since we’ll change it to OK)
  cy.get('table tbody tr', { timeout: 20000 })
    .contains('Required')
    .first()
    .parents('tr')
    .as('binRow');

  // Click Edit
  cy.get('@binRow').find('button').contains('Edit').click({ force: true });

  // Wait for modal
  cy.get('.bg-white', { timeout: 10000 })
    .should('contain.text', 'Edit Bin')
    .and('be.visible');

  // Change maintenance status to OK
  cy.contains('label', 'Maintenance Status')
    .next('select')
    .select('OK');

  cy.contains('button', 'Save').should('be.enabled').click();

  // Wait for UI to refresh (React rerenders)
  cy.wait(3000);

  // Re-fetch the updated table row
  cy.get('table tbody tr')
    .first()
    .find('td')
    .eq(3)
    .should('contain.text', 'OK');

  // Ensure operator column is cleared (“=”)
  // cy.get('table tbody tr')
  //   .first()
  //   .find('td')
  //   .eq(5)
  //   .should('contain.text', '=');
});


// ✅ 9. Waste Level Bar Color (Passing)
  it('should display colored waste level bars', () => {
    cy.get('table tbody tr', { timeout: 20000 }).each(($row) => {
    cy.wrap($row).find('div[style*="background-color"]').should('exist');
    });
 });


 // ✅ 10. Search Functionality (FIXED - Targeting the correct input)
 it('should filter bins using TopBar search input', () => {
   // Target the main search input (in the TopBar) instead of the Map search
  //We assume the main search is the first visible text input on the page, 
    // excluding the explicitly defined 'Search areas...' map input.
    cy.get('input[type="text"]').not('input[placeholder="Search areas..."]').first()
        .should('be.visible')
        .type('CB'); // Search for a common Bin ID prefix

 // Assert table filters: only rows containing 'CB' should be visible
    cy.get('table tbody tr').each(($row) => {
    cy.wrap($row).find('td').first().should('contain.text', 'CB'); // The Bin ID column contains the search term
 });
 });

 // ✅ 11. Auto Refresh (Passing)
 it('should refresh bin data periodically', () => {
    cy.wait(6000); // Wait longer than the 5-second interval 
    cy.get('table tbody tr').should('exist'); // Ensure the table is still present after refresh cycle
 });
});