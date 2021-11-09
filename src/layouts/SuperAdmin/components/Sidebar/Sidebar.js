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
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Profile } from './components';
import { SidebarNav } from '../../../Components';

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

  const pages = [
    {
      title: 'Sales',
      href: '/super-admin/customers',
      icon: <ShoppingBasketIcon />
    },
    {
      title: '4G Ready Estates',
      href: '/super-admin/ready-estates',
      icon: <RoomIcon />,
      items: [
        {
          title: 'Manage Estates',
          href: '/super-admin/ready-estates'
        },
        {
          title: 'Single Upload',
          href: '/super-admin/ready-estates/upload-single'
        },
        {
          title: 'Multiple Upload',
          href: '/super-admin/ready-estates/upload-multiple'
        }
      ]
    },
    {
      title: 'Routers',
      href: '/super-admin/upload-routers',
      icon: <RouterIcon />,
      items: [
        // {
        //   title: 'Upload Routers',
        //   href: '/super-admin/routers/upload'
        // },
        {
          title: 'Upload Router',
          href: '/super-admin/upload-single-router'
        }
      ]
    },
    {
      title: 'Manage Users',
      href: '/super-admin/users',
      icon: <PeopleIcon />,
      items: [
        {
          title: 'Manage Users',
          href: '/super-admin/manage-users'
        },
        {
          title: 'Add Users',
          href: '/super-admin/users/add-user'
        }
      ]
    },
    {
      title: 'Dealers/Shops',
      href: '/super-admin/users',
      icon: <AccountBalanceIcon />,
      items: [
        {
          title: 'Manage Dealers/Shop',
          href: '/super-admin/manage-dealers'
        },
        {
          title: 'Add Agency/Shop',
          href: '/super-admin/manage-dealers/add-terminal'
        }
      ]
    }
    // {
    //   title: 'My Profile',
    //   href: '/super-admin/profile',
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
        <SidebarNav className={classes.nav} onClose={onClose} pages={pages} />
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
