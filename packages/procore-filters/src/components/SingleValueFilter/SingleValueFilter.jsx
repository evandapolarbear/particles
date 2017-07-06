import React from 'react';
import clickOutside from 'react-click-outside';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { DropdownList } from 'react-widgets';
import { Map } from 'immutable';
import Icon from '../../Icon';

const i18n = {
  emptyFilter: 'No Results Found',
  emptyList: 'There are no items in this list',
};

class SingleValueFilter extends React.Component {

  static propTypes = {
    data: ImmutablePropTypes.list,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    open: React.PropTypes.bool,
    selected: ImmutablePropTypes.list,
    textField: React.PropTypes.string,
    valueField: React.PropTypes.string,
  };

  componentDidMount() {
    this.props.open && this._dropdownlist.focus();
  }

  handleClickOutside = () => {
    this.props.open && this.props.onClose();
  }

  placeholder = (label, itemLabel) => {
    if (!itemLabel) {
      return (<span>{label}:</span>);
    }

    return (
      <span className="rw-placeholder">
        <span className="filter-single-placeholder">
          <span>{label}:</span><span>{itemLabel}</span>
        </span>
      </span>
    );
  }

  render() {
    const {
      data,
      label,
      open,
      onChange,
      onRemove,
      selected,
      textField,
      valueField,
    } = this.props;

    const selectedLabel = data.find(item =>
      selected.contains(item.get(valueField)), null, Map()).get(textField, null);

    return (
      <span className="rw-widget-override no-highlight vanishing-picker secondary-style override-width-auto">
        <DropdownList
          data={data.toJS()}
          defaultOpen={open}
          duration={0}
          onChange={onChange}
          messages={i18n}
          textField={textField}
          placeholder={this.placeholder(label, selectedLabel)}
          value={null}
          valueField={valueField}
          ref={(ref) => { this._dropdownlist = ref; }}
        />
        <span className="clear-field" onClick={onRemove}>
          <Icon icon="clear" />
        </span>
      </span>
    );
  }
}

export default clickOutside(SingleValueFilter);
