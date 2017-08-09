import React from 'react';
import { render } from 'react-dom';

import BulkEditor from '../src';
import sandboxStyles from './sandbox.scss';

const items = [
  { id: 1, text: 'Item to Edit' },
  { id: 2, text: 'Item to Edit as well' },
  { id: 3, text: 'Another Item to Edit' },
  { id: 4, text: 'Another Item to Edit That Has a Very Long Name' },
  { id: 5, text: 'Item to Edit' },
  { id: 6, text: 'Item to Edit as well' },
  { id: 7, text: 'Another Item to Edit' },
  { id: 8, text: 'Another Item to Edit That Has a Very Long Name' },
  { id: 9, text: 'Item to Edit' },
  { id: 10, text: 'Item to Edit as well' },
  { id: 11, text: 'Another Item to Edit' },
  { id: 12, text: 'Another Item to Edit That Has a Very Long Name' },
  { id: 13, text: 'Item to Edit' },
  { id: 14, text: 'Item to Edit as well' },
  { id: 15, text: 'Another Item to Edit' },
  { id: 16, text: 'Another Item to Edit That Has a Very Long Name' }
];

const emptyMessage = 'No items being passed in';
const itemFormatter = item => item.text;
const onCancel = () => console.log('Bulk edit cancelled'); // eslint-disable-line
const onRemove = item => console.log('Would have removed: ', item); // eslint-disable-line
const onSubmit = (items) => console.log('Bulk edit submitted on these items: ', items);; // eslint-disable-line
const valueField = 'id';

const stylesheets = [sandboxStyles];

render(
  <div className={sandboxStyles.container}>
    <BulkEditor
      {...{
        emptyMessage,
        itemFormatter,
        items,
        onCancel,
        onRemove,
        onSubmit,
        stylesheets,
        valueField
      }}
    />
  </div>,
  window.document.getElementById('root')
);
