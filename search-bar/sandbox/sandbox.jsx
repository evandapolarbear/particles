import { render } from 'react-dom'; // eslint-disable-line
import React from 'react';

import sandboxStyles from './sandbox.scss';

import SearchBar from '../src';

const onSubmit = (value) => {
  console.warn('Submitted:', value); // eslint-disable-line
};

const stylesheets = [sandboxStyles];
const placeholder = 'Search';
const value = 'Hello world';

render(
  <SearchBar {...{ onSubmit, stylesheets, placeholder, value }} />,
  window.document.getElementById('root'),
);
