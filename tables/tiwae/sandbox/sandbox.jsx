/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom';
import React from 'react';

import ColumnOrganizer from '../src';
import columns from './data';
import sandboxStyles from './sandbox.scss';

const defaultColumns = columns;
const isSelectAll = true;
const lockLimit = 3;
const onChange = (newColumnDefinitions) => { console.warn(newColumnDefinitions); }; // eslint-disable-line
const slot = (<div className={sandboxStyles.slot}>Slot</div>);
const stylesheets = [sandboxStyles];

render(
  <ColumnOrganizer
    {...{
      columns,
      defaultColumns,
      isSelectAll,
      lockLimit,
      onChange,
      slot,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
