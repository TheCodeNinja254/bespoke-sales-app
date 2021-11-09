import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const CREATE_AGENCY = gql`
  mutation CreateAgency($input: AgencyData!) {
    createAgency(input: $input) {
      status
      message
    }
  }
`;
