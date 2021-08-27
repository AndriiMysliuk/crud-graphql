import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query getUsers {
    users @rest(type: "Users", path: "users") {
      _id
      name
    }
  }
`;
