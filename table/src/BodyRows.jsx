import PropTypes from 'prop-types';

import GroupRow from './GroupRow';
import BodyRow from './BodyRow';

const BodyRows = ({
  checkedIds,
  collapsedIds,
  columnDefinitions,
  idKey,
  onCollapse,
  onGroupCheck,
  onRowCheck,
  renderCell,
  renderGroupTitle,
  rowHeight,
  showCheckboxes,
  showGroups,
  styles,
  tableData
}) => {
  const renderBodyRows = (group) => {
    if (group.key && collapsedIds[group.key.key] === true) {
      return [];
    }

    return group.data.map(rowData => (BodyRow({
      columnDefinitions,
      idKey,
      isChecked: checkedIds[rowData[idKey]],
      onCheck: onRowCheck,
      renderCell,
      rowData,
      rowHeight,
      showCheckboxes,
      showGroups,
      styles
    })));
  };

  const renderGroupRow = (group) => {
    const isChecked = group.data.reduce(
      (acc, rowData) => acc && (checkedIds[rowData[idKey]] || false), true);

    return (GroupRow({
      groupData: group,
      isChecked,
      isCollapsed: collapsedIds[group.key.key],
      isDisabled: group.data.length === 0,
      onCollapse,
      onCheck: onGroupCheck,
      renderGroupTitle,
      showCheckboxes,
      showGroups,
      styles
    }));
  };

  const renderBodyGroups = () => {
    const groups = [];
    tableData.forEach((group) => {
      groups.push(renderGroupRow(group));
      groups.push(...renderBodyRows(group));
    });

    return groups;
  };

  return (showGroups ? renderBodyGroups() : renderBodyRows(tableData[0]));
};

/* eslint-disable react/require-default-props */
BodyRows.propTypes = {
  checkedIds: PropTypes.shape(),
  columnDefinitions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCollapse: PropTypes.func,
  collapsedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
  idKey: PropTypes.string,
  onGroupCheck: PropTypes.func,
  onRowCheck: PropTypes.func,
  renderCell: PropTypes.func,
  renderGroupTitle: PropTypes.func,
  showCheckboxes: PropTypes.bool.isRequired,
  showGroups: PropTypes.bool.isRequired,
  styles: PropTypes.shape().isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default BodyRows;
