import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map } from 'immutable';

import CheckboxDropdown from '../../CheckboxDropdown';
import TaggedElement from '../../TaggedElement';

const i18n = {
  SELECT_CURRENT: 'Select Current',
  CLEAR_CURRENT: 'Clear Current',
};

const placeholder = (firstItemLabel, label, checkedOptions) => {
  if (checkedOptions.size === 0) {
    return (
      <span>{label}:</span>
    );
  }

  if (checkedOptions.size === 1) {
    return (
      <span className="rw-placeholder">
        <span className="filter-single-placeholder">
          <span>{label}:</span>
          <span>{firstItemLabel}</span>
        </span>
      </span>
    );
  }

  if (checkedOptions.size > 1) {
    return (
      <span className="filter-multi-placeholder">
        <span>{label}</span>
        <span className="filter-count">({checkedOptions.size})</span>
      </span>
    );
  }

  return '';
};

export default class MultiValueFilter extends React.Component {

  static propTypes = {
    filterFunc: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.boolean,
    ]),
    label: PropTypes.string,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    options: ImmutablePropTypes.list,
    optionsModifier: PropTypes.node,
    selected: ImmutablePropTypes.list,
    textField: PropTypes.string,
    valueField: PropTypes.string,
  };

  static defaultProps = {
    label: 'Select items',
    onChange: () => {},
    onRemove: () => {},
    onClose: () => {},
    onOpen: () => {},
    open: false,
    options: List(),
    selected: List(),
    textField: 'label',
    valueField: 'value',
  };

  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
  }

  render() {
    const {
      props: {
        filterFunc,
        label,
        onChange,
        onRemove,
        onClose,
        onOpen,
        open,
        options,
        optionsModifier,
        selected,
        textField,
        valueField,
      },
      state: {
        searchTerm,
      },
    } = this;

    const opts = options.map(opt => {
      return opt.set('checked', selected.contains(opt.get(valueField)));
    });
    const first = opts.filter(obj => obj.get('checked', false)).first() || Map();

    return (
      <div className="vanishing-picker rw-widget-override override-width-auto secondary-style">
        <CheckboxDropdown {...{
          allLabel: searchTerm ? i18n.SELECT_CURRENT : undefined,
          duration: 0,
          filter: filterFunc,
          label,
          noneLabel: searchTerm ? i18n.CLEAR_CURRENT : undefined,
          onChange: (isChecked, option) => {
            const value = option.get(valueField);
            const ndx = selected.indexOf(value);
            const values = ndx < 0
              ? selected.push(value)
              : selected.splice(ndx, 1);

            onChange(values);
          },
          onClickAll: () => {
            if (filterFunc) {
              onChange(options
                .filter(o => filterFunc(o.toJS(), searchTerm))
                .map(o => o.get(valueField))
                .concat(selected));
            } else {
              onChange(options.map(o => o.get(valueField)));
            }
          },
          onClickNone: () => {
            if (filterFunc) {
              onChange(options
                .filter(o => !filterFunc(o.toJS(), searchTerm))
                .map(o => o.get(valueField))
                .filter(o => selected.includes(o)));
            } else {
              onChange(List());
            }
          },
          onClose: () => {
            onClose();
            this.setState({ searchTerm: '' });
          },
          onSearch: (value) => {
            this.setState({ searchTerm: value });
          },
          onOpen,
          open,
          options: opts,
          optionsModifier,
          placeholder: placeholder.bind(null, first.get(textField, '')),
          searchTerm,
          textField,
          valueField,
        }} />
        <TaggedElement className="clear-field" tag="filters-token-clear">
          <span {...{
            className: 'pct-icon clear',
            onClick: onRemove,
          }} />
        </TaggedElement>
      </div>
    );
  }

}
