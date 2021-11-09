import React from 'react';
import { Switch } from 'react-router-dom';

import {
  ProtectedSalesManagementRouteWithLayout,
  ProtectedRouteWithLayout,
  ProtectedSalesAgentRouteWithLayout,
  ProtectedSuperAdminRouteWithLayout,
  RouteWithLayout,
  UnauthenticatedRouteWithLayout,
  ProtectedShopAdminRouteWithLayout
} from './components';
import {
  SalesManagement as SalesManagementLayout,
  Minimal as MinimalLayout,
  SalesAgent as SalesAgentLayout,
  ShopAdmin as ShopAdminLayout,
  SuperAdmin as SuperAdminLayout
} from './layouts';
import Loadable from './components/Loadable';

/*
 * Unautheticated Views
 */
const SignInView = Loadable(() =>
  import(/* webpackChunkName: "signInView" */ './views/SignIn')
);
const VerifyOTPView = Loadable(() =>
  import(/* webpackChunkName: "signInView" */ './views/SignIn/VerifyOTP')
);
const ChangePassword = Loadable(() =>
  import(/* webpackChunkName: "signInView" */ './views/SignIn/ChangePassword')
);
const ForgotPasswordView = Loadable(() =>
  import(
    /* webpackChunkName: "ForgotPassword" */ './views/SignIn/ForgotPassword'
  )
);
const PasswordResetView = Loadable(() =>
  import(/* webpackChunkName: "PasswordReset" */ './views/SignIn/PasswordReset')
);
const NotFoundView = Loadable(() =>
  import(/* webpackChunkName: "notFoundView" */ './views/NotFound')
);
const ActionRedir = Loadable(() =>
  import(/* webpackChunkName: "storeSelectio View" */ './views/ActionRedir')
);

/*
 * ShopAdmin Views
 */
const DealerRegisterCustomerView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SalesManagement/MyCustomers/RegisterCustomer'
  )
);
const DealerRoutersUploadView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SalesManagement/Routers/UploadRouter'
  )
);
const DealerSingleRouterUploadView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SalesManagement/Routers/UploadSingleRouter'
  )
);
const DealerReadyEstatesView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SalesManagement/ReadyEstates/ReadyEstates'
  )
);
const DealerCustomersView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentAddResourceView" */ './views/SalesManagement/MyCustomers/CustomerList'
  )
);
const DealerSingleCustomerView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentSingleCustomerView" */ './views/SalesManagement/MyCustomers/Account'
  )
);
const DealerUserListView = Loadable(() =>
  import(/* webpackChunkName: "userListView" */ './views/SalesManagement/Users')
);
const DealerAddUserView = Loadable(() =>
  import(
    /* webpackChunkName: "addUserView" */ './views/SalesManagement/Users/AddUser'
  )
);
const DealerEditUserView = Loadable(() =>
  import(
    /* webpackChunkName: "addUserView" */ './views/SalesManagement/Users/EditUser'
  )
);

/*
 * SuperAdmin Views
 */
const SuperAdminRoutersListCustomerView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/Routers/RoutersList'
  )
);
const SuperAdminRoutersUploadView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/Routers/UploadRouter'
  )
);
const SuperAdminSingleRouterUploadView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/Routers/UploadSingleRouter'
  )
);
const SuperAdminReadyEstatesView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/ReadyEstates/ReadyEstates'
  )
);
const SuperAdminUploadMultpleEstatesView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/ReadyEstates/UploadMultipleEstates'
  )
);
const SuperAdminUploadSingleEstatesView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/ReadyEstates/UploadSingleEstate'
  )
);
const SuperAdminEditSingleEstatesView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminDashboardView" */ './views/SuperAdmin/ReadyEstates/EditEstate'
  )
);
const SuperAdminCustomersView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentAddResourceView" */ './views/SuperAdmin/MyCustomers/CustomerList'
  )
);
const SuperAdminSingleCustomerView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentSingleCustomerView" */ './views/SuperAdmin/MyCustomers/Account'
  )
);
const SuperAdminUserListView = Loadable(() =>
  import(/* webpackChunkName: "userListView" */ './views/SuperAdmin/Users')
);
const SuperAdminAgencyListView = Loadable(() =>
  import(
    /* webpackChunkName: "userListView" */ './views/SuperAdmin/Users/DealersList'
  )
);
const SuperAdminAddUserView = Loadable(() =>
  import(
    /* webpackChunkName: "addUserView" */ './views/SuperAdmin/Users/AddUser'
  )
);
const SuperAdminAddAgencyView = Loadable(() =>
  import(
    /* webpackChunkName: "addUserView" */ './views/SuperAdmin/Users/AddDealer'
  )
);
const SuperAdminEditUserView = Loadable(() =>
  import(
    /* webpackChunkName: "addUserView" */ './views/SuperAdmin/Users/EditUser'
  )
);
const SuperAdminAccountView = Loadable(() =>
  import(
    /* webpackChunkName: "superadminAccountView" */ './views/SuperAdmin/Account/Account'
  )
);
const SuperAdminProfileView = Loadable(() =>
  import(
    /* webpackChunkName: "superAdminMyProfileView" */ './views/SuperAdmin/Users/MyProfile'
  )
);

