import { gql } from '@apollo/client';

export const UPLOAD_ESTATES = gql`
  mutation UploadEstates($input: EstatesUploadData!) {
    uploadEstates(input: $input) {
      status
      message
    }
  }
`;

export const ADD_ESTATE = gql`
  mutation AddEstate($input: AddEstateData!) {
    addEstate(input: $input) {
      status
      message
    }
  }
`;

export const UPDATE_ESTATE = gql`
  mutation UpdateEstate($input: UpdateEstateData!) {
    updateEstate(input: $input) {
      status
      message
    }
  }
`;
