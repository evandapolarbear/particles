import React from 'react';
import { render } from 'react-dom';

import QaTag from './src';

const TagElement = () => {
  return (
    <QaTag tag="app_header">
      <h1>Tag Demo</h1>
    </QaTag>
  );
};

render(<TagElement/>,  document.getElementById('root'));
