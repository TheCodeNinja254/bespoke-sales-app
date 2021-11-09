import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import RoomIcon from '@material-ui/icons/Room';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import PeopleIcon from '@material-ui/icons/People';
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// import RouterIcon from '@material-ui/icons/Router';
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
      href: '/sales/customers',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Register Customer',
      href: '/sales/customers/register-customer',
      icon: <PeopleIcon />
    },
    // {
    //   title: 'Upload Router',
    //   href: '/sales/upload-single-router',
    //   icon: <RouterIcon />
    // },
    {
      title: '4G Ready Estates',
      href: '/sales/ready-estates',
      icon: <RoomIcon />
    }
    // {
    //   title: 'My Profile',
    //   href: '/sales/profile',
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
