describe('CityBin Homepage', () => {
  it('should load and display the main title', () => {
    // Visits the baseUrl defined in cypress.config.js 
    cy.visit('/');
    
    // Check if an element with a specific selector (e.g., <h1>) contains the project name
    cy.get('h1').should('contain', 'CityBin'); 
    
    // Check if the URL is correct
    cy.url().should('include', '/');
  });
});