import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Breadcrumbs from '../Components/Breadcrumbs';
import { UploadSingleRouterForm } from '../../components/RouterManagement';

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

const UploadSingleEstate = () => {
  const [loader, setLoader] = React.useState(false);

  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title> Upload Router </title>
      </Helmet>
      <Backdrop open={loader} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.root}>
        <Breadcrumbs>
          <Typography color="textPrimary">Upload Router</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <Card>
            <CardContent>
              <UploadSingleRouterForm setLoader={setLoader} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UploadSingleEstate;
