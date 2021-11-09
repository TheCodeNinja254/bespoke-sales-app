import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_MY_CUSTOMERS = gql`
  query GetMySales(
    $pageSize: Int!
    $page: Int!
    $searchParam: String
    $searchValue: String
  ) {
    getMySales(
      pageSize: $pageSize
      page: $page
      searchParam: $searchParam
      searchValue: $searchValue
    ) {
      getSalesDataStatus
      getSalesCount
      sales {
        registrationId
        sponsorMsisdn
        routerSerialNumber
        paymentStatus
        productName
        saleDate
        firstName
        lastName
        fullName
        estateName
        houseNumber
        paymmentDate
        activationDate
        beneficiaryMsisdn
        createdBy
      }
    }
  }
`;

const GetMyCustomersQuery = ({ ...rest }) => {
  return <Query query={GET_MY_CUSTOMERS} {...rest} />;
};

export default GetMyCustomersQuery;
