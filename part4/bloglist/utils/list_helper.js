var _ = require('lodash')
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
      url: 'example.com'
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
      url: 'example.com'
    },
    {
      title: "Functional Classes in Clojure",
      author: "Robert C. Martin",
      likes: 8,
      url: 'example.com'
    },
    {
      title: "Functional Classes",
      author: "Robert C. Martin",
      likes: 22,
      url: 'example.com'
    },
    {
      title: "Space War",
      author: "Robert C. Martin",
      likes: 23,
      url: 'example.com'
    }
  ]


const blogsInDb = async () => {
  const blogs = await Blog.find( {} )
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs[0].likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    const favoriteBlog = blogs
      .reduce(((maxBlog, currentBlog) => 
        (maxBlog ? maxBlog.likes : 0) > currentBlog.likes ? maxBlog : currentBlog),
      null)
    return favoriteBlog
}

const mostBlogs = (blogs) => {
    const groupList = _.groupBy(blogs, 'author')
    const authorList = Object.keys(groupList)
      .reduce((mostAuthor, currentAuthor) =>
        groupList[mostAuthor].length > groupList[currentAuthor].length ? mostAuthor : currentAuthor)
    
    const mostBlogs = {
        author: authorList,
        blogs: groupList[authorList].length
    }

    return mostBlogs
}

const mostLikes = (blogs) => {
    const groupList = _.groupBy(blogs, 'author')
    const totalLikesList = Object.keys(groupList)
      .map(author => {
        const totalLikes = groupList[author].reduce((sum, currentBlog) => 
            sum + currentBlog.likes, 0)
        return { author, likes: totalLikes }
    })

    const mostLikes = totalLikesList
      .reduce((mostAuthor, currentAuthor) => 
        mostAuthor.likes > currentAuthor.likes ? mostAuthor : currentAuthor, { likes : 0 })
    return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  blogsInDb
}