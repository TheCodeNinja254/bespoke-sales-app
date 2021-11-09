import React, { forwardRef } from 'react';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { matchPath, NavLink as RouterLink, withRouter } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    '& .expandIcon': {
      textAlign: 'right'
    }
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& span': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  title: {
    marginRight: 'auto'
  },
  listItemText: {
    fontWeight: theme.typography.fontWeightMedium
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <RouterLink {...props} />
  </div>
));

const NavBarItem = ({ page, subNav, location: { pathname } }) => {
  const classes = useStyles();
  let open = false;
  if (page.items) {
    open = matchPath(pathname, {
      path: page.href,
      exact: false
    });
  }
  const [openValue, setOpen] = React.useState(!!open);

  const handleClick = () => {
    setOpen(!openValue);
  };

  return (
    <>
      {subNav ? (
        <>
          <ListItem
            onClick={handleClick}
            className={classes.item}
            disableGutters>
            <Button className={classes.button}>
              <div className={classes.icon}>{page.icon}</div>
              <span className={classes.title}>{page.title}</span>
              {openValue ? (
                <ExpandLess className="expandIcon" />
              ) : (
                <ExpandMore className="expandIcon" />
              )}
            </Button>
          </ListItem>
          <Collapse in={openValue} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {page.items.map((item) => (
                <ListItem
                  className={clsx(classes.item, classes.nested)}
                  key={item.title}
                  disableGutters>
                  <Button
                    activeClassName={classes.active}
                    exact
                    className={classes.button}
                    component={CustomRouterLink}
                    to={item.href}>
                    {item.title}
                  </Button>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      ) : (
        <ListItem className={classes.item} disableGutters>
          <Button
            activeClassName={classes.active}
            exact
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}>
            <div className={classes.icon}>{page.icon}</div>
            {page.title}
          </Button>
        </ListItem>
      )}
    </>
  );
};

export default React.memo(withRouter(NavBarItem));
