import React from 'react';
import Tipako from './Tipako.jsx';
import props from '../sandbox/data.js';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Tipako {...props} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
