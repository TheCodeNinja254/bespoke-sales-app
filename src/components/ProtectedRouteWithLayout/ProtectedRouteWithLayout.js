import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import GetSignedInUserQuery from '../../queries/Account/GetSignedInUser';
import IdleRedirect from '../Common/IdleRedirect';

const ProtectedRouteWithLayout = ({
  layout: Layout,
  redirectTo,
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <GetSignedInUserQuery>
          {({ getSignedInUser }) =>
            getSignedInUser ? (
              <Layout>
                <IdleRedirect />
                <Component {...matchProps} userDetails={getSignedInUser} />
              </Layout>
            ) : (
              <Redirect
                to={{
                  pathname: redirectTo,
                  state: { origin: matchProps.location }
                }}
              />
            )
          }
        </GetSignedInUserQuery>
      )}
    />
  );
};

ProtectedRouteWithLayout.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  redirectTo: '/sign-in'
};

ProtectedRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default React.memo(ProtectedRouteWithLayout);
