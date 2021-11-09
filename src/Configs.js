// System Wide Configurations
// eslint-disable-next-line import/prefer-default-export
export const configs = {
  fullRegistrationAllowedRoles:
    'shop_cee|dealer_sales_agent|shop_admin|dealer_agent_admin',
  fullRouterMgr: 'Admin|support_admin',
  defaultZone: 1,
  defaultRegion: '3', // string
  products: [
    {
      productId: 20191909,
      productName: '4G For Home 3Mbps @Ksh. 3,499'
    },
    {
      productId: 20191710,
      productName: '4G For Home 5Mbps @Ksh. 4,999'
    }
  ],
  routerPrice: '9999',
  documentTypes: [
    {
      documentType: '1',
      documentName: 'National ID'
    },
    {
      documentType: '2',
      documentName: 'Passport'
    },
    {
      documentType: '3',
      documentName: 'Alien ID'
    }
  ],
  shopAdminManageableUserRoles: [
    {
      roleId: '9',
      roleName: 'Shop CEE'
    },
    {
      roleId: '8',
      roleName: 'Shop Admin'
    }
  ],
  adminManageableUserRoles: [
    {
      roleId: '2',
      roleName: 'Admin'
    },
    {
      roleId: '9',
      roleName: 'Shop CEE'
    },
    {
      roleId: '8',
      roleName: 'Shop Admin'
    },
    {
      roleId: '7',
      roleName: 'Dealer Sales Agent'
    },
    {
      roleId: '15',
      roleName: 'Dealer Admin'
    }
  ]
};
