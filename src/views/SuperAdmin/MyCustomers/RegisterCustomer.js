import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CardHeader from '@material-ui/core/CardHeader';
import { RegisterCustomerForm } from '../../components/CustomerRegistration';
import Breadcrumbs from '../Components/Breadcrumbs';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const RegisterCustomer = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>Register Customer</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Link
            color="inherit"
            component={RouterLink}
            to="/super-admin/customers">
            Customers
          </Link>
          <Typography color="textPrimary">Register Customer</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <Card>
            <CardHeader
              subheader="Provide correct information in the below form to register a customer"
              title="Register New Customer"
            />
            <Divider />
            <CardContent>
              <RegisterCustomerForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterCustomer;
