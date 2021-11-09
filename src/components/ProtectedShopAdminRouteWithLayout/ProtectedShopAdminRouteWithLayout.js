import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import GetSignedInUserQuery from '../../queries/Account/GetSignedInUser';
import IdleRedirect from '../Common/IdleRedirect';

const ProtectedShopAdminRouteWithLayout = ({
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
                {/* ensure only Sales Admin can access this route */}
                {getSignedInUser.user.role === 'SalesManagement' &&
                getSignedInUser.user.userCategory === 'shop_admin' ? (
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

ProtectedShopAdminRouteWithLayout.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  redirectTo: '/sign-in'
};

ProtectedShopAdminRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default React.memo(ProtectedShopAdminRouteWithLayout);
