import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import baseStyles from './SearchBar.scss';
import composeStyles from '../../shared/stylesheetComposer';

let styles = {};

export default class SearchBar extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    placeholder: PropTypes.string,
    value: PropTypes.string
  };

  static defaultProps = {
    stylesheets: [],
    placeholder: 'Search',
    value: ''
  };

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.state = {
      value: props.value
    };
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }

  handleClear = () => {
    const value = '';
    this.setState({ value });
    this.props.onSubmit(value);
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.value);
  }

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div className={styles.searchContainer}>
        <input
          value={this.state.value}
          className={styles.input}
          type='text'
          placeholder={this.props.placeholder}
          onSubmit={this.onSubmit}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
        />

        <div
          className={cx(styles.btnSubmit, 'fa', 'fa-search')}
          onClick={this.handleSubmit}
        />

        <div
          className={cx(styles.btnClear, 'fa', 'fa-times', { [styles.hidden]: !this.state.value })}
          onClick={this.handleClear}
        />
      </div>
    );
  }
}
