import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line
import Ripanga from '../src';
import sandboxStyles from './sandbox.scss';

import columnDefinitions from './data/columnDefinitions';
import tableData from './data/groupedData';
// import tableData from './data/ungroupedData';

const onMounted = state => console.log('Table was mounted.', state); // eslint-disable-line
const onSort = () => console.log('Column was sorted.'); // eslint-disable-line
const renderCell = (rowData, columnDef) => <div key={`cell-${rowData.key}-${columnDef.key}`}>{rowData.text}</div>;
const renderGroupTitle = groupData => <div>{groupData.key.label}</div>;
const renderSidebarBodyCell = () => <div>Sidebar body cell</div>;
const renderSidebarGroupCell = group => <div>Sidebar {group.key.label} cell</div>;
const renderSidebarHeadCell = () => <div>Sidebar head cell</div>;
const rowHeight = 48;

render(
  <div className={sandboxStyles.sandboxContainer}>
    <button
      className={sandboxStyles.btnUncheck}
      onClick={() => { window.dispatchEvent(new CustomEvent('table/uncheckAll')); }}
    >
      Uncheck All
    </button>

    <Ripanga
      globalKey='ripanga-sandbox'
      idKey='key'
      onMounted={onMounted}
      scope='sandbox'
      showCheckboxes
      {...{
        columnDefinitions,
        onSort,
        renderCell,
        renderGroupTitle,
        renderSidebarBodyCell,
        renderSidebarGroupCell,
        renderSidebarHeadCell,
        rowHeight,
        stylesheets: [sandboxStyles],
        tableData
      }}
    />
  </div>,
  document.getElementById('root'),
);
