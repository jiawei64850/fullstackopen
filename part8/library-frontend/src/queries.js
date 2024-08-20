import { gql } from "@apollo/client";

export const BOOKS_DETAILS = gql`
fragment BooksDetails on Book {
  title,
  author {
    name,
  },
  published,
  genres,
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born
  }
}
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String){
    allBooks(genre: $genre) {
      ...BooksDetails
    }
  }
${BOOKS_DETAILS}
`

export const FIND_FAVORITEGENRES = gql`
query findFavoriteGenres($username: String!) {
  findFavoriteGenres(username: $username) {
    username
    favoriteGenre
  }
}
`

  
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook (
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    ...BooksDetails
  }
}
${BOOKS_DETAILS}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
  editAuthor (
    name: $name,
    born: $born
  ) {
    name
    born
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BooksDetails
    }
  }
  ${BOOKS_DETAILS}
`

