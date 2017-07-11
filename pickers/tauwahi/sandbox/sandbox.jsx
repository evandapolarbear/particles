/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';

import sandboxStyles from './sandbox.scss';

import Tauwahi from '../src';

import data from './data';

const stylesheets = [sandboxStyles];

const onSelect = (item) => {
  console.warn('An item was selected', item);
};

const onClose = () => {
  console.warn('Closing.');
};

const onCreate = (names) => {
  console.warn('Creating:', names);
};

const canAdd = true;

render(
  <Tauwahi
    {...{
      canAdd,
      data,
      onClose,
      onCreate,
      onSelect,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
