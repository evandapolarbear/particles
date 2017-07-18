import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export const Spacer = ({ className }) => (<div className={className}>/</div>);
export const ControlsButton = text => ({ onClick, className }) => (
  <button className={className} onClick={onClick} type='button'>
    {text}
  </button>
);

export const SelectAll = ControlsButton('Select All');
export const ClearAll = ControlsButton('Clear All');

export const Controls = ({
  onClearAll,
  onSelectAll,
  count,
  styles,
}) => {
  const selectAll = (onSelectAll && count)
    ? <SelectAll className={styles.controlsButton} onClick={onSelectAll} />
    : null;
  const clearAll = onClearAll
    ? <ClearAll className={styles.controlsButton} onClick={onClearAll} />
    : null;
  return (
    <div className={styles.controls}>
      {selectAll}
      {(clearAll && selectAll) && <Spacer className={styles.controlsSpacer} />}
      {clearAll}
    </div>
  );
};


export const Empty = ({ className, content }) => (
  <div className={className}>{content}</div>
);

export const Caret = ({ onClick, expanded, styles }) => (
  <button onClick={onClick} className={styles.caret} type='button'>
    <span className={cx('fa', 'fa-caret-down', styles.arrow, { [styles.expanded]: expanded })} />
  </button>
);

export const Clear = ({ onClick, className }) => (
  <button onClick={onClick} className={className} type='button' />
);

export const Spinner = ({ className }) => (<span className={className} />);

export const Slot = ({ text, className }) => text
  ? (<div className={className}>{text}</div>)
  : null;

export const Search = ({
  searchable,
  styles,
  onBlur,
  onChange,
  onClick,
  onFocus,
  placeholder,
  inputRef,
  titleValue,
  value,
  updateOnSelect
}) =>
  searchable
  ? (
    <input
      className={cx(styles.input, {
        [styles.noClear]: !updateOnSelect
      })}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClick}
      onFocus={onFocus}
      placeholder={placeholder}
      ref={inputRef}
      type='text'
      value={value || ''}
    />
  ) : (
    <div
      className={cx(styles.staticText, { [styles.noClear]: !updateOnSelect })}
      onClick={onClick}
    >
      {(value.length > 0 && value) || titleValue || placeholder}
    </div>
  );
