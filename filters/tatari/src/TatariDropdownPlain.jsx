import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

let counter = 0;

export default class TatariDropdownPlain extends React.Component {
  componentDidUpdate() {
    const { currentIndex } = this.props;

    if (this.props.isExpanded && this.focusedItem && currentIndex > -1) {
      this.focusedItem.focus();
    }
  }

  render() {
    const {
      keyListeners,
      currentIndex,
      data,
      i18n,
      isExpanded,
      isLoading,
      onChange,
      onExpand,
      styles
    } = this.props;

    counter = 0;

    const items = data.reduce((acc, item) => {
      const focusedItem = currentIndex === counter;

      if (item.hidden !== true) {
        acc.push(<div
          className={cx(styles.inactiveItem, { [styles.keyFocus]: focusedItem })}
          data-key={item.key}
          key={`item-${item.key}`}
          onClick={onChange}
          onKeyDown={onChange}
          ref={(el) => { if (focusedItem) this.focusedItem = el; }}
          tabIndex={-1}
        >
          {item.value}
        </div>);
        counter += 1;
      }

      return acc;
    }, []);

    const text = <div className={styles.dropdownTitle}>{i18n.filter_placeholder}</div>;

    const loading = (isLoading
      ? <span className={styles.dropdownLoading} />
      : null);

    const caret = (isLoading || items.length === 0)
      ? null
      : (<div className={styles.dropdownCaret}>
        <span
          className={cx('fa', 'fa-caret-down', styles.arrow,
          { [styles.expanded]: isExpanded })}
        />
      </div>);

    return (<div className={styles.dropdownContainer}>
      <div
        className={cx(styles.dropdownHead, { [styles.expanded]: isExpanded })}
        data-key={'inactive'}
        onClick={onExpand}
        onKeyDown={keyListeners}
        tabIndex={-1}
      >
        {text}
        {caret}
        {loading}
      </div>

      <div
        className={cx(styles.dropdownBody, { [styles.expanded]: isExpanded })}
        onKeyDown={keyListeners}
        tabIndex={-1}
      >
        {items}
      </div>
    </div>);
  }
}

TatariDropdownPlain.propTypes = {
  keyListeners: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    endpoint: PropTypes.string,
    key: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
  i18n: PropTypes.shape(),
  isExpanded: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  styles: PropTypes.shape().isRequired
};

TatariDropdownPlain.defaultProps = {
  i18n: {},
  isExpanded: false,
  isLoading: false
};
