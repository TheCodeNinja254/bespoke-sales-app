import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import RoomIcon from '@material-ui/icons/Room';
import RouterIcon from '@material-ui/icons/Router';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import PeopleIcon from '@material-ui/icons/People';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Profile } from './components';
import { SidebarNav } from '../../../Components';
import GetSignedInUserQuery from '../../../../queries/Account/GetSignedInUser';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = (props) => {
  const { open, variant, onOpen, onClose, className, ...rest } = props;

  const classes = useStyles();

  const withUserMgmtPages = [
    {
      title: 'Sales',
      href: '/management/customers',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Register Customer',
      href: '/management/customers/register-customer',
      icon: <PeopleIcon />
    },
    {
      title: '4G Ready Estates',
      href: '/management/ready-estates',
      icon: <RoomIcon />
    },
    {
      title: 'Routers',
      href: '/management/upload-routers',
      icon: <RouterIcon />,
      items: [
        // {
        //   title: 'Upload Routers',
        //   href: '/management/upload-routers'
        // },
        {
          title: 'Upload Router',
          href: '/management/upload-single-router'
        }
      ]
    },
    {
      title: 'User Management',
      href: '/management/users',
      icon: <PeopleIcon />,
      items: [
        {
          title: 'Manage Sales Agents',
          href: '/management/users'
        },
        {
          title: 'Add Sales Agent',
          href: '/management/users/add-user'
        }
      ]
    }
    // {
    //   title: 'My Profile',
    //   href: '/management/profile',
    //   icon: <AccountCircleIcon />
    // }
  ];

  const withoutUserMgmtPages = [
    {
      title: 'Sales',
      href: '/management/customers',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Register Customer',
      href: '/management/customers/register-customer',
      icon: <PeopleIcon />
    },
    {
      title: '4G Ready Estates',
      href: '/management/ready-estates',
      icon: <RoomIcon />
    },
    {
      title: 'Routers',
      href: '/management/upload-routers',
      icon: <RouterIcon />,
      items: [
        // {
        //   title: 'Upload Routers',
        //   href: '/management/upload-routers'
        // },
        {
          title: 'Upload Single Router',
          href: '/management/upload-single-router'
        }
      ]
    }
    // {
    //   title: 'My Profile',
    //   href: '/management/profile',
    //   icon: <AccountCircleIcon />
    // }
  ];

  return (
    <SwipeableDrawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      variant={variant}>
      <div {...rest} className={clsx(classes.root, className)}>
        <Profile />
        <Divider className={classes.divider} />
        <GetSignedInUserQuery>
          {({
            getSignedInUser: {
              user: { userCategory }
            }
          }) => (
            <>
              {userCategory === 'dealer_agent_admin' ? (
                <SidebarNav
                  className={classes.nav}
                  onClose={onClose}
                  pages={withoutUserMgmtPages}
                />
              ) : (
                <SidebarNav
                  className={classes.nav}
                  onClose={onClose}
                  pages={withUserMgmtPages}
                />
              )}
            </>
          )}
        </GetSignedInUserQuery>
      </div>
    </SwipeableDrawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
