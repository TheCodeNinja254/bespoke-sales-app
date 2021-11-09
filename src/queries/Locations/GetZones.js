import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_ZONES = gql`
  query GetZones($regionId: String!, $retrieveBy: String!) {
    getZones(regionId: $regionId, retrieveBy: $retrieveBy) {
      getZonesStatus
      zones {
        id
        zoneName
        assignedDealerId
        status
        createdAt
      }
    }
  }
`;

const GetZonesQuery = ({ ...rest }) => {
  return <Query query={GET_ZONES} {...rest} />;
};

export default GetZonesQuery;
