import { render } from 'react-dom';
import React from 'react';

import Spinner from '../src';

const isLoading = true;

render(
  <Spinner isLoading={isLoading}>
    <div style={{ height: '300px', background: 'bisque' }}>
      I am content that is still loading.
    </div>
  </Spinner>,
  window.document.getElementById('root')
);
