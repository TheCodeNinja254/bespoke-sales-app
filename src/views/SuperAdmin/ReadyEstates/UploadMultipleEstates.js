/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Breadcrumbs from '../Components/Breadcrumbs';
import UploadMultipleEstatesForm from './forms/UploadMultipleEstatesForm';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main
  }
}));

const UploadMultipleEstates = () => {
  const [loader, setLoader] = React.useState(false);

  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title> Upload Multiple Estates </title>
      </Helmet>
      <Backdrop open={loader} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.root}>
        <Breadcrumbs>
          <Link
            color="inherit"
            component={RouterLink}
            to="/super-admin/ready-estates">
            Ready Estates
          </Link>
          <Typography color="textPrimary">Upload Estates</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <Card>
            <CardContent>
              <UploadMultipleEstatesForm setLoader={setLoader} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadMultipleEstates;
