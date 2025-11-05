describe('CityBin Bin API Tests', () => {
  const apiUrl = Cypress.env('apiUrl');
  let token;

  before(() => {
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: 'admin@citybin.com',
      password: 'Admin1234'
    }).then(res => {
      token = res.body.token;
    });
  });

  it('should create a new bin', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/bins`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        binId: `BIN-${Date.now()}`,
        location: 'Test Location',
        wasteLevel: 40,
        coordinates: { lat: 6.9, lng: 79.8 },
        deviceStatus: 'online'
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.status).to.eq('success');
    });
  });

  it('should fetch all bins', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/bins`,
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.eq('success');
    });
  });
});