/*
 * SalesAgent views
 *
 */
const SalesAgentCustomersView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentAddResourceView" */ './views/SalesAgent/MyCustomers/CustomerList'
  )
);
const SalesAgentRegisterCustomerView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentAddResourceView" */ './views/SalesAgent/MyCustomers/RegisterCustomer'
  )
);
const SalesAgentSingleCustomerView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentSingleCustomerView" */ './views/SalesAgent/MyCustomers/Account'
  )
);
const SalesAgentReadyEstatesView = Loadable(() =>
  import(
    /* webpackChunkName: "SalesAgentStoresView" */ './views/SalesAgent/ReadyEstates/ReadyEstates'
  )
);

const Routes = () => {
  return (
    <Switch>
      <ProtectedRouteWithLayout
        component={ActionRedir}
        exact
        layout={MinimalLayout}
        titleLayout=""
        path="/"
      />

      {/* Start of ShopAdmin Router */}
      <ProtectedSalesManagementRouteWithLayout
        component={DealerCustomersView}
        exact
        titleLayout="Portal Dashboard"
        layout={SalesManagementLayout}
        path="/management"
      />
      <ProtectedSalesManagementRouteWithLayout
        component={DealerRegisterCustomerView}
        exact
        titleLayout="Register Customer"
        layout={SalesManagementLayout}
        path="/management/customers/register-customer"
      />
      <ProtectedSalesManagementRouteWithLayout
        component={DealerCustomersView}
        exact
        titleLayout="Customers"
        layout={SalesManagementLayout}
        path="/management/customers"
      />
      <ProtectedSalesManagementRouteWithLayout
        component={DealerSingleCustomerView}
        exact
        titleLayout="View Customer"
        layout={SalesManagementLayout}
        path="/management/customers/single"
      />
      <ProtectedSalesManagementRouteWithLayout
        component={DealerRoutersUploadView}
        exact
        titleLayout="Routers Upload"
        layout={SalesManagementLayout}
        path="/management/upload-routers"
      />
      <ProtectedSalesManagementRouteWithLayout
        component={DealerSingleRouterUploadView}
        exact
        titleLayout="Single Router Upload"
        layout={SalesManagementLayout}
        path="/management/upload-single-router"
      />
      <ProtectedSalesManagementRouteWithLayout
        component={DealerReadyEstatesView}
        exact
        titleLayout="4G Ready Estates"
        layout={SalesManagementLayout}
        path="/management/ready-estates"
      />

      {/* Shop Admin specific views */}
      <ProtectedShopAdminRouteWithLayout
        component={DealerUserListView}
        exact
        layout={ShopAdminLayout}
        path="/management/users"
      />
      <ProtectedShopAdminRouteWithLayout
        component={DealerEditUserView}
        exact
        layout={ShopAdminLayout}
        path="/management/user/:id"
      />
      <ProtectedShopAdminRouteWithLayout
        component={DealerAddUserView}
        exact
        layout={ShopAdminLayout}
        path="/management/users/add-user"
      />

      {/* start of sales agents views */}
      <ProtectedSalesAgentRouteWithLayout
        component={SalesAgentCustomersView}
        exact
        titleLayout="Sales Agent Dashboard"
        layout={SalesAgentLayout}
        path="/sales"
      />
      <ProtectedSalesAgentRouteWithLayout
        component={SalesAgentCustomersView}
        exact
        titleLayout="Customers"
        layout={SalesAgentLayout}
        path="/sales/customers"
      />
      <ProtectedSalesAgentRouteWithLayout
        component={SalesAgentSingleCustomerView}
        exact
        titleLayout="View Customer"
        layout={SalesAgentLayout}
        path="/sales/customers/single"
      />
      <ProtectedSalesAgentRouteWithLayout
        component={SalesAgentRegisterCustomerView}
        exact
        titleLayout="Customer Registration"
        layout={SalesAgentLayout}
        path="/sales/customers/register-customer"
      />
      <ProtectedSalesAgentRouteWithLayout
        component={SalesAgentReadyEstatesView}
        exact
        titleLayout="4G Ready Estate"
        layout={SalesAgentLayout}
        path="/sales/ready-estates"
      />
      {/* End of sales Agents views. */}

      {/* Start of SuperAdmin Routes */}
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminCustomersView}
        exact
        titleLayout="Admin Dashboard"
        layout={SuperAdminLayout}
        path="/super-admin"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminCustomersView}
        exact
        titleLayout="Customers"
        layout={SuperAdminLayout}
        path="/super-admin/customers"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminSingleCustomerView}
        exact
        titleLayout="View Customer"
        layout={SuperAdminLayout}
        path="/super-admin/customers/single"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminRoutersListCustomerView}
        exact
        titleLayout="Available Routers"
        layout={SuperAdminLayout}
        path="/super-admin/routers"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminRoutersUploadView}
        exact
        titleLayout="Routers Upload"
        layout={SuperAdminLayout}
        path="/super-admin/routers/upload"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminSingleRouterUploadView}
        exact
        titleLayout="Routers Upload"
        layout={SuperAdminLayout}
        path="/super-admin/upload-single-router"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminReadyEstatesView}
        exact
        titleLayout="4G Ready Estates"
        layout={SuperAdminLayout}
        path="/super-admin/ready-estates"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminUploadMultpleEstatesView}
        exact
        titleLayout="4G Ready Estates"
        layout={SuperAdminLayout}
        path="/super-admin/ready-estates/upload-multiple"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminUploadSingleEstatesView}
        exact
        titleLayout="4G Ready Estates"
        layout={SuperAdminLayout}
        path="/super-admin/ready-estates/upload-single"
      />

      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminEditSingleEstatesView}
        exact
        titleLayout="4G Ready Estates"
        layout={SuperAdminLayout}
        path="/super-admin/ready-estates/:id"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminAgencyListView}
        exact
        titleLayout="Manage Dealers"
        layout={SuperAdminLayout}
        path="/super-admin/manage-dealers"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminAddAgencyView}
        exact
        titleLayout="Add Dealers/Shops"
        layout={SuperAdminLayout}
        path="/super-admin/manage-dealers/add-terminal"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminUserListView}
        exact
        titleLayout="Manage Users"
        layout={SuperAdminLayout}
        path="/super-admin/manage-users"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminAddUserView}
        exact
        titleLayout="Add Users"
        layout={SuperAdminLayout}
        path="/super-admin/users/add-user"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminEditUserView}
        exact
        layout={SuperAdminLayout}
        path="/super-admin/user/:id"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminAddUserView}
        exact
        layout={SuperAdminLayout}
        path="/super-admin/manage-dealers/:id"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminAccountView}
        exact
        layout={SuperAdminLayout}
        path="/super-admin/account"
      />
      <ProtectedSuperAdminRouteWithLayout
        component={SuperAdminProfileView}
        exact
        layout={SuperAdminLayout}
        path="/super-admin/profile"
      />

      {/* Start of Unauthenticated views */}
      <UnauthenticatedRouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <UnauthenticatedRouteWithLayout
        component={VerifyOTPView}
        exact
        layout={MinimalLayout}
        path="/verify-otp"
      />

      <UnauthenticatedRouteWithLayout
        component={ChangePassword}
        exact
        layout={MinimalLayout}
        path="/change-password"
      />
      <UnauthenticatedRouteWithLayout
        component={ForgotPasswordView}
        exact
        layout={MinimalLayout}
        path="/forgot-password"
      />
      <UnauthenticatedRouteWithLayout
        component={PasswordResetView}
        exact
        layout={MinimalLayout}
        path="/password-reset"
      />
      <RouteWithLayout component={NotFoundView} layout={MinimalLayout} />
    </Switch>
  );
};

export default Routes;
