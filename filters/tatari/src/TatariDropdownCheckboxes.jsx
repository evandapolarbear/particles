import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

let counter = 0;

export default class TatariDropdownCheckboxes extends React.Component {
  componentDidUpdate() {
    const { currentIndex } = this.props;

    if (this.props.isExpanded) {
      if (this.focusedItem && currentIndex > -1) {
        this.focusedItem.focus();
      }

      if (this.searchInput && currentIndex === -1) {
        this.searchInput.focus();
      }
    }
  }

  render() {
    const {
      arrowKeyListener,
      currentIndex,
      filter,
      i18n,
      isExpanded,
      isLoading,
      onCheckOne,
      onCheckAll,
      onCheckNone,
      onExpand,
      onRemove,
      onSearch,
      options,
      styles
    } = this.props;

    const count = options.reduce((acc, option) => (option.checked ? acc + 1 : acc), 0);
    const adjustedCount = (count > 1 ? <div className={styles.activeCount}>({count})</div> : null);

    function onClick(evt) {
      evt.stopPropagation();
    }

    const remove = (<button
      className={cx('fa', 'fa-times', styles.activeRemove)}
      data-key={filter.key}
      onClick={onRemove}
    />);

    const loading = (isLoading
      ? <span className={styles.dropdownLoading} />
      : null);

    const caret = isLoading
      ? null
      : (<div className={styles.dropdownCaret}>
        <span
          className={cx('fa', 'fa-caret-down', styles.arrow,
          { [styles.expanded]: isExpanded })}
        />
      </div>);

    const singleSelection = options.reduce((acc, option) => {
      if (count === 1 && option.checked) {
        acc.push(<div
          className={styles.singleSelection}
          key={`option-${option.key}`}
        >{option.value}</div>);
      }

      return acc;
    }, []);

    const text = (count === 1
      ? (<div className={styles.singleSelectionDropdownTitle}>
        {filter.value}:
        {singleSelection}
      </div>)
      : <div className={styles.dropdownTitle}>{filter.value}</div>);

    counter = 0;

    const items = options.reduce((acc, option) => {
      const focusedItem = currentIndex === counter;

      if (option.hidden !== true) {
        acc.push(<label
          className={cx(styles.activeItem, { [styles.keyFocus]: focusedItem })}
          key={`option-${option.key}`}
          onClick={(evt) => { evt.stopPropagation(); }}
          onKeyDown={onCheckOne}
          ref={(el) => { if (focusedItem) this.focusedItem = el; }}
          tabIndex={-1}
        >
          <input
            type='checkbox'
            checked={option.checked || false}
            className={styles.activeCheckbox}
            onChange={onCheckOne}
            data-filter-key={filter.key}
            data-key={option.key}
          />
          <div className={styles.activeText}>{option.value}</div>
        </label>);
        counter += 1;
      }

      return acc;
    }, []);

    const emptyMessage = items.length === 0
      ? <div className={styles.emptyMessage}>No items available for this filter.</div>
      : null;

    const activeControls = items.length > 0
      ? (<div className={styles.activeControls}>
        <button onClick={onCheckAll} data-key={filter.key} className={styles.activeControl}>
          {i18n.select_all}
        </button>
        <span className={styles.activeDivider}>/</span>
        <button onClick={onCheckNone} data-key={filter.key} className={styles.activeControl}>
          {i18n.clear_all}
        </button>
      </div>)
      : null;

    const activeSearch = options.length > 0
      ? (<div className={styles.activeSearch}>
        <input
          className={styles.activeInput}
          data-key={filter.key}
          onChange={onSearch}
          onClick={onClick}
          onFocus={evt => evt.target.select()}
          placeholder='Search'
          ref={(el) => { this.searchInput = el; }}
        />
        <div className={cx('fa', 'fa-search', styles.activeIcon)} />
      </div>)
      : null;

    return (<div className={styles.dropdownContainer}>
      <div
        className={cx(styles.dropdownHead, { [styles.expanded]: isExpanded })}
        data-key={filter.key}
        onClick={onExpand}
        onKeyDown={arrowKeyListener}
        tabIndex={-1}
      >
        {remove}
        {text}
        {adjustedCount}
        {caret}
        {loading}
      </div>

      <div
        className={cx(styles.dropdownBody, { [styles.expanded]: isExpanded })}
        onKeyDown={arrowKeyListener}
        tabIndex={-1}
      >
        <div>
          {activeSearch}
          {activeControls}
        </div>
        <div className={cx(styles.activeItems)}>
          {items}
          {emptyMessage}
        </div>
      </div>
    </div>);
  }
}

TatariDropdownCheckboxes.propTypes = {
  arrowKeyListener: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  filter: PropTypes.shape({
    endpoint: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  i18n: PropTypes.shape(),
  isExpanded: PropTypes.bool,
  isLoading: PropTypes.bool,
  onCheckOne: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
  onCheckNone: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape()),
  styles: PropTypes.shape().isRequired
};

TatariDropdownCheckboxes.defaultProps = {
  i18n: {},
  isExpanded: false,
  isLoading: false,
  options: [],
  styles: {}
};
