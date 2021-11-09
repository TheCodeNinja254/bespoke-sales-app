import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

const CustomersBreadcrumbs = ({ children }) => {
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" component={RouterLink} to="/sales">
          Dashboard
        </Link>
        {children}
      </Breadcrumbs>
    </div>
  );
};

export default React.memo(CustomersBreadcrumbs);
