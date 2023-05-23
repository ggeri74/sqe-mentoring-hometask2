describe("API tests", () => {

  const authHeader = "Bearer ae45dfa0e871e65f3c9978083274d9c6c406989da91fe63aee244bd99b42a3b0";
  const baseUrl = "https://gorest.co.in/public/v2/users/";
  let userId;
  const name = "Oriza Triznyak";
  const email = "oriza.triznyak@example.com";
  const gender = "male";
  const status = "active";

  it("POST Creates a new user", () => {
    cy.request({
      method: "POST",
      url: baseUrl,
      headers: {
        Authorization: authHeader,
      },
      body: {
        name: name,
        email: email,
        gender: gender,
        status: status,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.headers).to.have.property("server", "cloudflare");
      expect(response.body).to.have.property("name", name);
      expect(response.body).to.have.property("email", email);
      expect(response.body).to.have.property("gender", gender);
      expect(response.body).to.have.property("status", status);
      expect(response.body).to.have.property("id");
      userId = response.body.id;
    });
  });

  it("GET Retrieves the user data", () => {
    cy.request({
      method: "GET",
      url: baseUrl + userId,
      headers: {
        Authorization: authHeader,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(userId);
      expect(response.body.name).to.eq(name);
      expect(response.body.email).to.eq(email);
      expect(response.body.gender).to.eq(gender);
      expect(response.body.status).to.eq(status);
    });
  });

  it("PATCH Updates the user status to inactive", () => {
    cy.request({
      method: "PATCH",
      url: baseUrl + userId,
      headers: {
        Authorization: authHeader,
      },
      body: {
        status: "inactive",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq("inactive");
    });
  });

  it("DELETE Deletes the user", () => {
    cy.request({
      method: "DELETE",
      url: baseUrl + userId,
      headers: {
        Authorization: authHeader,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

});