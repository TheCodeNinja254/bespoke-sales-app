import { Redirect } from 'react-router-dom';
import React from 'react';

const RedirectTo = (pathname) => {
  return (
    <Redirect
      to={{
        pathname
      }}
    />
  );
};

export default RedirectTo;
