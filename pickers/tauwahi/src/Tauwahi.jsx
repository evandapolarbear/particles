import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import baseStyles from './Tauwahi.scss';
import composeStyles from '../../../shared/stylesheetComposer';

export default class Tauwahi extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    limit: PropTypes.number,
    onClose: PropTypes.func,
    onCreate: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape())
  };

  static defaultProps = {
    limit: 8,
    onClose: null,
    stylesheets: []
  };

  // TODO transition on item selected
  // TODO text filter on existing locations

  constructor(props) {
    super(props);
    this.styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.groupedData = props.data.reduce((acc, val) => {
      const parent = (Number.isInteger(val.parent_id) ? val.parent_id : 'root');
      return Object.assign({}, acc, { [parent]: (acc[parent] ? acc[parent].concat(val) : [val]) });
    }, {});

    this.memoizedData = props.data.reduce((acc, val) =>
      (Object.assign({}, acc, { [val.id]: val })), {});

    const maxId = props.data.reduce((acc, val) => (val.id > acc ? acc + 1 : acc), 0);

    this.state = {
      currentParent: 'root',
      maxId,
      stack: []
    };
  }

  onAddNew = () => {
    const { current_parent, maxId, stack } = this.state;
    const nextId = (maxId + 1).toString();

    this.memoizedData[nextId] = { id: nextId, name: this.input.value };
    stack.push(nextId);
    this.input.value = '';

    this.setState({ currentParent: nextId, maxId: nextId, stack });
  }

  onClose = () => {
    this.props.onClose();
  }

  onCreate = () => {
    const names = this.state.stack.map(id => this.memoizedData[id].name);
    this.props.onCreate(names);
  }

  onItemClick = (evt) => {
    const { stack } = this.state;
    const currentParent = evt.target.dataset.id;
    stack.push(currentParent);

    this.setState({ currentParent, stack });
  }

  onInputSubmit = (evt) => {
    if (evt.keyCode === 13) {
      this.onAddNew();
    }
  }

  onTierClick = (evt) => {
    const { stack } = this.state;

    while (stack.length > 0 && stack.pop() !== evt.target.dataset.id);

    const currentParent = stack[stack.length - 1] || 'root';

    this.setState({ currentParent, stack });
  }

  render() {
    const { currentParent, stack } = this.state;
    const { limit } = this.props;

    const isAddNewDisabled = (stack.length === limit);
    const isListDisabled = (stack.length === limit || this.groupedData[currentParent] === undefined);

    const btnAdd = (isAddNewDisabled
      ? null
      : <button className={cx('fa', 'fa-plus', this.styles.btnAdd)} onClick={this.onAddNew} />);

    const items = isListDisabled
      ? null
      : this.groupedData[currentParent].map(item => (
        <option
          className={this.styles.item}
          data-id={item.id}
          key={item.id}
          onClick={this.onItemClick}
        >
          {item.name}
        </option>
      ));

    const tierLabels = stack
      .map((id, index) => (
        <div className={this.styles.tier}>
          <div className={this.styles.number}>{`Tier ${index + 1}`}</div>
          <div className={this.styles.value}>{this.memoizedData[id].name}</div>
          <div
            className={this.styles.close}
            data-id={id}
            onClick={this.onTierClick}
          >
            &times;
          </div>
        </div>
      ))
      .reduce((acc, v) => (acc === null
        ? [v]
        : [...acc, <div className={cx('fa', 'fa-chevron-right', this.styles.caret)} />, v])
      , null);

    const msgMax = (isAddNewDisabled
      ? <div className={this.styles.msgMax}>You've reached the limit of locations.</div>
      : null);

    return (<div className={this.styles.container}>
      <div className={this.styles.header}>
        <div className={this.styles.text}>Add a new location</div>
        <div className={cx('fa', 'fa-times', this.styles.close)} onClick={this.onClose} />
      </div>

      <div className={this.styles.body}>
        <div className={this.styles.controls}>
          <div className={this.styles.addnew}>
            <input
              className={cx(this.styles.input, { [this.styles.disabled]: isAddNewDisabled })}
              disabled={isAddNewDisabled}
              onKeyUp={this.onInputSubmit}
              placeholder='Create a new location'
              ref={(el) => { this.input = el; }}
            />

            {btnAdd}
          </div>

          <hr className={this.styles.divider} />

          <div className={cx(this.styles.list, { [this.styles.disabled]: isListDisabled })}>

            {/* <input
              className={cx(this.styles.input, { [this.styles.disabled]: isAddNewDisabled })}
              placeholder='Or, add to an existing location'
            /> */}
            <div className={this.styles.msgExisting}>Or, add to an existing location: </div>

            <select size='5' className={this.styles.select} disabled={isListDisabled}>
              {items}
            </select>
          </div>
        </div>

        <div className={this.styles.tiers}>
          {tierLabels}
          {msgMax}
        </div>
      </div>

      <div className={this.styles.footer}>
        <button className={this.styles.btnCancel} onClick={this.onClose}>Cancel</button>
        <button className={this.styles.btnCreate} onClick={this.onCreate}>Create</button>
      </div>
    </div>);
  }
}
