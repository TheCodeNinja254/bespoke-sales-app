import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import GetSignedInUserQuery from '../../queries/Account/GetSignedInUser';
import IdleRedirect from '../Common/IdleRedirect';

const ProtectedSalesAgentRouteWithLayout = ({
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
              <>
                {/* ensure only Sales Agents can access this route */}
                {getSignedInUser.user.role === 'Sales' ? (
                  <Layout>
                    <IdleRedirect />
                    <Component {...matchProps} userDetails={getSignedInUser} />
                  </Layout>
                ) : (
                  <Redirect
                    to={{
                      pathname: '/',
                      state: { origin: matchProps.location }
                    }}
                  />
                )}
              </>
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

ProtectedSalesAgentRouteWithLayout.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  redirectTo: '/sign-in'
};

ProtectedSalesAgentRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default React.memo(ProtectedSalesAgentRouteWithLayout);
