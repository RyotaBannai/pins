import { gql } from "@apollo/client";

export const S_CREATE_LIST = gql`
  mutation CREATE_LIST($name: String!, $description: String!) {
    createList(data: { name: $name, description: $description }) {
      id
      name
    }
  }
`;

export const S_GET_LIST = gql`
  query GET_LIST($id: String!) {
    getList(id: $id) {
      id
      name
      description
      targets {
        ... on Item {
          id
          data
          type
        }
        ... on Set {
          name
          items {
            id
            data
            type
          }
        }
      }
    }
  }
`;

export const S_GET_LISTS = gql`
  {
    getLists {
      id
      name
      description
      targets {
        ... on Item {
          id
          data
          type
        }
        ... on Set {
          name
          items {
            id
            data
            type
          }
        }
      }
    }
  }
`;

export const S_ADD_ADDEES = gql`
  mutation ADD_ADDEES(
    $id: Float!
    $addee_type: String!
    $addee_ids: [Float!]!
  ) {
    addAddees(
      data: { id: $id, addee_type: $addee_type, addee_ids: $addee_ids }
    ) {
      id
    }
  }
`;
