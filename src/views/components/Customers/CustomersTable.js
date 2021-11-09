import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles, TableContainer, Tooltip } from '@material-ui/core';
import useTheme from '@material-ui/core/styles/useTheme';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { Alert, StatusBadge } from '../../../components';
import { getInitials } from '../../../utils';
import DeleteRecordForm from './DeleteRecordForm';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2),
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main
  },
  actions: {
    justifyContent: 'flex-end'
  },
  statusBadge: {
    color: theme.palette.white.main
  },
  deleteButton: {
    color: theme.palette.error.main
  },
  viewButton: {
    marginRight: theme.spacing(1)
  }
}));

const CustomersTable = (props) => {
  const {
    handlePageChange,
    handleRowsPerPageChange,
    rowsPerPage,
    page,
    totalSales,
    className,
    sales,
    redirectBasePath,
    searchParam,
    searchValue,
    ...rest
  } = props;

  const history = useHistory();

  const styles = useStyles();
  const theme = useTheme();

  const [deleteModal, setDeleteModal] = React.useState({
    open: false,
    customerDetails: {
      registrationId: 0
    }
  });
  const { open, customerDetails } = deleteModal;

  const pushHistory = ({ path, state }) => {
    localStorage.clear();
    localStorage.setItem(
      'searchParameters',
      JSON.stringify({
        customer: {
          isset: true,
          searchParam,
          searchValue
        }
      })
    );
    history.push({
      pathname: path,
      state
    });
  };

  return (
    <Card {...rest} className={clsx(styles.root, className)}>
      <CardContent className={styles.content}>
        <DeleteRecordForm
          confirmModalOpen={open}
          customerDetails={customerDetails}
          setDeleteModal={setDeleteModal}
        />
        <TableContainer>
          <div className={styles.inner}>
            {sales.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Customer Mobile No.</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Estate Name</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Router Serial</TableCell>
                    <TableCell>Sale Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow hover key={sale.registrationId}>
                      <TableCell>
                        <div className={styles.nameContainer}>
                          <Avatar className={styles.avatar}>
                            {getInitials(sale.fullName)}
                          </Avatar>
                          <Typography variant="body1">
                            {sale.fullName}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>{sale.sponsorMsisdn}</TableCell>
                      <TableCell>{sale.productName}</TableCell>
                      <TableCell>{sale.estateName}</TableCell>
                      <TableCell>
                        <StatusBadge
                          bgColor={
                            sale.paymentStatus === 1
                              ? theme.palette.success.main
                              : theme.palette.warning.main
                          }>
                          {sale.paymentStatus === 1
                            ? 'Paid'
                            : 'Pending Payment'}
                        </StatusBadge>
                      </TableCell>

                      <TableCell>{sale.routerSerialNumber}</TableCell>
                      <TableCell>
                        {moment(sale.saleDate).format('DD/MM/YYYY h:mm:ss a')}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Customer">
                          <Button
                            variant="outlined"
                            className={styles.viewButton}
                            color="primary"
                            onClick={() =>
                              pushHistory({
                                path: `/${redirectBasePath}/customers/single/`,
                                state: {
                                  sale: {
                                    routerSerialNumber: sale.routerSerialNumber,
                                    estateName: sale.estateName,
                                    houseNumber: sale.houseNumber,
                                    sponsorMsisdn: sale.sponsorMsisdn,
                                    productName: sale.productName,
                                    paymmentDate: sale.paymmentDate,
                                    activationDate: sale.activationDate,
                                    beneficiaryMsisdn: sale.beneficiaryMsisdn,
                                    createdBy: sale.createdBy,
                                    isset: true,
                                    fullName: sale.fullName,
                                    paymentStatus: sale.paymentStatus,
                                    saleDate: sale.saleDate,
                                    registrationId: sale.registrationId
                                  }
                                }
                              })
                            }>
                            <VisibilityIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete Customer">
                          <Button
                            variant="outlined"
                            className={styles.deleteButton}
                            disabled={sale.beneficiaryMsisdn !== null}
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                customerDetails: {
                                  registrationId: sale.registrationId || 0
                                }
                              })
                            }>
                            <DeleteIcon />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="warning">Sorry, this list is empty.</Alert>
            )}
          </div>
        </TableContainer>
      </CardContent>
      <CardActions className={styles.actions}>
        <TablePagination
          component="div"
          count={totalSales}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[
            5,
            10,
            20,
            25,
            50,
            totalSales > 100 ? totalSales : 100
          ]}
        />
      </CardActions>
    </Card>
  );
};

CustomersTable.propTypes = {
  className: PropTypes.string,
  sales: PropTypes.array.isRequired,
  searchParam: PropTypes.string,
  searchValue: PropTypes.string,
  redirectBasePath: PropTypes.string.isRequired,
  handlePageChange: PropTypes.func,
  handleRowsPerPageChange: PropTypes.func
};

export default CustomersTable;
