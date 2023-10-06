const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert(
    "Customers",
    [
      {
        email: "billie@mail.com",
        password: bcrypt.hashSync("billie", bcrypt.genSaltSync(8)),
        role: "Customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "eilish@mail.com",
        password: bcrypt.hashSync("eilish", bcrypt.genSaltSync(8)),
        role: "Customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
});

describe("post /pub/register", () => {
  it("responds with 201 when success", async () => {
    const body = {
      email: "cust1@mail.com",
      password: "cust1",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("password");
  });

  it("responds with 400 when email is not submitted", async () => {
    const body = {
      password: "cust1",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when password is not submitted", async () => {
    const body = {
      email: "cust1@mail.com",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when email is empty", async () => {
    const body = {
      email: "",
      password: "cust1",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when password is empty", async () => {
    const body = {
      email: "cust1@mail.com",
      password: "",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when email is already registered", async () => {
    const body = {
      email: "cust1@mail.com",
      password: "cust1",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });

  it("responds with 400 when email is invalid", async () => {
    const body = {
      email: "email",
      password: "cust1",
    };

    const response = await request(app).post("/pub/register").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message");
  });
});

describe("post /pub/login", () => {
  it("responds with 200 when success", async () => {
    const body = {
      email: "cust1@mail.com",
      password: "cust1",
    };

    const response = await request(app).post("/pub/login").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("access_token");
  });

  it("responds with 401 when password is invalid", async () => {
    const body = {
      email: "cust1@mail.com",
      password: "cust11",
    };

    const response = await request(app).post("/pub/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid password");
  });

  it("responds with 401 when email is unregistered", async () => {
    const body = {
      email: "cust1@mail.com",
      password: "cust11",
    };

    const response = await request(app).post("/pub/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Customers", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});
