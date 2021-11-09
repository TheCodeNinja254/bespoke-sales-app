import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_ESTATES = gql`
  query GetEstates(
    $zoneId: Int!
    $retrieveByZone: String!
    $pageSize: Int
    $pageNo: Int
  ) {
    getEstates(
      zoneId: $zoneId
      retrieveByZone: $retrieveByZone
      pageSize: $pageSize
      pageNo: $pageNo
    ) {
      getEstatesStatus
      getEstatesCount
      estates {
        estateId
        estateName
        regionId
        status
        contractorAgencyId
        oltName
        noOfHouses
        occupancy
        coordinates
        houseNumbers
        zoneId
        tierNumber
        createdBy
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

const GetEstatesQuery = ({ ...rest }) => {
  return <Query query={GET_ESTATES} {...rest} />;
};

export default GetEstatesQuery;
