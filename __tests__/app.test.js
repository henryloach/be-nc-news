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
        test("200: Responds with an object detailing available endpoints.", () => {
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
        test("200: Responds with a body containing an array of all topics.", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics).toHaveLength(3)
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

describe("/api/articles", () => {
    describe("GET", () => {
        test("200: Responds with an array of all article objects", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toHaveLength(13)
                    articles.forEach(article => {
                        expect(article).toMatchObject({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    })
                    // TODO - I suspect this passing might be a coincidence ATM, investigate safety of sorting dates as string
                    expect(articles).toBeSortedBy('created_at', { descending: true })
                    expect(articles.every(article => {
                        return article.hasOwnProperty("body") === false
                    })).toBe(true)
                })
        })
    })
})

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("200: Responds with the requested article object.", () => {
            return request(app)
                .get("/api/articles/2")
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toMatchObject({
                        article_id: 2,
                        title: "Sony Vaio; or, The Laptop",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                        created_at: "2020-10-16T05:03:00.000Z",
                        votes: 0,
                        article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                    })
                })
        })
        test("404: Well formed article id endpoint not found in database.", () => {
            return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then(({ body: { message } }) => {
                    expect(message).toBe("No article matching requested id")
                })
        })
        test("400: Malformed article id endpoint.", () => {
            return request(app)
                .get("/api/articles/not-an-id")
                .expect(400)
                .then(({ body: { message } }) => {
                    expect(message).toBe("Bad endpoint")
                })
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("200: Responds with an array of all comments of the requested article", () => {
            return request(app)
                .get("/api/articles/3/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments).toHaveLength(2)
                    comments.forEach(comment => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            article_id: expect.any(Number),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String)
                        })
                    })
                    expect(comments).toBeSortedBy('created_at', { descending: true })
                })
        })
        test("200: Responds with an empty array for articles with no comments", () => {
            return request(app)
                .get("/api/articles/4/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments).toStrictEqual([])
                })
        })
        test("404: Well formed article id endpoint not found in database.", () => {
            return request(app)
                .get("/api/articles/999/comments")
                .expect(404)
                .then(({ body: { message } }) => {
                    expect(message).toBe("No article matching requested id")
                })
        })
        test("400: Malformed article id endpoint.", () => {
            return request(app)
                .get("/api/articles/not-an-id/comments")
                .expect(400)
                .then(({ body: { message } }) => {
                    expect(message).toBe("Bad endpoint")
                })
        })
    })
})

describe("Bad endpoint", () => {
    test("400: Responds with a message 'Bad endpoint'.", () => {
        return request(app)
            .get("/api/not-an-endpoint")
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe("Bad endpoint")
            })
    })
})
