import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, TableContainer } from '@material-ui/core';
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
import { Alert } from '../../../../../components';
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

const DealersTable = (props) => {
  const {
    handlePageChange,
    handleRowsPerPageChange,
    rowsPerPage,
    page,
    getAgenciesStatus,
    className,
    agencies,
    ...rest
  } = props;

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <TableContainer>
          <div className={classes.inner}>
            {getAgenciesStatus ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Agency Name</TableCell>
                    <TableCell>Agency Type</TableCell>
                    <TableCell>Mobile No.</TableCell>
                    <TableCell>Dealer Code</TableCell>
                    <TableCell>Paybill No.</TableCell>
                    <TableCell>Bank Name</TableCell>
                    <TableCell>Bank Account</TableCell>
                    <TableCell>Created By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agencies.map((agency) => (
                    <TableRow
                      // className={classes.tableRow}
                      hover
                      key={agencies.agencyId}>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar className={classes.avatar}>
                            {getInitials(agency.agencyName)}
                          </Avatar>
                          <Typography variant="body1">
                            {agency.agencyName}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>{agency.agencyType}</TableCell>
                      <TableCell>
                        {agency.msisdn === null ? '' : decrypt(agency.msisdn)}
                      </TableCell>
                      <TableCell>
                        {agency.dealerCode === null
                          ? ''
                          : decrypt(agency.dealerCode)}
                      </TableCell>
                      <TableCell>
                        {agency.payBill === null ? '' : decrypt(agency.payBill)}
                      </TableCell>
                      <TableCell>
                        {agency.bankName === null
                          ? ''
                          : decrypt(agency.bankName)}
                      </TableCell>
                      <TableCell>
                        {agency.bankAccount === null
                          ? ''
                          : decrypt(agency.bankAccount)}
                      </TableCell>
                      <TableCell>
                        {agency.createdBy === null
                          ? ''
                          : decrypt(agency.createdBy)}
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
      <CardActions className={classes.actions} />
    </Card>
  );
};

DealersTable.propTypes = {
  className: PropTypes.string,
  agencies: PropTypes.array.isRequired
};

export default DealersTable;
