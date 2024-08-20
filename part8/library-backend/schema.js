const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    _id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    _id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: [String!]
    _id: ID!
  }

  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(genre: String) : [Book!]!
    allAuthors: [Author!]!
    findFavoriteGenres(username: String!): User
    me: User
  }
  
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book!,
    editAuthor(
      name: String!
      born: Int!
    ): Author
    createUser(
    username: String!
    favoriteGenre: [String!]
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }    
`

module.exports = typeDefs