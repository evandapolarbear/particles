import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import baseStyles from './Maramataka.scss';
import composeStyles from '../../../shared/stylesheetComposer';
import generateId from '../../../shared/generateId';
import { dayNames, monthNames, validDateFormats, fullDateFormat, longDateFormat } from './helpers';

const i18n = window.I18n || {};

export default class Maramataka extends React.Component {
  static propTypes = {
    closeOnSelect: PropTypes.bool,
    onClear: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    value: PropTypes.shape(),
    showDateRange: PropTypes.bool,
    dateInputFormat: PropTypes.oneOf(['full', 'long', 'short'])
  };

  static defaultProps = {
    closeOnSelect: true,
    onClear: () => { },
    stylesheets: [],
    value: { day: '', month: '', year: '' },
    showDateRange: false,
    dateInputFormat: 'short'
  };

  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, [...props.stylesheets]);
    this.guid = generateId();

    const d = new Date();

    // moment.locale('es');

    this.state = {
      active: { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() },
      days: { previous: [], active: [], next: [] },
      errors: { day: false, month: false, year: false },
      expanded: false,
      selected: { day: null, month: null, year: null },
      value: { day: props.value.day * 1, month: props.value.month * 1, year: props.value.year * 1 },
      dateRangeTypeSelection: 'single',
      today: d,
      dateRange: { from: '', to: '' },
      dateRangeErrors: { from: false, to: false },
      formattedDate: { full: '' },
      dateRangeStep: 0
    };
  }

  componentWillMount() {
    this.onInputChange();
    window.addEventListener('click', this.onBlur);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onBlur);
  }

  onBlur = () => {
    const expanded = (this.state.guid === this.guid);
    this.setState({ expanded, guid: null });
  }

  onHeadClick = () => {
    this.setState({ expanded: true, guid: this.guid });
  }

  onLeftArrowClick = (evt) => {
    evt.stopPropagation();

    const { active } = this.state;

    if (active.month === 0) {
      active.month = 11;
      active.year -= 1;
    } else {
      active.month -= 1;
    }

    this.setState({ active }, this.updateDateArrays);
  }

  onRightArrowClick = (evt) => {
    evt.stopPropagation();

    const { active } = this.state;

    if (active.month === 11) {
      active.month = 0;
      active.year += 1;
    } else {
      active.month += 1;
    }

    this.setState({ active }, this.updateDateArrays);
  }

  onClear = (event, type) => {
    event.stopPropagation();

    const { dateRange } = this.state;
    let step;

    dateRange[type] = '';

    if (type === 'from') {
      step = 0;
    } else {
      step = 1;
    }

    this.setState(
      state => ({
        ...state,
        value: { day: '', month: '', year: '' },
        dateRange,
        dateRangeStep: step
      }),
      this.props.onClear
    );
  }

  onDayClick = (evt) => {
    evt.stopPropagation();

    const target = evt.currentTarget;

    let { day, month, year } = target.dataset;

    day *= 1;
    month *= 1;
    year *= 1;

    if (month === 12) {
      month = 0;
      year += 1;
    } else if (month === -1) {
      month = 11;
      year -= 1;
    }

    const selected = { day, month, year };
    const value = { day, month: month + 1, year };
    let formattedDate;
    const selectedDate = `${month + 1} ${day} ${year}`;
    if (this.state.dateRangeTypeSelection === 'single') {
      formattedDate = { full: moment(selectedDate, 'M D YYYY').format(fullDateFormat) };
      this.setState({ selected, value, formattedDate, expanded: !this.props.closeOnSelect }, () => {
        this.updateDateArrays();
        this.props.onSelect(value);
      });
    }

    if (this.state.dateRangeTypeSelection === 'range') {
      const { dateRange, dateRangeStep } = this.state;
      let expanded;
      if (dateRangeStep === 0) {
        const from = moment(selectedDate, 'M D YYYY').format(longDateFormat);
        let nextStep;
        if (dateRange.to !== '') {
          if (moment(selectedDate, 'M D YYYY').diff(moment(dateRange.to, longDateFormat)) < 0) {
            dateRange.to = moment(from, longDateFormat).diff(moment(dateRange.to, longDateFormat)) > 0 ? from : dateRange.to;
            dateRange.from = moment(from, longDateFormat).diff(moment(dateRange.to, longDateFormat)) < 0 ? from : dateRange.to;
            nextStep = 0;
            expanded = true;
            formattedDate = { full: moment(dateRange.from, longDateFormat).format('MM/DD/YY') + ' - ' + moment(dateRange.to, longDateFormat).format('MM/DD/YY') };
          } else {
            dateRange.to = moment(selectedDate, 'M D YYYY').format(longDateFormat);
            nextStep = 0;
            expanded = false;
            formattedDate = { full: moment(dateRange.from, longDateFormat).format('MM/DD/YY') + ' - ' + moment(dateRange.to, longDateFormat).format('MM/DD/YY') };
          }
        } else {
          dateRange.from = moment(selectedDate, 'M D YYYY').format(longDateFormat);
          nextStep = dateRangeStep + 1;
          expanded = true;
          formattedDate = { full: moment(selectedDate, 'M D YYYY').format(fullDateFormat) };
        }
        this.setState({ selected, value, dateRange, dateRangeStep: nextStep, formattedDate, expanded }, () => {
          this.updateDateArrays();
          this.props.onSelect(value);
        });
      }
      if (dateRangeStep === 1) {
        const to = moment(selectedDate, 'M D YYYY').format(longDateFormat);
        if (dateRange.from !== '') {
          dateRange.to = moment(dateRange.from, longDateFormat).diff(moment(to, longDateFormat)) > 0 ? dateRange.from : to;
          dateRange.from = moment(dateRange.from, longDateFormat).diff(moment(to, longDateFormat)) < 0 ? dateRange.from : to;
          expanded = false;
        }
        if (dateRange.from === '') {
          dateRange.to = to;
          expanded = true;
        }
        formattedDate = { full: moment(dateRange.from, longDateFormat).format('MM/DD/YY') + ' - ' + moment(dateRange.to, longDateFormat).format('MM/DD/YY') };
        this.setState({ selected, value, dateRange, expanded, dateRangeStep: 0, formattedDate }, () => {
          this.updateDateArrays();
          this.props.onSelect(value);
        });
      }
    }
  }

  onInputChange = () => {
    const { errors, value } = this.state;
    let { active, selected } = this.state;

    errors.day = !this.validateDay(value.day);
    errors.month = !this.validateMonth(value.month);
    errors.year = !this.validateYear(value.year);

    const valueIsValid =
      (errors.day === false && errors.month === false && errors.year === false);

    const valueIsEmpty =
      (value.day === '' || value.day === 0)
      && (value.month === '' || value.day === 0)
      && (value.year === '' || value.day === 0);

    if (valueIsEmpty) {
      errors.day = false;
      errors.month = false;
      errors.year = false;
    } else if (valueIsValid && !valueIsEmpty) {
      selected = { day: value.day, month: value.month - 1, year: value.year };
      active = { day: value.day, month: value.month - 1, year: value.year };
    } else {
      selected = { day: null, month: null, year: null };
    }

    this.setState({ active, errors, selected, value }, this.updateDateArrays);
  }

  onInputDay = (evt) => {
    const { value } = this.state;
    value.day = evt.target.value * 1;
    this.setState({ value }, this.onInputChange);
  }

  onInputMonth = (evt) => {
    const { value } = this.state;
    value.month = evt.target.value * 1;
    this.setState({ value }, this.onInputChange);
  }

  onInputYear = (evt) => {
    const { value } = this.state;
    value.year = evt.target.value * 1;
    this.setState({ value }, this.onInputChange);
  }

  onInputFreeDate = (evt) => {
    const { value, formattedDate } = this.state;
    formattedDate.full = evt.target.value;
    if (evt.target.value.length > 5) {
      const m = moment(evt.target.value, validDateFormats, 'en' || moment.locale(), true);
      if (m.isValid()) {
        value.day = m.date();
        value.month = m.month() + 1;
        value.year = m.year();
        formattedDate.full = m.format(fullDateFormat);
        this.setState({ value, formattedDate }, this.onInputChange);
      }
    }
    this.setState({ formattedDate });
  }

  onInputDateRange = (evt, type) => {
    const { dateRange } = this.state;
    dateRange[type] = evt.target.value;
    this.setState({ dateRange });
  }

  onInputDateRangeBlur = (type) => {
    const { value, dateRange, dateRangeErrors } = this.state;
    const m = moment(dateRange[type], validDateFormats, 'en' || moment.locale(), true);
    if (m.isValid()) {
      value.day = m.date();
      value.month = m.month() + 1;
      value.year = m.year();
      dateRange[type] = m.format(longDateFormat);
      dateRangeErrors[type] = false;
      this.setState({ value, dateRange, dateRangeErrors }, this.onInputChange);
    } else {
      dateRangeErrors[type] = true;
      this.setState({ value, dateRange, dateRangeErrors }, this.onInputChange);
    }
  }

  validateDay = (day) => {
    if (day === null) {
      return true;
    }

    const { active } = this.state;
    const daysInActiveMonth = new Date(active.year, active.month + 1, 0).getDate();

    if (day < 1 || day > daysInActiveMonth) {
      return false;
    }

    return true;
  }

  validateMonth = (month) => {
    if (month === null) {
      return true;
    }

    if (month < 1 || month > 12) {
      return false;
    }

    return true;
  }

  validateYear = (year) => {
    if (year === null) {
      return true;
    }

    return true;
  }

  updateDateArrays() {
    const { year, month } = this.state.active;

    const daysInPreviousMonth = new Date(year, month, 0).getDate();
    const daysInActiveMonth = new Date(year, month + 1, 0).getDate();

    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month, daysInActiveMonth);

    const firstSunday = new Date(year, month, 1 - firstDate.getDay());
    const lastSaturday = new Date(year, month, daysInActiveMonth + (6 - lastDate.getDay()));

    const previous = [];
    const active = [];
    const next = [];

    if (firstSunday.getDate() > 7) {
      for (let i = firstSunday.getDate(); i <= daysInPreviousMonth; i += 1) {
        previous.push(i);
      }
    }

    for (let i = 1; i <= daysInActiveMonth; i += 1) {
      active.push(i);
    }

    if (lastSaturday.getDate() < 7) {
      for (let i = 1; i <= lastSaturday.getDate(); i += 1) {
        next.push(i);
      }
    }

    this.setState({ days: { previous, active, next } });
  }

  renderHead(dateInputFormat) {
    const { errors, expanded, value, today, formattedDate } = this.state;

    const button = (value.day || value.month || value.year)
      ? <button className={this.styles.clearButton} onClick={this.onClear} />
      : null;

    const short = (
      <div
        className={cx(this.styles.head, { [this.styles.expanded]: expanded })}
        onClick={this.onHeadClick}
      >
        <input
          className={cx(this.styles.input,
            { [this.styles.invalid]: errors.month })}
          max='12'
          min='1'
          onChange={this.onInputMonth}
          onFocus={this.onInputFocus}
          placeholder='mm'
          step='1'
          type='number'
          value={value.month || ''}
        />

        <span className={this.styles.slash}>/</span>

        <input
          className={cx(this.styles.input, { [this.styles.invalid]: errors.day })}
          max='31'
          min='1'
          onChange={this.onInputDay}
          onFocus={this.onInputFocus}
          placeholder='dd'
          step='1'
          type='number'
          value={value.day || ''}
        />

        <span className={this.styles.slash}>/</span>

        <input
          className={cx(this.styles.input, this.styles.inputYear,
            { [this.styles.invalid]: errors.year })}
          max='9999'
          min='1'
          onChange={this.onInputYear}
          onFocus={this.onInputFocus}
          placeholder='yyyy'
          step='1'
          type='number'
          value={value.year || ''}
        />

        {button}
      </div>
    );

    const full = (
      <div
        className={cx(this.styles.head, { [this.styles.expanded]: expanded })}
        onClick={this.onHeadClick}
      >
        <input
          className={cx(this.styles.input, { [this.styles.full]: dateInputFormat === 'full' })}
          onChange={this.onInputFreeDate}
          placeholder={moment(today).format(fullDateFormat)}
          max='10'
          type='text'
          value={formattedDate.full}
        />
        {button}
      </div>
    );

    switch (dateInputFormat) {
      case 'short':
        return short;
      case 'full':
        return full;
      // case 'long':
      //   return long;
      default:
        return 'short';
    }
  }

  renderDateRange() {
    const { showDateRange } = this.props;
    const { dateRange, dateRangeErrors, dateRangeStep } = this.state;

    const renderRangeInput = (
      <div className={this.styles.dateRangeInputsContainer}>
        <div className={cx(this.styles.inputContainer)}>
          <input
            className={cx(this.styles.inputs, { [this.styles.invalid]: dateRangeErrors.from, [this.styles.selected]: dateRangeStep === 0 })}
            onChange={e => this.onInputDateRange(e, 'from')}
            onBlur={() => this.onInputDateRangeBlur('from')}
            onFocus={() => this.setState({ dateRangeStep: 0 })}
            type='text'
            value={dateRange.from}
            placeholder='Start Date'
          />
          <button className={this.styles.clearButton} onClick={e => this.onClear(e, 'from')} />
        </div>
        <div style={{ width: 10 }} />
        <div className={cx(this.styles.inputContainer)}>
          <input
            className={cx(this.styles.inputs, { [this.styles.invalid]: dateRangeErrors.to, [this.styles.selected]: dateRangeStep === 1 })}
            onChange={e => this.onInputDateRange(e, 'to')}
            onBlur={() => this.onInputDateRangeBlur('to')}
            onFocus={() => this.setState({ dateRangeStep: 1 })}
            type='text'
            value={dateRange.to}
            placeholder='End Date'
          />
          <button className={this.styles.clearButton} onClick={e => this.onClear(e, 'to')} />
        </div>
      </div>
    );

    return showDateRange && (
      <div>
        <div className={this.styles.dateRangeBtnGroup}>
          <button
            className={cx(this.styles.dateRangeBtn, { [this.styles.selected]: this.state.dateRangeTypeSelection === 'single' })}
            onClick={() => this.setState({ dateRangeTypeSelection: 'single' })}
          >
            Single Day
          </button>
          <button
            className={cx(this.styles.dateRangeBtn, { [this.styles.selected]: this.state.dateRangeTypeSelection === 'range' })}
            onClick={() => this.setState({ dateRangeTypeSelection: 'range' })}
          >
            Date Range
          </button>
        </div>
        {this.state.dateRangeTypeSelection === 'range' && renderRangeInput}
      </div>
    );
  }

  renderDays() {
    const { active, days, selected, dateRangeTypeSelection, dateRange } = this.state;

    const result = [];

    days.previous.forEach((day) => {
      let isSelected;

      if (dateRangeTypeSelection === 'single') {
        isSelected = (day === selected.day &&
          (active.month === (selected.month + 1) ||
            active.month + 11 === selected.month) &&
          (active.year === selected.year ||
            active.year - 1 === selected.year)
        );
      } else {
        isSelected = ((dateRange.from !== '' && dateRange.to !== '') &&
          (
            moment(`${active.month > 0 ? active.month : active.month + 12} ${day} ${active.year}`, 'M D YYYY').isBetween(moment(dateRange.from, longDateFormat), moment(dateRange.to, longDateFormat), null, '[]')
          )
        );
      }

      result.push(
        <div
          className={cx(this.styles.dayPrevious, { [this.styles.selected]: isSelected })}
          data-day={day}
          data-month={active.month - 1}
          data-year={active.year}
          key={`prev-${day}`}
          onClick={this.onDayClick}
        >
          {day}
        </div>
      );
    });

    days.active.forEach((day) => {
      // const isSelected = (day === selected.day &&
      //   active.month === selected.month &&
      //   active.year === selected.year);

      let isSelected;

      if (dateRangeTypeSelection === 'single') {
        isSelected = (day === selected.day &&
          active.month === selected.month &&
          active.year === selected.year
        );
      } else {
        isSelected = ((dateRange.from !== '' && dateRange.to !== '') &&
          moment(`${active.month + 1} ${day} ${active.year}`, 'M D YYYY').isBetween(moment(dateRange.from, longDateFormat), moment(dateRange.to, longDateFormat), null, '[]')
        );
      }

      result.push(
        <div
          className={cx(this.styles.dayActive, { [this.styles.selected]: isSelected })}
          data-day={day}
          data-month={active.month}
          data-year={active.year}
          key={`active-${day}`}
          onClick={this.onDayClick}
        >
          {day}
        </div>
      );
    });

    days.next.forEach((day) => {
      let isSelected;

      if (dateRangeTypeSelection === 'single') {
        isSelected = (day === selected.day &&
          (active.month === (selected.month - 1) ||
            active.month - 11 === selected.month) &&
          (active.year === selected.year ||
            active.year + 1 === selected.year)
        );
      } else {
        isSelected = ((dateRange.from !== '' && dateRange.to !== '') &&
          moment(`${active.month >= 0 && active.month < 11 ? active.month + 2 : 1} ${day} ${active.month < 11 ? active.year : active.year + 1}`, 'M D YYYY').isBetween(moment(dateRange.from, longDateFormat), moment(dateRange.to, longDateFormat), null, '[]')
        );
      }

      result.push(
        <div
          className={cx(this.styles.dayNext, { [this.styles.selected]: isSelected })}
          data-day={day}
          data-month={active.month + 1}
          data-year={active.year}
          key={`next-${day}`}
          onClick={this.onDayClick}
        >
          {day}
        </div>
      );
    });

    return result;
  }

  render() {
    const { active, expanded } = this.state;

    const head = this.renderHead(this.props.dateInputFormat);

    const dateRange = this.renderDateRange();

    const days = this.renderDays();

    const dayTitles = dayNames.map(name =>
      <div key={`daytitle-${name}`} className={this.styles.dayTitle}>{name.substr(0, 1)}</div>);

    return (
      <div className={this.styles.container}>
        {head}
        <div className={this.styles.dropdownContainer} onClick={evt => evt.stopPropagation()}>
          <div className={cx(this.styles.dropdown, { [this.styles.expanded]: expanded })}>
            {dateRange}
            <div className={this.styles.month}>
              <div className={this.styles.leftArrow} onClick={this.onLeftArrowClick} />
              <div className={this.styles.monthTitle}>{monthNames[active.month]} {active.year}</div>
              <div className={this.styles.rightArrow} onClick={this.onRightArrowClick} />
            </div>
            <div className={this.styles.days}>
              {dayTitles}
              {days}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
