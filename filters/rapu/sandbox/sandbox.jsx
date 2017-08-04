import { render } from 'react-dom'; // eslint-disable-line
import React from 'react';

import sandboxStyles from './sandbox.scss';

import Rapu from '../src';

const onSubmit = (value) => {
  console.warn('Submitted:', value); // eslint-disable-line
};

const stylesheets = [sandboxStyles];
const placeholder = 'Search';

render(
  <Rapu {...{ onSubmit, stylesheets, placeholder }} />,
  window.document.getElementById('root'),
);
