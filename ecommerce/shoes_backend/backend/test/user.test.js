let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
// assertion style
chai.should();
chai.use(chaiHttp);

describe("multivandor ecommerce test of user", () => {
  // test the login route
  describe("POST /api/login", () => {
    it("It should login a user", (done) => {
      chai
        .request(server)
        .post("/api/v2/user/login")
        .send({
          email: "baba@gmail.com",
          password: "Baba1412914@",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("get  logout user", () => {
    it("log out user", (done) => {
      chai
        .request(server)
        .get("/api/v2/user/logout")

        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe("get  all?product ", () => {
    it("get all product", (done) => {
      chai
        .request(server)
        .get("/api/v2/product")

        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
