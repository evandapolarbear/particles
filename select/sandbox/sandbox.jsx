/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import { render } from 'react-dom';
import React from 'react';

import Select from '../src';
import sandboxStyles from './sandbox.scss';

const data = [
  { value: 'Animals',
    key: 100,
    disabled: true,
    children: [
      { value: 'Dolphin', key: 2, disabled: true },
      { value: 'Albatross', key: 3 },
      { value: 'German Shepherd', key: 4 },
      { value: 'Mole', key: 5 },
      { value: 'Lesser Southern Floridian Muskrat', key: 6 }
    ]
  },

  {
    children: [
      { value: 'Lutherie', key: 8 },
      { value: 'Carpentry', key: 9 },
      { value: 'Parquetry', key: 10 },
      { value: 'Joinery', key: 11 },
      { value: 'Cabinetry', key: 12 }
    ],
    key: 7,
    value: 'Woodworking'
  },

  {
    children: [
      { value: 'Tethys', key: 14 },
      { value: 'Calypso', key: 15 },
      { value: 'Enceladus', key: 16 },
      { value: 'Rhea', key: 17 },
      { value: 'Iapetus', key: 18 }
    ],
    key: 13,
    value: 'Saturnian Moons Found Around Saturn'
  },

  { value: 'An empty group appears!', key: 19, children: [] },

  { value: 'Magnetic poles are points to and from which the lines of magnetic force are directed.', key: 20, disabled: true },
  { value: 'Guacamole', key: 21 },
  { value: 'Crankshaft', key: 22 },
  { value: 'Demographic', key: 23 },
  { value: 'Almond', key: 24 }
];

const closeOnSelect = false;
const disabled = false;
const loading = false;
const searchable = true;
const updateOnSelect = true;

const onClearAll = () => { console.warn('Clear all.'); };
const onFocus = (evt) => { console.warn('Focus.', evt); };
const onSearch = (str) => { console.warn('Searching for', str); };
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
  <div className={sandboxStyles.wrapper}>
    <Select
      {...{
        closeOnSelect,
        data,
        disabled,
        keyField,
        loading,
        onClearAll,
        onFocus,
        onSearch,
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
    />
    <Select
      {...{
        closeOnSelect,
        data,
        disabled,
        keyField,
        loading,
        onClearAll,
        onFocus,
        onSelect,
        onSelectAll,
        renderEmpty,
        renderGroup,
        renderItem,
        slotBottom,
        slotTitle,
        stylesheets,
        titlePlaceholder,
        titleValue,
        updateOnSelect,
        valueField
      }}
    />
  </div>,
  window.document.getElementById('root')
);
