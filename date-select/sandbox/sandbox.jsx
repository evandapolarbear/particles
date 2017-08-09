import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line

import sandboxStyles from './sandbox.scss';

import DateSelect from '../src';

const onSelect = (value) => {
  console.info('Selected:', value); // eslint-disable-line
};

const value = {
  day: '28',
  month: '2',
  year: '2017'
};

const stylesheets = [sandboxStyles];

const onClear = () => console.log('Cleared selected date!'); // eslint-disable-line

const closeOnSelect = false;

const rightAlign = false;

render(
  <div>
    <DateSelect
      {...{
        closeOnSelect,
        onClear,
        onSelect,
        rightAlign,
        stylesheets,
        value
      }}
    />
  </div>,
  window.document.getElementById('root')
);
