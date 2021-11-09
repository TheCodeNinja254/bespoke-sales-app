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
import { Link as RouterLink, Redirect, withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Breadcrumbs from '../Components/Breadcrumbs';
import EditEstateForm from './forms/EditEstateForm';
import GetSingleEstateQuery from '../../../queries/Locations/GetSingleEstate';

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

const EditSingleEstate = ({ match, history }) => {
  const [loader, setLoader] = React.useState(false);
  const classes = useStyles();

  const {
    params: { id }
  } = match;
  if (!Number(id)) {
    history.push('/not-found');
    return null;
  }

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
          <Typography color="textPrimary">Edit Estates</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <Card>
            <CardContent>
              <GetSingleEstateQuery variables={{ estateId: Number(id) }}>
                {({ getSingleEstates }) => (
                  <>
                    {getSingleEstates.getEstatesStatus ? (
                      <EditEstateForm
                        setLoader={setLoader}
                        estateData={getSingleEstates.estates}
                      />
                    ) : (
                      <Redirect
                        to={{
                          pathname: '/not-found'
                        }}
                      />
                    )}
                  </>
                )}
              </GetSingleEstateQuery>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default withRouter(EditSingleEstate);
