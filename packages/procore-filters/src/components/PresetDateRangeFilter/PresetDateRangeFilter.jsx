import React, { PropTypes } from 'react';
import { DropdownList } from 'react-widgets';
import { fromJS, List, Map } from 'immutable';
import clickOutside from 'react-click-outside';
import moment from 'moment';
import uuid from 'uuid';

import { isCustomRange } from '../../../redux/ducks/filterBuilder';
import DateRangePicker from '../../DateRangePicker';
import TaggedElement from '../../TaggedElement';

const CUSTOM = 'custom';

export const DEFAULT_DATE_RANGE_LIST = fromJS([
  { label: '(Blank)', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'Last 7 Days', value: 'last_seven_days' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 30 Days', value: 'last_thirty_days' },
  { label: 'Last 60 Days', value: 'last_sixty_days' },
  { label: 'Last Quarter', value: 'last_quarter' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'This Quarter', value: 'this_quarter' },
  { label: 'Next Week', value: 'next_week' },
  { label: 'Next 7 Days', value: 'next_seven_days' },
  { label: 'Next Month', value: 'next_month' },
  { label: 'Next 30 Days', value: 'next_thirty_days' },
  { label: 'Next 60 Days', value: 'next_sixty_days' },
  { label: 'Next Quarter', value: 'next_quarter' },
  { label: 'Custom Range', value: CUSTOM },
]);

const DEFAULT_DATE_RANGE_LOOKUP = DEFAULT_DATE_RANGE_LIST.reduce(
  (acc, item) => acc.set(item.get('value'), item.get('label')),
  Map(),
);

const getLabel = (value) =>
  DEFAULT_DATE_RANGE_LOOKUP.get(value, DEFAULT_DATE_RANGE_LOOKUP.get(CUSTOM));

const getValue = (value) =>
  value && (DEFAULT_DATE_RANGE_LOOKUP.get(value) ? value : CUSTOM);

const ValueComponent = (label, range) => (props) => {
  const [start, end] = range.toJS();

  if (start === undefined && end === undefined) {
    return (
      <span>{label}:</span>
    );
  }

  return (
    <span className="rw-placeholder">
      <span className="filter-single-placeholder">
        <span>{label}:</span>
        {isCustomRange(range) ? (
          <span>
            {start ? moment(start).utc().format('M/D/YY') : ''}
            {start && end ? <span> - </span> : ''}
            {end ? moment(end).utc().format('M/D/YY') : ''}
          </span>
        ) : (
          <span>{getLabel(getValue(start))}</span>
        )}
      </span>
    </span>
  );
};

@clickOutside
export default class PresetDateRangeFilter extends React.Component {

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

    this.state = {
      ident: uuid.v4(),
      open: this.props.open,
    };
  }

  componentDidMount() {
    this.state.open && this._dropdownlist.focus();
  }

  handleClickOutside = () => {
    const { onClose, selected } = this.props;

    if (this.state.open) {
      this.setState({ open: false });
      onClose(selected);
    }
  }

  render() {
    const {
      props: { label, onChange, onOpen, onRemove, onClose, selected },
      state: { ident, open },
    } = this;

    const start = moment(selected.get(0, '')).utc();
    const end = moment(selected.get(1, '')).utc();

    return (
      <div className="vanishing-picker rw-widget-override override-width-auto secondary-style">
        <DropdownList {...{
          data: DEFAULT_DATE_RANGE_LIST.toJS(),
          duration: 0,
          onClick: () => {
            if (!open) {
              this.setState({ open: true });
              onOpen();
            }
          },
          onSelect: ({ value }) => {
            const values = List([value]);

            onChange(values);

            if (open && value !== CUSTOM) {
              onClose(values);
              this.setState({ open: false });
            }
          },
          open,
          ref: (ref) => { this._dropdownlist = ref; },
          textField: 'label',
          value: getValue(selected.get(0)),
          valueComponent: ValueComponent(label, selected),
          valueField: 'value',
        }} />
        <TaggedElement className="clear-field" tag="filters-token-clear">
          <span {...{
            className: 'pct-icon clear',
            onClick: onRemove,
          }} />
        </TaggedElement>
        {open && (selected.get(0) === CUSTOM || isCustomRange(selected)) && (
          <div className="day-range-picker-container">
            <DateRangePicker {...{
              end,
              ident,
              onChange,
              start,
            }} />
          </div>
        )}
      </div>
    );
  }

}
