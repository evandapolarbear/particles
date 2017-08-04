import React from 'react';
import { render } from 'react-dom';
import Mataara, { TYPES } from '../src';

const onCancel = (id) => {
  console.warn(`Notification '${id}' has been cancelled.`); // eslint-disable-line
};

render(
  <div>
    <Mataara
      id={1}
      onCancel={onCancel}
      type={TYPES.SUCCESS}
      title='Success'
      body='This is a success notification.'
    />
    <Mataara
      id={2}
      onCancel={onCancel}
      type={TYPES.INFO}
      title='Info'
      body='This is a error notification.'
    />
    <Mataara
      id={'three'}
      onCancel={onCancel}
      type={TYPES.ERROR}
      title='Error'
      body='This is a error notification.'
    />
    <Mataara
      id={'four'}
      onCancel={onCancel}
      title='Default'
      body='This is a default notification.'
    />
    <Mataara
      id={'five'}
      noDismiss
      type={TYPES.ERROR}
      title='Non-dismissable'
      body="This is a notification that can't be dismissed."
    />
  </div>,
  window.document.getElementById('root')
);
