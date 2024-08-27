import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          id
          fullName
          description
          language
          ratingAverage
          reviewCount
          forksCount
          stargazersCount
          ownerAvatarUrl
        }
      }
    }
  }
`;

export const IS_SIGNIN = gql`
query {
  me {
    id
    username
  }
}
`;