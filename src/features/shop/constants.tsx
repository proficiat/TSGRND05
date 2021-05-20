import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { DateTime } from "luxon";

export interface Data {
  'order_number': number;
  status: string;
  'customer.address.city': string;
  'order_details.value': number;
}

export interface ShopOrder {
  customer: {
    address: {
      city: string;
      line1: string;
      line2: string;
      state: string;
      zip: string;
    };
    first_name: string;
    last_name: string;
  };
  order_details: {
    date: string;
    value: number;
  };
  order_number: number;
  shipping_details: {
    date: string;
  };
  status: string;
}

export type ShopTabs = 'All' | 'Shipped'
export type Order = 'asc' | 'desc';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = get(a, orderBy)
  const bValue = get(b, orderBy)
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: any,
): (a: { [key in Key]: any }, b: { [key in Key]: any}) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const getCustomerAddress = (shopOrder: ShopOrder) => {
  const address = get(shopOrder, 'customer.address')
  if (isEmpty(address)) {
    return ''
  }
  const { city, line1, line2, state, zip } = address
  return `${line1} ${line2} \n
    ${city}, ${state} ${zip}`.split('\n').map(i => <div className="address" key={i}>{i}</div>)
}

export const formatDate = (date: string, format: string):string => {
  const jsDate = new Date(date)
  return DateTime.fromJSDate(jsDate).toFormat(format)
}
