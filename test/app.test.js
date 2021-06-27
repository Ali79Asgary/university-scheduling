const app = require("../app");
const mongoose = require("mongoose");
const supertest = require("supertest");
const config = require('../config/development-config.json')
const dbUtil = require("./util/databaseUtil")

const { request, response } = require("../app");

beforeAll( async () => {
    const url = `mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.MONGODB_TEST_DB_NAME}`;
    mongoose.connect(url, config.MONGOOSE_config)

    await dbUtil.insertUser(config.TEST_ADMIN_CREDS)
});

test("POST /api/auth/Login", async () => {

    request.body = {
        "code" : config.TEST_ADMIN_CREDS.code,
        "password" : config.TEST_ADMIN_CREDS.password
    }

    await supertest(app).post("/api/auth/Login")
      .expect(200)
      .then( (response) => {
          expect(response.body.token).toBeTruthy()
      })

  });
  
afterAll( done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
});