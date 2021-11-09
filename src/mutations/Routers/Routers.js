import { gql } from '@apollo/client';

export const UPDATE_SIMEX_ROUTER_SN = gql`
  mutation UpdateSimex($input: SimexUpdateDetails!) {
    updateSimex(input: $input) {
      status
      message
    }
  }
`;

export const SIM_REPLACEMENT = gql`
  mutation SimReplacement($input: SimReplacementDetails!) {
    simReplacement(input: $input) {
      status
      message
    }
  }
`;

export const UPLOAD_ROUTERS = gql`
  mutation uploadRouters($input: RoutersUploadData!) {
    uploadRouters(input: $input) {
      status
      message
    }
  }
`;

export const UPLOAD_SINGLE_ROUTER = gql`
  mutation uploadSingleRouter($input: SingleRouterUploadData!) {
    uploadSingleRouter(input: $input) {
      status
      message
    }
  }
`;

export const UPLOAD_ROUTERS_ADMIN = gql`
  mutation UploadRoutersAdmin($input: RoutersUploadData!) {
    uploadRoutersAdmin(input: $input) {
      status
      message
    }
  }
`;

export const ROUTER_TRANSFER = gql`
  mutation routerTransfer($agencyId: Int!, $serialNumber: String!) {
    routerTransfer(agencyId: $agencyId, serialNumber: $serialNumber) {
      status
      message
    }
  }
`;
