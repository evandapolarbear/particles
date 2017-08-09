import React from 'react';
import { render } from 'react-dom';
import NotificationBar, { TYPES } from '../src';

const onCancel = (id) => {
  console.warn(`Notification '${id}' has been cancelled.`); // eslint-disable-line
};

render(
  <div>
    <NotificationBar
      id={1}
      onCancel={onCancel}
      type={TYPES.SUCCESS}
      title='Success'
      body='This is a success notification.'
    />
    <NotificationBar
      id={2}
      onCancel={onCancel}
      type={TYPES.INFO}
      title='Info'
      body='This is a error notification.'
    />
    <NotificationBar
      id={'three'}
      onCancel={onCancel}
      type={TYPES.ERROR}
      title='Error'
      body='This is a error notification.'
    />
    <NotificationBar
      id={'four'}
      onCancel={onCancel}
      title='Default'
      body='This is a default notification.'
    />
    <NotificationBar
      id={'five'}
      noDismiss
      type={TYPES.ERROR}
      title='Non-dismissable'
      body="This is a notification that can't be dismissed."
    />
  </div>,
  window.document.getElementById('root')
);
