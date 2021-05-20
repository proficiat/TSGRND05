import { stableSort, getComparator } from './constants'

describe('test sort function', () => {
  const tesOrders= [
    {
      id: '1',
      name: 'Water',
      address: {
        city: 'Derby'
      },
      order: 100,
    },
    {
      id: '2',
      name: 'Oil',
      address: {
        city: 'London'
      },
      order: 25,
    },
    {
      id: '3',
      name: 'Fruits',
      address: {
        city: 'York'
      },
      order: 90,
    }
  ]
  const getIds = (data: any[]):string[] => data.map(item => item.id)

  it('should sort asc by name', () => {
    const actual = stableSort(tesOrders, getComparator('asc', 'name'));
    const actualIds = getIds(actual)
    expect(actualIds).toEqual(['3', '2', '1'])
  });

  it('should sort asc by address.city', () => {
    const actual = stableSort(tesOrders, getComparator('asc', 'address.city'));
    const actualIds = getIds(actual)
    expect(actualIds).toEqual(['1', '2', '3']);
  });

  it('should sort desc by order', () => {
    const actual = stableSort(tesOrders, getComparator('desc', 'order'));
    const actualIds = getIds(actual)
    expect(actualIds).toEqual(['1', '3', '2']);
  });
});
