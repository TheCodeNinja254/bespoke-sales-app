/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Breadcrumbs from '../Components/Breadcrumbs';
import { AddDealerForm } from './forms';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const AddUser = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>Add User</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Link
            color="inherit"
            component={RouterLink}
            to="/super-admin/manage-dealers">
            Dealers/Shops
          </Link>
          <Typography color="textPrimary">Add</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <Card>
            <CardHeader
              subheader="Provide correct information in the below form to register an agency"
              title="Add Agency/Shop"
            />
            <Divider />
            <CardContent>
              <AddDealerForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddUser;
