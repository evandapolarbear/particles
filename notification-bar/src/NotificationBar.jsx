import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import baseStyles from './NotificationBar.scss';
import composeStyles from '../../shared/stylesheetComposer';

let styles = {};

const TYPES = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success'
};

const NotificationBar = ({ body, id, noDismiss, onCancel, stylesheets, title, type }) => {
  styles = composeStyles(baseStyles, [...stylesheets]);

  return (
    <div
      className={cx(
        styles.notification,
        {
          [styles.alertError]: type === TYPES.ERROR,
          [styles.alertInfo]: type === TYPES.INFO,
          [styles.alertSuccess]: type === TYPES.SUCCESS
        },
      )}
    >
      <span className={styles.title}>{title}</span>
      <span className={styles.body}>{body}</span>
      <div
        className={
          cx(styles.btnCancel, 'fa', 'fa-times', { [styles.hidden]: noDismiss })
        }
        onClick={() => { onCancel(id); }}
      />
    </div>
  );
};

NotificationBar.propTypes = {
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  noDismiss: PropTypes.bool,
  onCancel: PropTypes.func,
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};

NotificationBar.defaultProps = {
  noDismiss: false,
  onCancel: null,
  stylesheets: [],
  type: TYPES.INFO
};

export { TYPES };
export default NotificationBar;
