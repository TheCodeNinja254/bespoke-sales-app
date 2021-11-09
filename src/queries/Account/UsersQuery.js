import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_USERS = gql`
  query GetUsers($agencyId: String!) {
    getUsers(agencyId: $agencyId) {
      getUsersStatus
      getUsersCount
      users {
        id
        firstName
        lastName
        fullname
        userName
        msisdn
        docNumber
        status
        createdOn
        createdBy
        role
      }
    }
  }
`;

const GetSignedInUserQuery = ({ ...rest }) => {
  return <Query query={GET_USERS} {...rest} />;
};

export default GetSignedInUserQuery;
