import { gql } from '@apollo/client';
import React from 'react';
import Query from '../../components/Query';

export const GET_AGENCIES = gql`
  query GetAgencies {
    getAgencies {
      getAgenciesStatus
      agencies {
        agencyId
        agencyName
        agencyType
        msisdn
        dealerCode
        payBill
        bankName
        bankAccount
        createdBy
      }
    }
  }
`;

const GetAgenciesQuery = ({ ...rest }) => {
  return <Query query={GET_AGENCIES} {...rest} />;
};

export default GetAgenciesQuery;
