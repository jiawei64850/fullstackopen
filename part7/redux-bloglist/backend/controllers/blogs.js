const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");
const Comment = require("../models/comment");
require("express-async-errors");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1, id: 1 });
  console.log(blog);
  
  response.json(blog);
})

blogsRouter.get("/:id/comments", async (request, response) => {
  const comments = await Blog.findById(request.params.id).populate("comments", { content: 1, user: 1, blog: 1 })
  response.json(comments)
})

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = await request.user;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    likes: body.likes || 0,
    user: user.id,
  });

  console.log("Saving blog:", blog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.post("/:id/comments", middleware.userExtractor, async (request, response) => {
  console.log(request.body);
  
  const { comment } = request.body

  const user = await request.user

  const blog = await Blog.findById(request.params.id)

  const NewComment = new Comment({
    content: comment,
    user: user.id,
    blog: blog.id
  })

  const savedComment = await NewComment.save()

  blog.comments = blog.comments.concat(savedComment._id)
  blog.save()

  user.comments = user.comments.concat(savedComment._id)
  user.save()

  response.status(201).json(savedComment)
})

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = await request.user;
    const userid = user.id;
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString().id === userid.toString()) {
      return response.status(403).json({ error: "without delete access" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
  };

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  if (updateBlog.likes) {
    return response.json(updateBlog);
  }
});

module.exports = blogsRouter;
