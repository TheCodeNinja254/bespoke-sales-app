import { gql } from '@apollo/client';

export const CREATEUSER = gql`
  mutation CreateUser($input: UserDetails!) {
    createUser(input: $input) {
      status
      message
      body
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerDetails!) {
    createCustomer(input: $input) {
      status
      message
    }
  }
`;

export const UPDATE_CUSTOMER_MSISDN = gql`
  mutation UpdateCustomerMsisdn($input: CustomerMSISDNDetails!) {
    updateCustomerMsisdn(input: $input) {
      status
      message
    }
  }
`;

export const DELETE_CUSTOMER_RECORD = gql`
  mutation deleteRegRecord($reason: String!, $registrationId: Int!) {
    deleteRegRecord(reason: $reason, registrationId: $registrationId) {
      status
      message
    }
  }
`;

export const UPDATE_CUSTOMER_ROUTER = gql`
  mutation UpdateCustomerRouter($input: CustomerRouterDetails!) {
    updateCustomerRouter(input: $input) {
      status
      message
    }
  }
`;
