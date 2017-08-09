import React from 'react';
import { render } from 'react-dom';
import sandboxStyles from './sandbox.scss';

import Tabs from '../src';

const onChange = () => {
  console.warn('Tab changed; external callback triggered.');
};

const labels = [
  { k: 'foo', v: 'The Foo' },
  { k: 'bar', v: 'A Bar' },
  { k: 'baz', v: 'Some Baz' }
];

const slotL = <div className={sandboxStyles.left}>Left side slot</div>;
const slotR = <div className={sandboxStyles.right}>Right side slot</div>;

const selectedKey = labels[0].k;

const stylesheets = [sandboxStyles];

render(
  <Tabs
    {...{ onChange, labels, slotL, slotR, selectedKey, stylesheets }}
  />,
  window.document.getElementById('root')
);
