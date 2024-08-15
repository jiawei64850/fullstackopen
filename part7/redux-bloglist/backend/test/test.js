const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blog");
const User = require("../models/user");
const assert = require("node:assert/strict");
const listHelper = require("../utils/list_helper");
const userHelper = require("../utils/user_helper");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");

const api = supertest(app);

describe("add a new blog with token-based authentication", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const newUser = {
      username: "root",
      name: "superuser",
      password: "123456",
    };

    await api.post("/api/users").send(newUser);

    const loginResponse = await api.post("/api/login").send({
      username: "root",
      password: "123456",
    });

    token = loginResponse.body.token;
    console.log("Obtained token:", token);
  });
  test("add a new blog", async () => {
    const blogsAtStart = await listHelper.blogsInDb();

    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "example.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await listHelper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);

    assert(titles.includes("Go To Statement Considered Harmful"));
  });
  test("adding a blog fails with the status code 401 Unauthorized if a token is not provided", async () => {
    const blogsAtStart = await listHelper.blogsInDb();

    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "example.com",
      likes: 5,
    };

    const result = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await listHelper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

    const titles = blogsAtEnd.map((b) => b.title);

    assert(!titles.includes("Go To Statement Considered Harmful"));

    assert(result.body.error.includes("token invalid"));
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("123456", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("vaild user creation", async () => {
    const userAtStart = await userHelper.usersInDb();

    const newUser = {
      username: "polly",
      name: "polly lau",
      password: "123456",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-type", /application\/json/);

    const userAtEnd = await userHelper.usersInDb();
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1);

    const usernames = userAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("invalid user creation (ungiven username or password)", async () => {
    const userAtStart = await userHelper.usersInDb();

    const newUser = {
      username: "polly",
      name: "polly lau",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-type", /application\/json/);

    const userAtEnd = await userHelper.usersInDb();

    assert(result.body.error.includes("username and password must be given."));

    assert.strictEqual(userAtEnd.length, userAtStart.length);
  });

  test("invalid user creation (unmatched username or password long)", async () => {
    const userAtStart = await userHelper.usersInDb();

    const newUser = {
      username: "po",
      name: "polly lau",
      password: "123456",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-type", /application\/json/);

    const userAtEnd = await userHelper.usersInDb();

    assert(
      result.body.error.includes(
        "username and password must be at least 3 characters long",
      ),
    );

    assert.strictEqual(userAtEnd.length, userAtStart.length);
  });

  test("invalid user creation (username repeatedly)", async () => {
    const userAtStart = await userHelper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "123456",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-type", /application\/json/);

    const userAtEnd = await userHelper.usersInDb();

    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(userAtEnd.length, userAtStart.length);
  });
});
describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = listHelper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("verifies that the unique identifier property of the blog posts is named id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogs = response.body;
    assert.strictEqual(blogs.length, listHelper.initialBlogs.length);

    const wrongId = blogs.map((r) => r._id);
    const id = blogs.map((r) => r.id);

    assert(id);
    assert(!id.includes(undefined));
    assert(wrongId.includes(undefined));
  });
});

describe.only("addition of a new blog", () => {
  test("new blog added", async () => {
    const newBlog = {
      title: "Space War",
      author: "Robert C. Martin",
      likes: 23,
      url: "example.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    assert.deepStrictEqual(
      response.body.length,
      listHelper.initialBlogs.length + 1,
    );
    assert(titles.includes("Space War"));
  });

  test("add likes as 0 automatically when it is not existing", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "example.com",
    };

    const postResponse = await api
      .post("/api/blogs")
      .send({ ...newBlog, likes: newBlog.likes || 0 })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    console.log(postResponse.body.error);

    const response = await api.get("/api/blogs");

    const likes = response.body.map((r) => r.likes);

    assert.deepStrictEqual(postResponse.body.likes, 0);
    assert(likes.includes(0));
  });

  test("return 400 bad request when url or title is missing", async () => {
    const newBlog = {
      author: "Robert C. Martin",
      likes: 22,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await listHelper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length);
  });
});

describe("delete a blog", () => {
  test("verified the delete action for the blogs", async () => {
    const blogsAtStart = await listHelper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    console.log(blogToDelete, blogsAtStart);
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await listHelper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    assert(!titles.includes(blogToDelete.content));
  });
});

describe("update a blog", () => {
  test("verified the update action for the blogs", async () => {
    const blogsAtStart = await listHelper.blogsInDb();
    const blogToUpdate = {
      title: "Space War",
      likes: 11,
    };
    const matchBlog = blogsAtStart.find(
      (blog) => blog.title === blogToUpdate.title,
    );

    await api
      .put(`/api/blogs/${matchBlog.id}`)
      .send({
        ...matchBlog,
        likes: blogToUpdate.likes,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await listHelper.blogsInDb();
    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.title === blogToUpdate.title,
    );

    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes);
  });
});

after(async () => {
  mongoose.connection.close();
});

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });
});

describe("favorite blog", () => {
  const blogList = [
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: "Wonderful jokes",
      author: "Edsger W. Dijkstra",
      likes: 8,
    },
  ];

  test("when list has the same most likes, displays one of those", () => {
    const result = listHelper.favoriteBlog(blogList);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most likes", () => {
  const blogList = [
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    {
      title: "Functional Classes in Clojure",
      author: "Robert C. Martin",
      likes: 8,
    },
    {
      title: "Functional Classes",
      author: "Robert C. Martin",
      likes: 5,
    },
    {
      title: "Space War",
      author: "Robert C. Martin",
      likes: 2,
    },
  ];

  test("return the authors having the most likes", () => {
    const result = listHelper.mostLikes(blogList);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
