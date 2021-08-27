import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($input: CreateUser) {
    createUser(input: $input)
      @rest(type: "CreateUser", method: "POST", path: "user") {
      _id
      name
    }
  }
`;
export const EDIT_USER = gql`
  mutation editUser($input: EditUser) {
    editUser(input: $input)
      @rest(type: "EditUser", method: "PUT", path: "user") {
      _id
      name
    }
  }
`;
export const DELETE_USER = gql`
  mutation deleteUser($id: _id) {
    deleteUser(id: $id)
      @rest(type: "DeleteUser", method: "DELETE", path: "user/{args.id}") {
      _id
    }
  }
`;
