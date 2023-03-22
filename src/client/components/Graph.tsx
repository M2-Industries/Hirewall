import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import type {
  ActionType,
  ApplicationRecord,
  ActionRecord,
  FilterType,
} from '../slice';
type propType = {
  allowList: Set<number>;
  appRecords?: { [key: number]: ApplicationRecord };
  actionRecords?: {
    [key: number]: ActionRecord[];
  };
  filter: FilterType;
};

type dataEntry = [
  x: ActionType | 'From',
  y: ActionType | 'To',
  z: number | 'Qty'
];

const defaultData: dataEntry[] = [
  ['From', 'To', 'Qty'],
  // ['Created', 'Applied', 0],
  // ['Applied', 'Sent Follow Up', 0],
  // ['Applied', 'Rejected', 0],
  // ['Applied', 'Interview', 0],
  // ['Sent Follow Up', 'No Response', 0],
  // ['Sent Follow Up', 'Rejected', 0],
  // ['Sent Follow Up', 'Interview', 0],
  // ['Interview', 'Offer', 0],
  // ['Interview', 'No Offer', 0],
  // ['Interview', 'Withdrawn', 0],
  // ['Offer', 'Accepted', 0],
  // ['Offer', 'Declined', 0],
];

export const options = {};

export default function Graph(props: propType) {
  const [data, setData] = useState(defaultData);
  const { appRecords, actionRecords, filter, allowList } = props;
  useEffect(() => {
    const map = new Map<string, number>();
    for (const key in actionRecords) {
      const action = actionRecords[Number(key)];
      // ignore those that are not on allowList.
      if (allowList.size > 0 && !allowList.has(Number(key))) continue;
      // find all action transitions
      if (action === undefined || action.length === 1) continue;
      const status = getStatus(action.at(-1)?.action_type);
      if (filter !== status && filter !== 'All') continue;
      let prevAct = action[0].action_type;
      for (let i = 1; i < action.length; i++) {
        // store action transition instances in map
        const key = JSON.stringify([prevAct, action[i].action_type]);
        if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        else map.set(key, 1);
        prevAct = action[i].action_type;
      }
    }
    // populate the data with the action transition instances
    const newData: dataEntry[] = [];
    for (const [key, value] of map) {
      const arr = JSON.parse(key);
      newData.push([arr[0], arr[1], value]);
    }
    setData(defaultData.concat(newData));
  }, [filter, allowList]);

  return (
    <Chart
      chartType='Sankey'
      width='100%'
      height='500px'
      data={data}
      options={options}
    />
  );
}

function getStatus(action?: ActionType): 'Inactive' | 'Unknown' | 'Active' {
  switch (action) {
    case 'Accepted':
    case 'Rejected':
    case 'Declined':
    case 'No Offer':
    case 'Withdrawn':
      return 'Inactive';
    case undefined:
      return 'Unknown'; //initial state
    default:
      return 'Active';
  }
}
