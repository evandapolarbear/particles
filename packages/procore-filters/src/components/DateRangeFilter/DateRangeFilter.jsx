import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { DropdownList } from 'react-widgets';
import { List } from 'immutable';
import clickOutside from 'react-click-outside';
import moment from 'moment';
import { DateRangePickerAdapter } from '../../DropdownListAdapter';
import TaggedElement from '../../TaggedElement';

const placeholder = (label, range) => {
  const [start, end] = range.toJS();

  if (!start && !end) {
    return (
      <span>{label}:</span>
    );
  }

  return (
    <span className="rw-placeholder">
      <span className="filter-single-placeholder">
        <span>{label}:</span>
        <span>
          {start ? moment(start).utc().format('M/D/YY') : ''}
          {start && end ? <span> - </span> : ''}
          {end ? moment(end).utc().format('M/D/YY') : ''}
        </span>
      </span>
    </span>
  );
};

@clickOutside
export default class DateRangeFilterComponent extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    onRemove: PropTypes.func,
    open: PropTypes.bool,
    selected: PropTypes.list,
  };

  static defaultProps = {
    label: 'Select dates',
    onChange: () => {},
    onClose: () => {},
    onOpen: () => {},
    onRemove: () => {},
    open: false,
    selected: List(),
  };

  constructor(props) {
    super(props);
    this.state = { open: this.props.open || false };
  }

  handleClickOutside = () => {
    const { onClose, selected } = this.props;
    if (this.state.open) {
      this.setState({ open: false });
      onClose(selected);
    }
  }
  render() {
    const { label, onChange, onOpen, onRemove, onClose, selected } = this.props;

    return (
      <div className="vanishing-picker rw-widget-override override-width-auto secondary-style">
        <DropdownList {...{
          data: selected,
          duration: 0,
          listComponent: DateRangePickerAdapter,
          onClick: () => {
            if (!this.state.open) {
              this.setState({ open: true });
              onOpen();
            }
          },
          onSelect: (values) => {
            onChange(values);
            const hasBothDates = values.get(0) !== '' && values.get(1) !== '';
            const endLastChanged = values.get(1) !== selected.get(1);
            if (this.state.open && hasBothDates && endLastChanged) {
              this.setState({ open: false });
              onClose(values);
            }
          },
          open: this.state.open,
          placeholder: placeholder(label, selected),
          ref: 'dropdown',
          value: null,
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
