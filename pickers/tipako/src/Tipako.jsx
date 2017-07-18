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

const Spacer = ({ className }) => (<div className={className}>/</div>);
const ControlsButton = text => ({ onClick, className }) => (
  <button className={className} onClick={onClick} type='button'>
    {text}
  </button>
);

const SelectAll = ControlsButton('Select All');
const ClearAll = ControlsButton('Clear All');

const Controls = ({
  onClearAll,
  onSelectAll,
  count,
  styles,
}) => {
  const selectAll = (onSelectAll && count) && (
    <SelectAll className={styles.controlsButton} onClick={onSelectAll} />
  );
  const clearAll = (onClearAll) && (
    <ClearAll className={styles.controlsButton} onClick={onClearAll} />
  );
  return (
    <div className={styles.controls}>
      {selectAll}
      {(clearAll && selectAll) && <Spacer className={styles.controlsSpacer} />}
      {clearAll}
    </div>
  );
};


const Empty = ({ className, content }) => (
  <div className={className}>{content}</div>
);

const Caret = ({ onClick, expanded, styles }) => (
  <button onClick={onClick} className={styles.caret} type='button'>
    <span className={cx('fa', 'fa-caret-down', styles.arrow, { [styles.expanded]: expanded })} />
  </button>
);

const Clear = ({ onClick, className }) => (
  <button onClick={onClick} className={className} type='button' />
);

const Spinner = ({ className }) => (<span className={className} />);

const Slot = ({ text, className }) => (<div className={className}>{text}</div>);

const Search = ({
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
      styles,
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
              className={cx(styles.item, styles.childItem,
                { [styles.disabled]: vv.disabled,
                  [styles.keyFocus]: focusedItem })}
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
            className={cx(styles.item, styles.groupItem,
              { [styles.disabled]: v.disabled,
                [styles.keyFocus]: focusedItem })}
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
          className={cx(styles.item, styles.ungroupedItem,
            { [styles.disabled]: v.disabled,
              [styles.keyFocus]: focusedItem })}
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

    const empty = Empty({
      className: styles.empty,
      content: renderEmpty ? renderEmpty() : getEmptyString()
    });
    const caret = Caret({
      onClick: onCaretClick,
      expanded,
      styles: styles
    });
    const clear = Clear({
      onClick: onInputClear,
      className: styles.clear
    });
    const spinner = loading
      ? Spinner({ className: styles.spinner })
      : null;
    const slot = slotTitle && Slot({
      text: slotTitle,
      className: styles.slot
    });

    const search = (
      <Search
        searchable={searchable}
        styles={styles}
        onBlur={onInputBlur}
        onClick={onCaretClick}
        onFocus={onSearchFocus}
        onChange={evt => onSearch(evt.target.value)}
        placeholder={titlePlaceholder}
        updateOnSelect={updateOnSelect}
        value={value}
        inputRef={input => (this.searchInput = input)}
      />
    );

    const controls = (
      <Controls
        styles={styles}
        count={items.length}
        onSelectAll={onSelectAll}
        onClearAll={onClearAll}
      />
    );

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
  }
}


export default enhancer(Tipako);
