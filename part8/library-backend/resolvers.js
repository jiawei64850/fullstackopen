const { GraphQLError } = require('graphql');
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (args.genre) {
            return Book.find({ genres: args.genre }).populate('author')
        }
        return Book.find({}).populate('author')
      },
      allAuthors: async () => {
        const authors = await Author.find({});

        const authorsWithBookCount = await Promise.all(
          authors.map(async (author) => {
            const bookCount = await Book.countDocuments({ author: author._id });
            return {
              ...author.toObject(), 
              bookCount,
            };
          })
        );
  
        return authorsWithBookCount;
      },
      findFavoriteGenres: async (root, args) => {
        const user = User.findOne({ username: args.username })
        return user
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        console.log('currentUser', currentUser)
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        let author = await Author.findOne({ name: args.author });
  
        if (!author) {
          author = new Author({ name: args.author });
          try {
            await author.save();
          } catch (error) {
            throw new GraphQLError('Invalid author', {
              extensions: {
                code: 'BAD_AUTHOR_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          }
        }
  
        const book = new Book({ ...args, author: author._id  })
        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Invalid title', {
            extensions: {
              code: 'BAD_BOOK_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book })

        return book;
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        console.log(currentUser)
  
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        const author = await Author.findOne({ name: args.name })
  
        if (!author) return null 
        
        author.born = args.born
        return author.save()
      },
      createUser: async (root, args) => {
        const user = new User({ 
          username: args.username,
          favoriteGenre: args.favoriteGenre
        })
  
        return user.save()
          .catch(error => {
            throw new GraphQLError('Invalid user', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },
    },
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
    },
  }

module.exports = resolvers