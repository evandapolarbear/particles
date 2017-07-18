import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  compose,
  withStateHandlers,
  withHandlers,
  withProps
} from 'recompose';
import baseStyles from './Tipako.scss';
import composeStyles from '../../../shared/stylesheetComposer';
import generateId from '../../../shared/generateId';

let counter = 0;
let groupCounter = 0;

const Pure = ({
  caret,
  clear,
  controls,
  count,
  disabled,
  empty,
  expanded,
  items,
  onKeyDown,
  search,
  slot,
  slotBottom,
  spinner,
  styles,
  tabIndex
}) => (
  <div
    className={cx(styles.container,
      { [styles.active]: expanded,
        [styles.disabled]: disabled })}
    onKeyDown={onKeyDown}
    tabIndex={tabIndex}
  >
    <div
      className={cx(styles.title,
        { [styles.active]: expanded,
          [styles.disabled]: disabled })}
    >
      {slot}
      {search}
      {clear}
      {caret}
      {spinner}
    </div>

    <div className={styles.dropdownContainer}>
      <div
        className={cx(styles.dropdown, {
          [styles.expanded]: expanded,
          [styles.withSlotBottom]: slotBottom && expanded
        })}
      >
        {controls}
        <div className={styles.itemsContainer}>
          {count ? items : empty}
        </div>
        {slotBottom &&
          <div
            className={styles.slotBottom}
            onClick={e => e.stopPropagation()}
          >{slotBottom}</div>}
      </div>
    </div>
  </div>
);

Pure.propTypes = {
  caret: PropTypes.element,
  clear: PropTypes.element,
  controls: PropTypes.element,
  count: PropTypes.number,
  disabled: PropTypes.bool,
  empty: PropTypes.element,
  expanded: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.element),
  onKeyDown: PropTypes.func,
  search: PropTypes.element,
  slot: PropTypes.element,
  slotBottom: PropTypes.element,
  spinner: PropTypes.element,
  styles: PropTypes.shape({}),
  tabIndex: PropTypes.number
};

Pure.defaultProps = {
  caret: null,
  clear: null,
  controls: null,
  count: 0,
  disabled: false,
  empty: null,
  expanded: false,
  items: [],
  onKeyDown: () => {},
  search: null,
  slot: null,
  slotBottom: null,
  spinner: null,
  styles: {},
  tabIndex: 0
};

