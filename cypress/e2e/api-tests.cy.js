describe("API tests", () => {

  const authHeader = "Bearer ae45dfa0e871e65f3c9978083274d9c6c406989da91fe63aee244bd99b42a3b0";
  const baseUrl = "https://gorest.co.in/public/v2/";
  const name = "Ugrifules";
  const email = "ugrifules@example.com";
  const gender = "male";
  const status = "active";
  let userId;

  before(() => {
    cy.request({
      method: "POST",
      url: baseUrl + "users",
      headers: {
        Authorization: authHeader
      },
      body: {
        name: name,
        email: email,
        gender: gender,
        status: status,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      userId = response.body.id;
    });
  });

  after(() => {
    cy.request({
      method: "DELETE",
      url: baseUrl + "users/" + userId,
      headers: {
        Authorization: authHeader
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  describe("Testing the /users resource", () => {

    it("[GET] Retrieves the user created in the Before hook", () => {
      cy.request({
        method: "GET",
        url: baseUrl + "users/" + userId,
        headers: {
          Authorization: authHeader
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers.server).to.eq("cloudflare");
        expect(response.body.id).to.eq(userId);
        expect(response.body.name).to.eq(name);
        expect(response.body.email).to.eq(email);
        expect(response.body.gender).to.eq(gender);
        expect(response.body.status).to.eq(status);
      });
    });

    it("[PATCH] Updates the user name", () => {
      let updatedName = "Legkisebb Ugrifules";
      cy.request({
        method: "PATCH",
        url: baseUrl + "users/" + userId,
        headers: {
          Authorization: authHeader
        },
        body: {
          name: updatedName,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedName);
      });
    });
  });

  describe("Testing the /users/<userId>/posts resource", () => {

    const title = "Test. Automate. Accelerate."
    const body = "With Cypress, you can easily create tests for your modern web applications, debug them visually, and automatically run them in your continuous integration builds."
    let postId;

    it("[POST] Creates a new post by the user", () => {
      cy.request({
        method: "POST",
        url: baseUrl + "users/" + userId + "/posts",
        body: {
          user_id: userId,
          title: title,
          body: body
        },
        headers: {
          Authorization: authHeader
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        postId = response.body.id;
      });
    });

    it("[GET] Retrieves the post created by the user", () => {
      cy.request({
        method: "GET",
        url: baseUrl + "users/" + userId + "/posts",
        headers: {
          Authorization: authHeader
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body[0].id).to.eq(postId);
        expect(response.body[0].user_id).to.eq(userId);
        expect(response.body[0].title).to.eq(title);
        expect(response.body[0].body).to.eq(body);
      });
    });
  });

});