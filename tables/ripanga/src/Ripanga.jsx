import React from 'react';
import PropTypes from 'prop-types';

import RipangaHeadRow from './RipangaHeadRow';
import RipangaBodyRows from './RipangaBodyRows';
import RipangaSidebar from './RipangaSidebar';

import baseStyles from './Ripanga.scss';
import defaultStyles from './RipangaDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

const SORT_DIRECTION = { ASC: 'asc', DESC: 'desc', NONE: 'none' };

let styles = {};

const i18n = {
  NO_RESULTS: 'No results found'
};

const checkedReducer = ids => Object.keys(ids).reduce((acc, id) =>
  (ids[id] === true ? Object.assign({}, acc, { [id]: true }) : acc), {});

export { SORT_DIRECTION };

export default class Ripanga extends React.Component {
  static propTypes = {
    columnDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
    idKey: PropTypes.string,
    onCheck: PropTypes.func,
    onMounted: PropTypes.func,
    onSort: PropTypes.func,
    renderCell: PropTypes.func.isRequired,
    renderEmpty: PropTypes.func,
    renderGroupTitle: PropTypes.func,
    renderSidebarBodyCell: PropTypes.func,
    renderSidebarGroupCell: PropTypes.func,
    renderSidebarHeadCell: PropTypes.func,
    rowHeight: PropTypes.number,
    scope: PropTypes.string.isRequired,
    showCheckboxes: PropTypes.bool,
    sortState: PropTypes.shape(),
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    tableData: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  static defaultProps = {
    idKey: 'id',
    onCheck: () => {},
    onMounted: () => {},
    onSort: null,
    renderEmpty: null,
    renderGroupTitle: null,
    renderSidebarBodyCell: null,
    renderSidebarGroupCell: null,
    renderSidebarHeadCell: null,
    rowHeight: 48,
    showCheckboxes: false,
    sortState: { direction: SORT_DIRECTION.NONE, attribute: null },
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [defaultStyles, ...props.stylesheets]);

    const checkedIds = JSON.parse(sessionStorage.getItem(`${props.scope}/CHECKED`)) || {};
    const collapsedIds = JSON.parse(sessionStorage.getItem(`${props.scope}/COLLAPSED`)) || {};

    this.state = {
      allChecked: this.getAllChecked(props, checkedIds),
      allCollapsed: this.getAllCollapsed(collapsedIds),
      allGroupIds: this.getGroupIds(props.tableData),
      checkedIds,
      collapsedIds
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('table/checkAll', this.onCheckAll);
    window.addEventListener('table/checkOne', ({ detail: id }) => this.onRowCheck(id));
    window.addEventListener('table/uncheckAll', this.onUncheckAll);

    const state = this.state;
    state.checkedIds = checkedReducer(state.checkedIds);

    this.props.onMounted({ ...state });
  }

  componentWillReceiveProps(nextProps) {
    const allChecked = this.getAllChecked(nextProps, this.state.checkedIds);
    const allCollapsed = this.getAllCollapsed(this.state.collapsedIds);
    const allGroupIds = this.getGroupIds(nextProps.tableData);

    this.setState({ allChecked, allCollapsed, allGroupIds });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('table/checkAll', this.onCheckAll);
    window.removeEventListener('table/checkOne', id => this.onRowCheck(id));
    window.removeEventListener('table/uncheckAll', this.onUncheckAll);
  }

  onCollapse = (id) => {
    const { collapsedIds } = this.state;

    collapsedIds[id] = !collapsedIds[id];

    const allCollapsed = Object.values(collapsedIds).reduce((acc, v) => acc && v, true);

    this.setState({ collapsedIds, allCollapsed }, this.updateStorage);
  }

  onCollapseAll = () => {
    const allCollapsed = !this.state.allCollapsed;

    const collapsedIds = this.state.allGroupIds.reduce(
      (acc, id) => Object.assign(acc, { [id]: allCollapsed }), {});

    this.setState({ allCollapsed, collapsedIds }, this.updateStorage);
  }

  onRowCheck = (id) => {
    const { checkedIds } = this.state;

    checkedIds[id] = !checkedIds[id];

    const allChecked = this.getAllChecked(this.props, checkedIds);
    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  onGroupCheck = (groupId) => {
    const groupIds = this.props.tableData.find(d => d.key.key === groupId)
      .data
      .reduce((acc, row) => acc.concat(row[this.props.idKey]), []);

    const { checkedIds } = this.state;
    const groupIsChecked = groupIds.reduce((acc, id) => acc && checkedIds[id], true);
    groupIds.forEach((id) => { checkedIds[id] = !groupIsChecked; });

    const allChecked = this.getAllChecked(this.props, checkedIds);
    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  onCheckAll = () => {
    const allChecked = true;

    const checkedIds = this.props.tableData.reduce((acc, group) => {
      const groupIds = group.data.reduce(
        (acc2, item) => Object.assign({}, acc2, { [item[this.props.idKey]]: allChecked })
        , {});

      return Object.assign({}, acc, groupIds);
    }, {});

    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  onUncheckAll = () => {
    const allChecked = false;

    const checkedIds = this.props.tableData.reduce((acc, group) => {
      const groupIds = group.data.reduce(
        (acc2, item) => Object.assign({}, acc2, { [item[this.props.idKey]]: allChecked })
        , {});

      return Object.assign({}, acc, groupIds);
    }, {});

    this.setState({ allChecked, checkedIds }, this.updateStorage);
  }

  getGroupIds = tableData => tableData.reduce((acc, { key }) => {
    if (key !== undefined) {
      acc.push(key.key);
    }

    return acc;
  }, []);

  getAllChecked = (props, checkedIds) => props.tableData.reduce((acc, { data }) => {
    const groupIsAllChecked = data.reduce((acc2, item) =>
      acc2
        && (checkedIds[item[props.idKey]] !== undefined)
        && (checkedIds[item[props.idKey]] === true)
      , true);

    return acc && groupIsAllChecked;
  }, true);

  getAllCollapsed = collapsedIds => Object.values(collapsedIds).every(id => id);

  updateStorage = () => {
    const { checkedIds, collapsedIds } = this.state;

    this.props.onCheck(checkedReducer(checkedIds));

    sessionStorage.setItem(`${this.props.scope}/CHECKED`, JSON.stringify(checkedIds));
    sessionStorage.setItem(`${this.props.scope}/COLLAPSED`, JSON.stringify(collapsedIds));
  }

  render() {
    const {
      columnDefinitions,
      idKey,
      onSort,
      renderCell,
      renderEmpty,
      renderGroupTitle,
      renderSidebarBodyCell,
      renderSidebarGroupCell,
      renderSidebarHeadCell,
      rowHeight,
      showCheckboxes,
      sortState,
      tableData
    } = this.props;

    const {
      allChecked,
      allCollapsed,
      checkedIds,
      collapsedIds
    } = this.state;

    const showGroups = (tableData.length > 0 && tableData[0].key !== undefined);

    if (tableData.length === 0) {
      if (renderEmpty) {
        return renderEmpty();
      }

      return (
        <h3 className='no-borders padding-top empty_table empty_graphic'>
          <img
            alt='Empty Table'
            src='/assets/no_results_illustration.svg'
            className='text-align-center empty_table_graphic'
          />
          <span className='empty_table_label'>{i18n.NO_RESULTS}</span>
        </h3>
      );
    }

    return (<div className={styles.contentContainer}>
      <RipangaSidebar
        {
        ...{
          collapsedIds,
          idKey,
          renderSidebarBodyCell,
          renderSidebarHeadCell,
          renderSidebarGroupCell,
          showGroups,
          styles,
          tableData
        }
        }
      />
      <div className={styles.tableContainer} ref={(el) => { this.tableContainer = el; }}>
        <div className={styles.table} ref={(el) => { this.table = el; }}>
          <RipangaHeadRow
            {
            ...{
              allChecked,
              allCollapsed,
              className: styles.tableHead,
              columnDefinitions,
              idKey,
              onCheckAll: this.onCheckAll,
              onCollapseAll: this.onCollapseAll,
              onScroll: this.onScroll,
              onScrollTrack: this.onScrollTrack,
              onUncheckAll: this.onUncheckAll,
              onSort,
              showGroups,
              showCheckboxes,
              sortState,
              styles,
              tableData
            }
            }
          />
          <div className={styles.tableBody}>
            { RipangaBodyRows({
              checkedIds,
              collapsedIds,
              columnDefinitions,
              idKey,
              onCollapse: this.onCollapse,
              onGroupCheck: this.onGroupCheck,
              onRowCheck: this.onRowCheck,
              renderCell,
              renderGroupTitle,
              rowHeight,
              showCheckboxes,
              showGroups,
              styles,
              tableData
            }) }
          </div>
        </div>
      </div>
    </div>);
  }
}
