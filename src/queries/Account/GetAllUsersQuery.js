import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_ALL_USERS = gql`
  query GetAllUsers($agencyId: String!) {
    getAllUsers(agencyId: $agencyId) {
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

// export class GetAllUsersQuery extends Query {
//   // eslint-disable-next-line react/static-property-placement
//   static defaultProps = {
//     query: GET_ALL_USERS
//   };
// }

const GetAllUsersQuery = ({ ...rest }) => {
  return <Query query={GET_ALL_USERS} {...rest} />;
};

export default GetAllUsersQuery;
