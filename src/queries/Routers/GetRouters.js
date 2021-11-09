import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_ROUTERS = gql`
  query GetRouters($roundTime: Int!) {
    getRouters(roundTime: $roundTime) {
      getRouterStatus
      routers {
        routerSerialNumber
      }
    }
  }
`;

const GetRoutersQuery = ({ ...rest }) => {
  return <Query query={GET_ROUTERS} {...rest} />;
};

export default GetRoutersQuery;
