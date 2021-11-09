import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_SINGLE_ESTATE = gql`
  query GetSingleEstate($estateId: Int!) {
    getSingleEstates(estateId: $estateId) {
      getEstatesStatus
      estates {
        id
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

const GetSingleEstateQuery = ({ ...rest }) => {
  return <Query query={GET_SINGLE_ESTATE} {...rest} />;
};

export default GetSingleEstateQuery;
