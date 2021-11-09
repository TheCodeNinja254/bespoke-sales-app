import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '../Components/Breadcrumbs';
import { AddUserForm } from './forms';
import GetSignedInUserQuery from '../../../queries/Account/GetSignedInUser';

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
            to="/super-admin/manage-users">
            Users
          </Link>
          <Typography color="textPrimary">Add User</Typography>
        </Breadcrumbs>
        <div className={classes.content}>
          <Card>
            <CardHeader
              subheader="Provide correct information in the below form to register an agent"
              title="Add User"
            />
            <Divider />
            <CardContent>
              <GetSignedInUserQuery>
                {({
                  getSignedInUser: {
                    user: { agencyId }
                  }
                }) => <AddUserForm agencyId={agencyId} />}
              </GetSignedInUserQuery>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AddUser;
