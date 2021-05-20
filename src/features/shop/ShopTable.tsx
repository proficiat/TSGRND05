import React, { useState, useEffect } from 'react';

import get from 'lodash/get';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';

import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

import MoreVertIcon from '@material-ui/icons/MoreVert';


import { Order, stableSort, getComparator, getCustomerAddress, formatDate } from './constants';
import ShopTableHead from './ShopTableHead';
import ShopTableToolbar from './ShopTableToolbar';

import './shopTable.scss';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  loadShopOrders,
  toggleShopOrders,
  selectSelectedShopOrdersByActiveTab,
  selectShopOrdersByActiveTab
} from './shopSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '60px 100px',
      minWidth: 750,
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    pagination: {
      background: '#f4f2ff',
      color: '#6f6993',
    },
  }),
);

export default function ShopTable() {
  const classes = useStyles();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('order_number');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useAppDispatch();
  const shopOrders = useAppSelector(selectShopOrdersByActiveTab)
  const selectedShopOrders = useAppSelector(selectSelectedShopOrdersByActiveTab)

  useEffect(() => {
    dispatch(loadShopOrders())
  }, [dispatch])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClickMoreIcon = (event: React.MouseEvent<unknown>) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  };

  const toggleAllRows = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleShopOrders(-1))
  };
 
  const toggleRow = (event: React.MouseEvent<unknown>, orderNumber: number) => {
    dispatch(toggleShopOrders(orderNumber))
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (orderNumber: number) => selectedShopOrders.indexOf(orderNumber) !== -1;
  const numSelected = selectedShopOrders.length
  const rowCount = shopOrders.length

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, shopOrders.length - page * rowsPerPage);
  return (
    <div className={classes.root}>
      <ShopTableToolbar />
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <ShopTableHead
              numSelected={numSelected}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={toggleAllRows}
              onRequestSort={handleRequestSort}
              rowCount={rowCount}
            />
            <TableBody>
              {stableSort(shopOrders, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.order_number);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      key={row.order_number.toString()}
                      hover
                      onClick={(event) => toggleRow(event, row.order_number)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <div className="order-number"># {row.order_number}</div>
                        <div className="order-date">
                          Ordered: {formatDate(row.order_details.date, 'LLL. d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className='order-status'>{row.status}</div>
                        <div className='status-date'>
                          Updated: {formatDate(row.shipping_details.date, 'dd/LLL/yyyy').toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell align="left">{getCustomerAddress(row)}</TableCell>
                      <TableCell align="right">
                        <div className="order-number">${get(row, 'order_details.value', 0)}</div>
                        <div className="currency">USD</div>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(event) => handleClickMoreIcon(event)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
