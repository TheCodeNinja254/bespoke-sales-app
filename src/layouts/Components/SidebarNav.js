import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import NavBarItem from './NavBarItem';

const useStyles = makeStyles(() => ({
  root: {}
}));

const SidebarNav = (props) => {
  const { pages, className, onClose } = props;
  const classes = useStyles();

  return (
    <div role="presentation">
      <List className={clsx(classes.root, className)}>
        {pages.map((page) => (
          <NavBarItem
            onClose={onClose}
            key={page.title}
            subNav={page.items ? page.items : false}
            page={page}
          />
        ))}
      </List>
    </div>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
