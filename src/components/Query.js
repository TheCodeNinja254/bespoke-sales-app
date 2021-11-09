import React from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import Box from '@material-ui/core/Box';
import Loader from './Loader';
import MySnackbarContentWrapper from './MySnackbarContentWrapper';
import ErrorHandler from '../utils/errorHandler';

const printErrorMessage = (error) => {
  let message =
    error.message ||
    'Looks like we are experiencing a technical difficulty. Our team is working to resolve the issue. Please try again later.';
  if (error.message === 'Network error: Failed to fetch') {
    message =
      'Sorry! We encountered a network error. Please refresh this page. If the problem persists, please contact us.';
  }
  return ErrorHandler(message);
};

const Query = ({
  children,
  getTranslations,
  fetchMore,
  loader,
  query,
  hideError = false,
  ...restProps
}) => {
  const {
    loading,
    error,
    data,
    networkStatus,
    fetchMore: apolloFetchMore,
    refetch
  } = useQuery(query, { ...restProps });
  if (error && hideError === false) {
    let message = printErrorMessage(error);
    if (printErrorMessage(error).match(/Network error.*/)) {
      message =
        'Looks like we are experiencing a technical difficulty. Our team is working to resolve the issue. Please try again later.';
    }
    return (
      <Box component="div">
        <MySnackbarContentWrapper
          variant="danger"
          variantText="dangerText"
          message={`${ErrorHandler(message)}`}
        />
      </Box>
    );
  }

  if (
    networkStatus === NetworkStatus.loading ||
    (networkStatus !== NetworkStatus.fetchMore && loading)
  ) {
    return loader || <Loader />;
  }

  const props = {
    ...data,
    networkStatus,
    fetchMore: fetchMore ? () => fetchMore(data, apolloFetchMore) : undefined,
    refetch
  };

  return children(props);
};

export default Query;
