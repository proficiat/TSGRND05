import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import intersection from 'lodash/intersection'
import difference from 'lodash/difference'
import union from 'lodash/union'
import reduce from 'lodash/reduce'

import { RootState } from '../../app/store';
import { fetchShopOrders } from './contentApi';
import { ShopOrder, ShopTabs } from './constants';

type LoadingStatus =  'idle' | 'loading' | 'failed'

export interface ShopState {
  shopOrders: ShopOrder[];
  selectedShopsOrders: number[];
  activeTab: ShopTabs;
  loadingStatus: LoadingStatus;
}

const initialState: ShopState = {
  shopOrders: [],
  selectedShopsOrders: [],
  activeTab: 'All',
  loadingStatus: 'idle',
};


export const loadShopOrders = createAsyncThunk(
  'shop/fetchShopOrders',
  async () => {
    const response = await fetchShopOrders();
    return response;
  }
);

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    toggleShopOrders: (state, action: PayloadAction<number>) => {
      const orderNumber = action.payload;
      const selected = state.selectedShopsOrders
      let newSelected: number[] = [];

      // toggle all
      if (orderNumber === -1) {
        let shopOrdersByTab = state.shopOrders
        let selectedByTab = selected
        let orderNumbersByTab = shopOrdersByTab.map(item => item.order_number)

        if (state.activeTab === 'Shipped') {
          shopOrdersByTab = state.shopOrders.filter(item => item.status === 'shipped')
          orderNumbersByTab = shopOrdersByTab.map(item => item.order_number)
          selectedByTab = intersection(orderNumbersByTab, selected)
        }
        if (selectedByTab.length === shopOrdersByTab.length) {
          newSelected = difference(selected, selectedByTab)
        } else {
          newSelected = union(selected, orderNumbersByTab)
        }
      } else {
        const selectedIndex = state.selectedShopsOrders.indexOf(orderNumber);
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, orderNumber);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
      } 
      state.selectedShopsOrders = [...newSelected]
    },
    changeActiveTab: (state, action: PayloadAction<ShopTabs>) => {
      state.activeTab = action.payload
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loadShopOrders.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(loadShopOrders.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.shopOrders = [ ...action.payload ];
      })
      .addCase(loadShopOrders.rejected, (state, action) => {
        state.loadingStatus = 'failed';
      });
  },
});

export const { toggleShopOrders, changeActiveTab } = shopSlice.actions;

export const selectShopOrders = (state: RootState) => state.shop.shopOrders;
export const selectSelectedShopOrders = (state: RootState) => state.shop.selectedShopsOrders;
export const selectActiveTab = (state: RootState) => state.shop.activeTab;
export const selectShopOrdersByActiveTab = (state: RootState) => {
  const activeTab = selectActiveTab(state)
  const shopOrders = selectShopOrders(state)
  if (activeTab === 'Shipped') {
    return shopOrders.filter(item => item.status === 'shipped')
  }
  return shopOrders
}
export const selectSelectedShopOrdersByActiveTab = (state: RootState) => {
  const selectedShopsOrders = selectSelectedShopOrders(state)
  const shopOrdersByActiveTab = selectShopOrdersByActiveTab(state)
  const orderNumbersByActiveTab = shopOrdersByActiveTab.map(item => item.order_number)
  return intersection(orderNumbersByActiveTab, selectedShopsOrders)
}
export const selectTotalOrders = (state: RootState) => {
  const shopOrders = selectShopOrders(state)
  return reduce(shopOrders, (total, shopOrder) => {
    if (shopOrder.status === 'shipped') {
      return total + shopOrder.order_details.value
    }
    return total
  }, 0)
}

export default shopSlice.reducer;
