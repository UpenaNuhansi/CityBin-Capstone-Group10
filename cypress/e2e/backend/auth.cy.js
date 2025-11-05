describe('CityBin Auth API Tests', () => {
  const apiUrl = Cypress.env('apiUrl');

  it('should register a new user', () => {
    cy.request('POST', `${apiUrl}/auth/register`, {
      username: 'testuser',
      email: `test${Date.now()}@gmail.com`,
      password: 'Test1234'
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.success).to.be.true;
    });
  });

  it('should login successfully', () => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'admin@citybin.com',
      password: 'Admin1234'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      cy.wrap(response.body.token).as('token');
    });
  });
});
