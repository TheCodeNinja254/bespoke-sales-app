import { gql } from '@apollo/client';

export const SIGNOUT = gql`
  mutation SignOut {
    signOut
  }
`;

export const VALIDATE_OTP = gql`
  mutation validateOTP($otp: String!) {
    validateOTP(otp: $otp) {
      status
      message
      role
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword(
    $username: String!
    $currentPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      username: $username
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      status
      message
      role
    }
  }
`;

export const SIGNIN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      status
      message
      role
    }
  }
`;

export const CREATEUSER = gql`
  mutation CreateUser($input: UserDetails!) {
    createUser(input: $input) {
      status
      message
    }
  }
`;

export const EDITUSER = gql`
  mutation EditUser($input: UserDetails!) {
    editUser(input: $input) {
      status
      message
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus(
    $status: String!
    $userName: String!
    $msisdn: String
    $emailAddress: String
  ) {
    updateUserStatus(
      status: $status
      userName: $userName
      msisdn: $msisdn
      emailAddress: $emailAddress
    ) {
      status
      message
    }
  }
`;

export const UPDATEPASSWORD = gql`
  mutation updateAccountPassword(
    $currentPassword: String!
    $password: String!
  ) {
    updateAccountPassword(
      currentPassword: $currentPassword
      password: $password
    ) {
      status
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $username: String!
    $passphrase: String!
    $otp: String!
  ) {
    resetPassword(username: $username, passphrase: $passphrase, otp: $otp) {
      status
      message
    }
  }
`;

export const GENERATE_OTP = gql`
  mutation GenerateOTP($email: String!) {
    generateOTP(email: $email) {
      status
      message
    }
  }
`;
