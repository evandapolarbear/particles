/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-dom';
import React from 'react';

import Tipako from '../src';
import data from './data';
import sandboxStyles from './sandbox.scss';

const closeOnSelect = false;
const disabled = false;
const loading = false;
const searchable = true;
const updateOnSelect = true;

const onClearAll = () => { console.warn('Clear all.'); };
const onFocus = () => { console.warn('Focus.'); };
// const onSearch = (str) => { console.warn('Searching for', str); };
const onSelect = (item) => { console.warn('Selected', item); };
const onSelectAll = () => { console.warn('Select all.'); };

const renderEmpty = () => 'Empty!';
const renderGroup = group => group.value;
const renderItem = item => item.value;

const slotBottom = <div className={sandboxStyles.slotBottom}>Bottom Slot</div>;
const slotTitle = <div className={`fa fa-bus ${sandboxStyles.titleIcon}`} />;

const stylesheets = [sandboxStyles];

const titlePlaceholder = 'Make a selection...';
const titleValue = 'Calypso';

const keyField = 'key';
const valueField = 'value';
const valueFunction = item => item.value;

render(
  <Tipako
    {...{
      closeOnSelect,
      data,
      disabled,
      keyField,
      loading,
      onClearAll,
      onFocus,
      // onSearch,
      onSelect,
      onSelectAll,
      renderEmpty,
      renderGroup,
      renderItem,
      searchable,
      slotBottom,
      slotTitle,
      stylesheets,
      titlePlaceholder,
      titleValue,
      updateOnSelect,
      valueField,
      valueFunction
    }}
  />,
  window.document.getElementById('root')
);
