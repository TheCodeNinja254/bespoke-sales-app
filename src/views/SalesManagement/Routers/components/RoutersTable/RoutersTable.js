import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import makeStyles from '@material-ui/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, StatusBadge } from '../../../../../components';

import { getInitials } from '../../../../../utils';

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

const RoutersTable = (props) => {
  const {
    handlePageChange,
    handleRowsPerPageChange,
    rowsPerPage,
    page,
    totalProducts,
    className,
    products,
    ...rest
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectAll = (event) => {
    let productsSelected;

    if (event.target.checked) {
      productsSelected = products.map((product) => product.id);
    } else {
      productsSelected = [];
    }

    setSelectedProducts(productsSelected);
  };

  const getVisibilityBackgroundColor = (visibility) => {
    let bgColor = theme.palette.success.main;
    if (visibility === 'Draft') {
      bgColor = theme.palette.warning.main;
    }
    if (visibility === 'Private') {
      bgColor = theme.palette.info.main;
    }
    return bgColor;
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProducts.indexOf(id);
    let newSelectedProducts = [];

    if (selectedIndex === -1) {
      newSelectedProducts = newSelectedProducts.concat(selectedProducts, id);
    } else if (selectedIndex === 0) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(1)
      );
    } else if (selectedIndex === selectedProducts.length - 1) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedProducts = newSelectedProducts.concat(
        selectedProducts.slice(0, selectedIndex),
        selectedProducts.slice(selectedIndex + 1)
      );
    }

    setSelectedProducts(newSelectedProducts);
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            {products.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.length === products.length}
                        color="primary"
                        indeterminate={
                          selectedProducts.length > 0 &&
                          selectedProducts.length < products.length
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Product Slug</TableCell>
                    <TableCell>Stores Name</TableCell>
                    <TableCell>Visibility</TableCell>
                    <TableCell>Offer Code</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={product.id}
                      selected={selectedProducts.indexOf(product.id) !== -1}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.indexOf(product.id) !== -1}
                          color="primary"
                          onChange={(event) =>
                            handleSelectOne(event, product.id)
                          }
                          value="true"
                        />
                      </TableCell>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <Avatar className={classes.avatar}>
                            {getInitials(product.productName)}
                          </Avatar>
                          <Typography variant="body1">
                            {product.productName}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>{product.slug}</TableCell>
                      <TableCell>{product.storeName}</TableCell>
                      <TableCell>
                        <StatusBadge
                          bgColor={getVisibilityBackgroundColor(
                            product.visibility
                          )}>
                          {product.visibility}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{product.offerCode}</TableCell>
                      <TableCell>
                        {moment(product.updatedAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {moment(product.createdAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          component={RouterLink}
                          to={`/super-admin/product/${product.id}`}>
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
          count={totalProducts}
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

RoutersTable.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array.isRequired
};

export default RoutersTable;
