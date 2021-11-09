import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CustomersTable from '../../components';
import Breadcrumbs from '../Components/Breadcrumbs';
import GetMyCustomersQuery from '../../../queries/Customers/GetCustomersQuery';
import exportToExcel from '../../../utils/exportToExcel';
import CollapsibleAlerts from '../../../components/CollapsibleAlerts';
import { encrypt } from '../../../utils/encryptDecrypt';
import { Alert } from '../../../components';
import CustomersToolbar from '../../components/Customers/CustomersToobar';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  tableTools: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const CustomerList = () => {
  const classes = useStyles();

  const searchParameters = JSON.parse(localStorage.getItem('searchParameters'));

  const [searchParam, setSearchParam] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchIsCleared, setSearchIsClear] = useState(false);
  const [page, setPage] = useState(0);

  let searchParamFinal = searchParam;
  let searchValueFinal = searchValue;

  if (searchIsCleared) {
    searchParamFinal = searchParam;
    searchValueFinal = searchValue;
  } else if (searchParameters !== undefined && searchParameters !== null) {
    searchParamFinal = searchParameters.customer.searchParam;
    searchValueFinal = searchParameters.customer.searchValue;
  }

  const handlePageChange = (event, pageSelected) => {
    setPage(pageSelected);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };

  const generateReport = (sales) => {
    const fileNamePrefix = '4GHOME_SALES';
    exportToExcel(sales, fileNamePrefix);
  };

  return (
    <>
      <Helmet>
        <title>Customers</title>
      </Helmet>
      <div className={classes.root}>
        <Breadcrumbs>
          <Typography color="textPrimary">Customers</Typography>
        </Breadcrumbs>
        <CustomersToolbar
          searchParam={searchParamFinal}
          searchValue={searchValueFinal}
          setSearchParam={setSearchParam}
          setSearchValue={setSearchValue}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          searchParamFinal={searchParamFinal}
          searchValueFinal={searchValueFinal}
          setSearchIsClear={setSearchIsClear}
        />
        <Card className={classes.content}>
          <GetMyCustomersQuery
            variables={{
              pageSize: rowsPerPage,
              page: Number(page) + 1,
              searchParam: encrypt(searchParamFinal),
              searchValue: encrypt(searchValueFinal)
            }}>
            {({ getMySales }) =>
              getMySales !== null ? (
                <>
                  <Grid container className={classes.tableTools} spacing={2}>
                    <Grid item xs={12} lg={9} sm={12} md={9}>
                      <Typography variant="h5">My Customers</Typography>
                      <Typography variant="body2">My customers list</Typography>
                    </Grid>
                    <Grid item lg={3} xs={12} md={3}>
                      <Button
                        className={classes.generateReportButton}
                        color="primary"
                        onClick={() =>
                          generateReport(
                            getMySales.sales,
                            getMySales.getSalesCount
                          )
                        }
                        variant="contained">
                        Generate Report
                      </Button>
                    </Grid>
                  </Grid>
                  <CollapsibleAlerts alertMessage="Update of customer information is now available! Change the mobile number, router serial or Swap the SIM. Click the view button to make changes" />
                  <CustomersTable
                    handlePageChange={handlePageChange}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    searchParam={searchParam}
                    searchValue={searchValue}
                    totalSales={getMySales.getSalesCount}
                    redirectBasePath={process.env.REACT_APP_ADMIN_BASE_PATH}
                    sales={getMySales.sales}
                  />
                </>
              ) : (
                <Alert severity="warning">
                  Sorry, nothing matches your search criteria
                </Alert>
              )
            }
          </GetMyCustomersQuery>
        </Card>
      </div>
    </>
  );
};

export default CustomerList;
