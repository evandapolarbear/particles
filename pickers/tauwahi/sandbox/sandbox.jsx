/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from 'react-dom';

import sandboxStyles from './sandbox.scss';
import Tauwahi from '../src';
import data from './data';

const canAdd = true;
const currentSelection = {};
const limit = 9;
const onCreate = (item) => { console.log('Creating:', item); }; // eslint-disable-line
const onSelect = (item) => { console.log('Selected:', item); }; // eslint-disable-line
const stylesheets = [sandboxStyles];

render(
  <Tauwahi
    {...{
      canAdd,
      currentSelection,
      data,
      limit,
      onCreate,
      onSelect,
      stylesheets
    }}
  />,
  window.document.getElementById('root')
);