const enhancer = compose(
  withProps(initialProps => ({ guid: generateId() })),
  withStateHandlers(
    ({ titleValue = '' }) => ({
      value: titleValue,
      expanded: false,
      currentIndex: -1,
      guid: null
    }),
    {
      clearGuid: () => () => ({ guid: null }),
      collapse: () => () => ({ expanded: false }),
      expand: () => () => ({ expanded: true }),
      setValue: () => value => ({ value }),
      setCurrentIndex: () => currentIndex => ({ currentIndex }),
      onSearch: (state, { onSearch }) => (value) => {
        onSearch(value);
        return {
          value,
          expanded: true
        };
      },
      onInputClear: (state, { onClear, onSearch }) => (evt) => {
        evt.stopPropagation();
        onSearch && onSearch('');
        onClear && onClear();
        return { value: '' };
      },
      updateValue: (state, { valueFunction, valueField }) => item => ({
        value: valueFunction
          ? valueFunction(item)
          : item[valueField]
      }),
      onCaretClick: ({ expanded }, { onFocus, guid }) => () => {
        if (expanded === false) {
          onFocus && onFocus();
          return { currentIndex: -1, expanded: true, guid };
        }
        return {};
      }
    }
  ),
  withHandlers({
    onChildClick: ({ collapse, onSelect, closeOnSelect, updateValue }) =>
      (evt, child) => {
        if (child.disabled) { return; }
        onSelect(child);
        if (closeOnSelect) { collapse(); }
        updateValue(child);
      },
    onGroupClick: ({ collapse, onSelect, closeOnSelect, updateValue }) =>
      (evt, group) => {
        evt.stopPropagation();
        if (group.disabled) { return; }
        onSelect(group);
        if (closeOnSelect) { collapse(); }
        updateValue(group);
      },
    onUngroupedClick: ({ collapse, onSelect, closeOnSelect, updateValue }) =>
      (evt, item) => {
        evt.stopPropagation();
        if (item.disabled) { return; }
        onSelect(item);
        if (closeOnSelect) { collapse(); }
        updateValue(item);
      },
    onSelectAll: ({ collapse, onSelectAll }) => () => {
      onSelectAll();
      collapse();
    },
    onClearAll: ({ collapse, onClearAll }) => () => {
      onClearAll();
      collapse();
    },
    onSearchFocus: ({ onFocus }) => (evt) => {
      evt.target.select();
      onFocus && onFocus();
    },
    windowClick: ({ clearGuid, guid, expand, collapse }) => () => {
      guid ? expand() : collapse();
      clearGuid();
    },
    onInputBlur: ({ value, setValue, titleValue }) => () => {
      if (value.length === 0 && titleValue) {
        setValue(titleValue);
      }
    },
    getEmptyString: ({ value, loading }) => {
      if (value) {
        return `No matches for "${value}".`;
      }

      if (loading) {
        return 'Retrieving items...';
      }

      return 'No items found.';
    },
    arrowKeyListener: ({
      setCurrentIndex,
      currentIndex,
      searchable,
      expanded
    }) => (evt) => {
      let totalCounter = counter > groupCounter
        ? counter
        : groupCounter;

      if (groupCounter === 0) {
        totalCounter -= 1;
      }

      if (evt.keyCode === 38 && expanded) {
        evt.preventDefault();
        if ((currentIndex > -1 && searchable) || (currentIndex > 0 && !searchable)) {
          setCurrentIndex(currentIndex - 1);
        }
      }

      if (evt.keyCode === 40 && expanded) {
        evt.preventDefault();
        if (currentIndex < totalCounter) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    }
  })
);

class Tipako extends React.Component {
  static propTypes = {
    closeOnSelect: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.shape({
        disabled: PropTypes.bool,
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        value: PropTypes.string.isRequired
      })),
      disabled: PropTypes.bool,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      value: PropTypes.string.isRequired
    })),
    disabled: PropTypes.bool,
    keyField: PropTypes.string,
    loading: PropTypes.bool,
    onClear: PropTypes.func,
    onClearAll: PropTypes.func,
    onFocus: PropTypes.func,
    onSearch: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderGroup: PropTypes.func,
    renderItem: PropTypes.func,
    searchable: PropTypes.bool,
    slotBottom: PropTypes.node,
    slotTitle: PropTypes.element,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    titlePlaceholder: PropTypes.string,
    titleValue: PropTypes.string,
    updateOnSelect: PropTypes.bool,
    valueField: PropTypes.string,
    valueFunction: PropTypes.func
  }

  static defaultProps = {
    closeOnSelect: false,
    data: [],
    disabled: false,
    keyField: 'key',
    loading: false,
    onClear: null,
    onClearAll: null,
    onFocus: null,
    onSearch: null,
    onSelectAll: null,
    renderEmpty: null,
    renderGroup: null,
    renderItem: null,
    searchable: false,
    selectedKey: null,
    slotBottom: null,
    slotTitle: null,
    stylesheets: [],
    titlePlaceholder: 'Select...',
    titleValue: '',
    updateOnSelect: false,
    valueField: 'value',
    valueFunction: null
  }

  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, [...props.stylesheets]);

    if (props.searchable === false && props.onSearch !== null) {
      console.error('An instance of Tipako has an "onSearch()" ' // eslint-disable-line
        + 'callback defined, but its "searchable" prop is false, '
        + 'so the callback will have no effect.');
    }
  }

  componentWillMount() {
    window.addEventListener('click', this.props.windowClick);
  }

  componentDidUpdate() {
    const { currentIndex, expanded } = this.props;

    if (expanded) {
      if (this.focusedItem && currentIndex > -1) {
        this.focusedItem.focus();
      }

      if (this.searchInput && currentIndex === -1) {
        this.searchInput.focus();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.props.windowClick);
  }

  render() {
    const {
      arrowKeyListener,
      slotBottom,
      data,
      disabled,
      keyField,
      loading,
      onClearAll,
      onSearch,
      onSelectAll,
      renderEmpty,
      renderGroup,
      renderItem,
      searchable,
      titlePlaceholder,
      slotTitle,
      titleValue,
      updateOnSelect,
      valueField,
      expanded,
      onInputBlur,
      getEmptyString,
      onCaretClick,
      onSearchFocus,
      currentIndex,
      onChildClick,
      value,
      onInputClear,
      onUngroupedClick,
      onGroupClick
    } = this.props;

    const searchTerm = (searchable && value && !onSearch)
      ? value.toLowerCase()
      : '';

    counter = 0;
    groupCounter = 0;

    const items = data.reduce((acc, v, i) => {
      // Grouped
      if (v.children) {
        const children = v.children.reduce((result, vv, ii) => {
          if (vv[valueField].toLowerCase().indexOf(searchTerm) === -1) {
            return result;
          }

          groupCounter > counter
            ? counter = groupCounter + 1
            : counter += 1;

          const focusedItem = currentIndex === counter;
          const childItem = result.concat(
            <div
              className={cx(this.styles.item, this.styles.childItem,
                { [this.styles.disabled]: vv.disabled,
                  [this.styles.keyFocus]: focusedItem })}
              key={`child-${v[keyField]}-${vv[keyField]}`}
              onClick={(e) => { onChildClick(e, vv); }}
              onKeyDown={(e) => { if (focusedItem && e.keyCode === 13) onChildClick(e, vv); }}
              ref={(el) => { if (focusedItem) this.focusedItem = el; }}
              tabIndex={-1}
            >
              {renderItem ? renderItem(vv, ii) : vv[valueField]}
            </div>
          );

          return childItem;
        }, []);

        if (children.length === 0 && v[valueField].toLowerCase().indexOf(searchTerm) === -1) {
          return acc;
        }

        const focusedItem = currentIndex === groupCounter;

        const group = (
          <div
            className={cx(this.styles.item, this.styles.groupItem,
              { [this.styles.disabled]: v.disabled,
                [this.styles.keyFocus]: focusedItem })}
            key={`group-${v[keyField]}`}
            onClick={(evt) => { onGroupClick(evt, v); }}
            onKeyDown={(e) => { if (focusedItem && e.keyCode === 13) onGroupClick(e, v); }}
            ref={(el) => { if (focusedItem) this.focusedItem = el; }}
            tabIndex={-1}
          >
            {renderGroup ? renderGroup(v, i) : v[valueField]}
          </div>
        );

        groupCounter = counter + 1;
        return acc.concat(group).concat(children);
      }

      if (v[valueField].toLowerCase().indexOf(searchTerm) === -1) {
        return acc;
      }

      // Ungrouped
      if (groupCounter > 0) {
        groupCounter > counter
          ? counter = groupCounter + 1
          : counter += 1;
      }

      const focusedItem = currentIndex === counter;

      const ungrouped = (
        <div
          className={cx(this.styles.item, this.styles.ungroupedItem,
            { [this.styles.disabled]: v.disabled,
              [this.styles.keyFocus]: focusedItem })}
          key={`ungrouped-${v[keyField]}`}
          onClick={(evt) => { onUngroupedClick(evt, v); }}
          onKeyDown={(e) => { if (focusedItem && e.keyCode === 13) onUngroupedClick(e, v); }}
          ref={(el) => { if (focusedItem) this.focusedItem = el; }}
          tabIndex={-1}
        >
          {renderItem ? renderItem(v, i) : v[valueField]}
        </div>
      );

      if (groupCounter === 0) {
        counter += 1;
      }

      return acc.concat(ungrouped);
    }, []);

    const selectAll = (onSelectAll && items.length > 0) && (
      <button className={this.styles.controlsButton} onClick={onSelectAll} type='button'>
         Select All
      </button>
    );

    const clearAll = onClearAll && (
      <button className={this.styles.controlsButton} onClick={onClearAll} type='button'>
        Clear All
      </button>);

    const spacer = (clearAll && selectAll)
      ? <div className={this.styles.controlsSpacer}>/</div>
      : null;

    const controls =
      (selectAll || clearAll) && (
        <div className={this.styles.controls}>
          {selectAll}
          {spacer}
          {clearAll}
        </div>
      );

    const empty = (<div className={this.styles.empty}>
      {renderEmpty ? renderEmpty() : getEmptyString()}
    </div>);

    const caret = loading
      ? null
      : (<button onClick={onCaretClick} className={this.styles.caret} type='button'>
        <span className={cx('fa', 'fa-caret-down', this.styles.arrow, { [this.styles.expanded]: expanded })} />
      </button>);

    const clear = value
      ? <button onClick={onInputClear} className={this.styles.clear} type='button' />
      : null;

    const spinner = loading
      ? <span className={this.styles.spinner} />
      : null;

    const slot = slotTitle
      ? <div className={this.styles.slot}>{slotTitle}</div>
      : null;

    const search = searchable
      ? (
        <input
          className={cx(this.styles.input, {
            [this.styles.noClear]: !updateOnSelect
          })}
          onBlur={onInputBlur}
          onChange={evt => onSearch(evt.target.value)}
          onClick={onCaretClick}
          onFocus={onSearchFocus}
          placeholder={titlePlaceholder}
          ref={input => (this.searchInput = input)}
          type='text'
          value={value || ''}
        />
      ) : (
        <div
          className={cx(this.styles.staticText, { [this.styles.noClear]: !updateOnSelect })}
          onClick={onCaretClick}
        >
          {(value.length > 0 && value) || titleValue || titlePlaceholder}
        </div>
      );

    return (<Pure
      caret={caret}
      clear={clear}
      controls={controls}
      count={items.length}
      disabled={disabled}
      empty={empty}
      items={items}
      expanded={expanded}
      onKeyDown={arrowKeyListener}
      search={search}
      slot={slot}
      slotBottom={slotBottom}
      spinner={spinner}
      styles={this.styles}
      tabIndex={-1}
    />);
  }
}


export default enhancer(Tipako);
