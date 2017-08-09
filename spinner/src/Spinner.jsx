import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import baseStyles from './Spinner.scss';
import composeStyles from '../../shared/stylesheetComposer';

let styles = {};

const Spinner = (props) => {
  const {
    children,
    className,
    Component,
    isLoading,
    stylesheets,
    titleText
  } = props;

  styles = composeStyles(baseStyles, [...stylesheets]);

  const classes = cx(
    className,
    styles.asyncLoad,
    { [styles.loading]: isLoading },
  );

  return (
    <Component className={classes} data-text={titleText}>
      <div className={styles.asyncLoadFadeContainer}>
        {children}
      </div>
    </Component>
  );
};

Spinner.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  isLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  titleText: PropTypes.string
};

Spinner.defaultProps = {
  children: null,
  className: null,
  Component: 'div',
  isLoading: false,
  stylesheets: [],
  titleText: 'Loading'
};

export default Spinner;
