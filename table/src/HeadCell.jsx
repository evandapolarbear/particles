import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { SORT_DIRECTION } from './Table';

const TableHeadCell = ({
  def,
  onSort,
  sortState,
  styles
}) => {
  const onClick = () => {
    if (def.sortable === false) {
      return;
    }

    onSort(def);
  };

  let arrow = null;
  if (sortState.attribute && sortState.attribute === def.sortKey && sortState.direction
    !== SORT_DIRECTION.NONE) {
    arrow = (sortState.direction === SORT_DIRECTION.DESC
      ? <i className={cx('fa fa-long-arrow-down', styles.sortArrow)} />
      : <i className={cx('fa fa-long-arrow-up', styles.sortArrow)} />);
  }

  if (!def.key) {
    // eslint-disable-next-line
    console.error(`Column definition for "${def.label}" has no 'key' property. This might cause the error below.`);
  }

  return (
    <div
      className={cx(styles.headCell, styles[`w${def.width}px`], { [styles.sortable]: def.sortable })}
      key={`head-${def.key}`}
      onClick={onClick}
    >
      <span className={styles.label}>{def.label}</span>
      {arrow}
    </div>
  );
};

TableHeadCell.propTypes = {
  def: PropTypes.shape().isRequired,
  onSort: PropTypes.func.isRequired,
  sortState: PropTypes.shape().isRequired,
  styles: PropTypes.shape().isRequired
};

export default TableHeadCell;
