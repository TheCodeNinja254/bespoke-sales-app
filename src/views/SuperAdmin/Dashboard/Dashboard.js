/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Grid from '@material-ui/core/Grid';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import ResourcesIcon from '@material-ui/icons/AccountBalance';
import StoresIcon from '@material-ui/icons/Storefront';
import ProductsIcon from '@material-ui/icons/LocalGroceryStore';
import { CardSummary } from '../../../components';
import { GetDashboardDataQuery } from '../../../queries/Dashboard/DashboardDataQuery';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4)
  },
  icon: {
    height: 32,
    width: 32
  },
  iconProducts: {
    color: theme.palette.success.dark
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <GetDashboardDataQuery variables={{ storeId: 0 }}>
          {({ getDashboardData }) => (
            <>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <CardSummary
                  cardTopic="Total Users"
                  cardIcon={<PeopleIcon className={classes.icon} />}
                  iconBgColor={theme.palette.primary.main}
                  cardValue={getDashboardData.users || 0}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <CardSummary
                  cardTopic="Resources"
                  cardIcon={<ResourcesIcon className={classes.icon} />}
                  iconBgColor={theme.palette.secondary.main}
                  cardValue={getDashboardData.resources || 0}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <CardSummary
                  cardTopic="Stores"
                  cardIcon={<StoresIcon className={classes.icon} />}
                  iconBgColor={theme.palette.info.main}
                  cardValue={getDashboardData.stores || 0}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <CardSummary
                  cardTopic="Products"
                  cardIcon={
                    <ProductsIcon
                      className={clsx(classes.icon, classes.iconProducts)}
                    />
                  }
                  iconBgColor={theme.palette.white}
                  cardBgColor={theme.palette.success.dark}
                  cardColor={theme.palette.primary.contrastText}
                  cardValue={getDashboardData.products || 0}
                />
              </Grid>
            </>
          )}
        </GetDashboardDataQuery>
        <Grid item lg={12} md={12} xl={12} xs={12} />
      </Grid>
    </div>
  );
};

export default Dashboard;
