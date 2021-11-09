import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_REGIONS = gql`
  query GetRegions {
    getRegions {
      getRegionsStatus
      regions {
        regionId
        regionName
      }
    }
  }
`;

const GetRegionsQuery = ({ ...rest }) => {
  return <Query query={GET_REGIONS} {...rest} />;
};

export default GetRegionsQuery;
