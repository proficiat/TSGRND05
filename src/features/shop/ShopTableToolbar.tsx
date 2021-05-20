import React from 'react';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { ShopTabs } from './constants';
import {
  selectActiveTab,
  changeActiveTab,
  selectTotalOrders,
} from './shopSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
      borderBottom: '1px solid black',
      marginBottom: '20px',
      minHeight: 'unset',
    },
    title: {
      flex: '1 1 100%',
      textTransform: 'uppercase',
      color: '#25213c !important',
    },
    selected: {
      marginLeft: 'auto',
    },
    tabs: {
      marginTop: 'auto',
    },
    tab: {
      textTransform: 'none',
      minWidth: 52,
    },
    total: {
      marginLeft: 'auto',
      color: '#25213c !important',
    },
    price: {
      color: '#6d5bd0',
      fontSize: 16,
    }
  }),
);

const ShopTableToolbar = () => {
  const classes = useToolbarStyles();

  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(selectActiveTab)
  const totalOrders = useAppSelector(selectTotalOrders)

  const handleChangeActiveTab = (event: React.ChangeEvent<{}>, newValue: ShopTabs) => {
    dispatch(changeActiveTab(newValue))
  };

  return (
    <div>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Orders
      </Typography>
      <Toolbar className={classes.root}>
        <Tabs
          className={classes.tabs}
          value={activeTab}
          onChange={handleChangeActiveTab}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab className={classes.tab} value="All" disableRipple label="All" />
          <Tab className={classes.tab} value="Shipped" disableRipple  label="Shipped" />
        </Tabs>
        <Typography className={classes.total} variant="subtitle1" id="totalOrder" component="div">
            Total orders: <b className={classes.price}>${totalOrders}</b> USD
        </Typography>
      </Toolbar>
    </div>
  );
};

export default ShopTableToolbar
