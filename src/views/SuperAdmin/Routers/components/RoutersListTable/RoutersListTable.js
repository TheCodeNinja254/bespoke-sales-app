/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

import React from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/core';
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
import { Alert, StatusBadge } from '../../../../../components';

import { getInitials } from '../../../../../utils';
import { decrypt } from '../../../../../utils/encryptDecrypt';

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
  }
}));

function setCustomerTempStorage(
  sponsorMsisdn,
  registrationId,
  productName,
  paymentStatus,
  routerSerialNumber,
  routerDeliveryStatus,
  saleDate,
  estateName,
  houseNumber,
  fullName,
  paymmentDate,
  activationDate,
  beneficiaryMsisdn
) {
  localStorage.clear();
  localStorage.setItem(
    'customerDetails',
    JSON.stringify({
      customer: {
        isset: true,
        sponsorMsisdn,
        registrationId,
        productName,
        paymentStatus,
        routerSerialNumber,
        routerDeliveryStatus,
        saleDate,
        estateName,
        houseNumber,
        fullName,
        paymmentDate: paymmentDate || 'Pending',
        activationDate: activationDate || 'Pending',
        beneficiaryMsisdn
      }
    })
  );
}

const RoutersListTable = (props) => {
  const {
    handlePageChange,
    handleRowsPerPageChange,
    rowsPerPage,
    page,
    totalSales,
    className,
    sales,
    ...rest
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
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
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={sale.registrationId}>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar className={classes.avatar}>
                            {getInitials(sale.fullName)}
                          </Avatar>
                          <Typography variant="body1">
                            {sale.fullName}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>{decrypt(sale.sponsorMsisdn)}</TableCell>
                      <TableCell>{sale.productName}</TableCell>
                      <TableCell>{sale.estateName}</TableCell>
                      <TableCell>
                        <StatusBadge
                          bgColor={
                            sale.paymentStatus === 1
                              ? theme.palette.success.main
                              : theme.palette.warning.main
                          }>
                          {sale.paymentStatus === 0
                            ? 'Pending Payment'
                            : 'Paid'}
                        </StatusBadge>
                      </TableCell>

                      <TableCell>{sale.routerSerialNumber}</TableCell>
                      <TableCell>
                        {moment(sale.saleDate).format('DD/MM/YYYY h:mm:ss a')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          component={RouterLink}
                          onClick={() =>
                            setCustomerTempStorage(
                              sale.sponsorMsisdn,
                              sale.registrationId,
                              sale.productName,
                              sale.paymentStatus,
                              sale.routerSerialNumber,
                              sale.routerDeliveryStatus,
                              sale.saleDate,
                              sale.estateName,
                              sale.houseNumber,
                              sale.fullName,
                              sale.paymmentDate,
                              sale.activationDate,
                              sale.beneficiaryMsisdn
                            )
                          }
                          to={`/sales/customers/single/${sale.registrationId}`}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="warning">Sorry, this list is empty.</Alert>
            )}
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={totalSales}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 25]}
        />
      </CardActions>
    </Card>
  );
};

RoutersListTable.propTypes = {
  className: PropTypes.string,
  sales: PropTypes.array.isRequired
};

export default RoutersListTable;
