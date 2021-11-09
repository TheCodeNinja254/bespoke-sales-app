import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_SIGNED_IN_USER = gql`
  query GetSignedInUser {
    getSignedInUser {
      user {
        firstName
        fullname
        email
        role
        email
        agencyId
        agencyName
        userCategory
      }
    }
  }
`;

const GetSignedInUserQuery = ({ ...rest }) => {
  return <Query query={GET_SIGNED_IN_USER} {...rest} />;
};

export default GetSignedInUserQuery;
