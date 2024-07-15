const db = require("../db/connection.js")
const testData = require("../db/data/test-data")
const endpointsData = require("../endpoints.json")
const seed = require("../db/seeds/seed.js")

const app = require("../src/app.js")

const request = require("supertest")

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("/api", () => {
    describe("GET", () => {
        test("200: responds with an object detailing available enpoints", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({ body: { endpoints } }) => {
                    expect(endpoints).toStrictEqual(endpointsData)
                })
        })
    })
})

describe("/api/topics", () => {
    describe("GET", () => {
        test("200: responds with a body containing an array of all topics.", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics.length).toBe(3)
                    topics.forEach(topic => {
                        expect(topic).toMatchObject({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    })
                })
        })
    })
})

describe("Bad endpoint", () => {
    test("404: responds with a message 'Bad endpoint'.", () => {
        return request(app)
            .get("/api/not-an-endpoint")
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe("Bad endpoint")
            })
    })
})
