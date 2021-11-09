import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_USER = gql`
  query GetUser($id: Int!) {
    getUser(id: $id) {
      user {
        id
        firstName
        lastName
        fullName
        email
        mobileNumber
        status
        userRole
      }
    }
  }
`;

const GetUserQuery = ({ ...rest }) => {
  return <Query query={GET_USER} {...rest} />;
};

export default GetUserQuery;
