import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Order, Data } from './constants'


interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'order_number', numeric: false, disablePadding: true, label: 'ORDER NUMBER & DATE' },
  { id: 'status', numeric: false, disablePadding: false, label: 'SHIPPING STATUS' },
  { id: 'customer.address.city', numeric: false, disablePadding: false, label: 'CUSTOMER ADDRESS' },
  { id: 'order_details.value', numeric: true, disablePadding: false, label: 'ORDER VALUE' },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    head: {
      background: '#f4f2ff',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    sortLabel: {
      color: '#6f6993',
    },
  }),
);

interface ShopTableHeadProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: any;
  rowCount: number;
}

export default function ShopTableHead(props: ShopTableHeadProps) {
  const classes = useStyles();
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.head}>
      <TableRow>
        <TableCell>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              className={classes.sortLabel}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}