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

import {
  Controls,
  Empty,
  Caret,
  Clear,
  Spinner,
  Slot,
  Search
} from './Components';

let counter = 0;
let groupCounter = 0;

const buildOptions = ({
  data,
  valueField,
  searchTerm,
  currentIndex,
  focusedItemRef,
  styles,
  keyField,
  onChildClick,
  renderItem,
  onGroupClick,
  renderGroup,
  onUngroupedClick
}) => data.reduce((acc, item, i) => {
  // Grouped
  if (item.children) {
    const children = item.children.reduce((result, subItem, ii) => {
      if (subItem[valueField].toLowerCase().indexOf(searchTerm) === -1) {
        return result;
      }
      groupCounter > counter
        ? counter = groupCounter + 1
        : counter += 1;

      const focusedItem = currentIndex === counter;
      const childItem = result.concat(
        <div
          className={cx(styles.item, styles.childItem,
            { [styles.disabled]: subItem.disabled,
              [styles.keyFocus]: focusedItem })}
          key={`child-${item[keyField]}-${subItem[keyField]}`}
          onClick={(e) => { onChildClick(e, subItem); }}
          onKeyDown={(e) => {
            if (focusedItem && e.keyCode === 13) {
              onChildClick(e, subItem);
            }
          }}
          ref={ref => focusedItem && focusedItemRef(ref)}
          tabIndex={-1}
        >
          {renderItem ? renderItem(subItem, ii) : subItem[valueField]}
        </div>
      );

      return childItem;
    }, []);

    if (children.length === 0 && item[valueField].toLowerCase().indexOf(searchTerm) === -1) {
      return acc;
    }

    const focusedItem = currentIndex === groupCounter;

    const group = (
      <div
        className={cx(styles.item, styles.groupItem,
          { [styles.disabled]: item.disabled,
            [styles.keyFocus]: focusedItem })}
        key={`group-${item[keyField]}`}
        onClick={(evt) => { onGroupClick(evt, item); }}
        onKeyDown={(e) => { if (focusedItem && e.keyCode === 13) onGroupClick(e, item); }}
        ref={ref => focusedItem && focusedItemRef(ref)}
        tabIndex={-1}
      >
        {renderGroup ? renderGroup(item, i) : item[valueField]}
      </div>
    );

    groupCounter = counter + 1;
    return acc.concat(group).concat(children);
  }

  if (item[valueField].toLowerCase().indexOf(searchTerm) === -1) {
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
      className={cx(styles.item, styles.ungroupedItem,
        { [styles.disabled]: item.disabled,
          [styles.keyFocus]: focusedItem })}
      key={`ungrouped-${item[keyField]}`}
      onClick={(evt) => { onUngroupedClick(evt, item); }}
      onKeyDown={(e) => { if (focusedItem && e.keyCode === 13) onUngroupedClick(e, item); }}
      ref={ref => focusedItem && focusedItemRef(ref)}
      tabIndex={-1}
    >
      {renderItem ? renderItem(item, i) : item[valueField]}
    </div>
  );

  if (groupCounter === 0) {
    counter += 1;
  }

  return acc.concat(ungrouped);
}, []);


const enhancer = compose(
  withProps(({ stylesheets }) => ({
    guid: generateId(),
    styles: composeStyles(baseStyles, [...stylesheets])
  })),
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
      onInputChange: (state, { onSearch }) => (value) => {
        onSearch && onSearch(value);
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
    onClearAll: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectAll: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderGroup: PropTypes.func,
    renderItem: PropTypes.func,
    searchable: PropTypes.bool,
    slotBottom: PropTypes.node,
    slotTitle: PropTypes.element,
    titlePlaceholder: PropTypes.string,
    titleValue: PropTypes.string,
    updateOnSelect: PropTypes.bool,
    valueField: PropTypes.string
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
      onInputChange,
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
      setValue,
      styles,
      onGroupClick
    } = this.props;

    const searchTerm = (searchable && value && !onSearch)
      ? value.toLowerCase()
      : '';

    counter = 0;
    groupCounter = 0;

    const items = buildOptions({
      data,
      valueField,
      searchTerm,
      currentIndex,
      styles,
      keyField,
      onChildClick,
      renderItem,
      onGroupClick,
      renderGroup,
      onUngroupedClick,
      focusedItemRef: ref => (this.focusedItem = ref)
    });


    const count = items.length;

    return (
      <div
        className={cx(styles.container,
          { [styles.active]: expanded,
            [styles.disabled]: disabled })}
        onKeyDown={arrowKeyListener}
        tabIndex={-1}
      >
        <div
          className={cx(styles.title,
            { [styles.active]: expanded,
              [styles.disabled]: disabled })}
        >
          <Slot text={slotTitle} className={styles.slot} />
          <Search
            searchable={searchable}
            styles={styles}
            onBlur={onInputBlur}
            onClick={onCaretClick}
            onFocus={onSearchFocus}
            onChange={evt => onInputChange(evt.target.value)}
            placeholder={titlePlaceholder}
            updateOnSelect={updateOnSelect}
            value={value}
            inputRef={input => (this.searchInput = input)}
          />
          <Clear onClick={onInputClear} className={styles.clear} />
          <Caret onClick={onCaretClick} expanded={expanded} styles={styles} />
          { loading ? <Spinner className={styles.spinner} /> : null}
        </div>

        <div className={styles.dropdownContainer}>
          <div
            className={cx(styles.dropdown, {
              [styles.expanded]: expanded,
              [styles.withSlotBottom]: slotBottom && expanded
            })}
          >
            <Controls
              styles={styles}
              count={items.length}
              onSelectAll={onSelectAll}
              onClearAll={onClearAll}
            />
            <div className={styles.itemsContainer}>
              {count
                ? items
                : <Empty
                  className={styles.empty}
                  content={renderEmpty ? renderEmpty() : getEmptyString()}
                />
              }
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
  }
}


export default enhancer(Tipako);
