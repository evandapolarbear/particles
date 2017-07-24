import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line

import sandboxStyles from './sandbox.scss';

import Maramataka from '../src';

const onSelect = (value) => {
  console.info('Selected:', value); // eslint-disable-line
};

// const value = {
//   day: '28',
//   month: '2',
//   year: '2017'
// };

const d = new Date();

const value = {
  day: d.getDate(),
  month: d.getMonth() + 1,
  year: d.getFullYear()
};

const stylesheets = [sandboxStyles];

const onClear = () => console.log('Cleared selected date!'); // eslint-disable-line

const closeOnSelect = false;

render(
  <div>
    <Maramataka
      {...{
        closeOnSelect,
        onClear,
        onSelect,
        stylesheets,
        value,
        showDateRange: true,
        dateInputFormat: 'full'
      }}
    />
  </div>,
  window.document.getElementById('root')
);
