import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { get, patch, destroy } from './TatariApi';
import TatariDropdownPlain from './TatariDropdownPlain';
import TatariDropdownCheckboxes from './TatariDropdownCheckboxes';

import baseStyles from './Tatari.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Tatari extends React.Component {
  static propTypes = {
    filterOptions: PropTypes.func,
    i18n: PropTypes.shape(),
    onComplete: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    urls: PropTypes.shape({
      available: PropTypes.string.isRequired,
      patch: PropTypes.string,
      saved: PropTypes.string,
      delete: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    filterOptions: item => item,
    i18n: {},
    stylesheets: []
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, [...props.stylesheets]);

    this.state = {
      activeFilters: [],
      currentIndex: -1,
      expanded: {},
      hiding: {},
      inactiveFilters: [],
      loading: {},
      options: {},
      savedFilters: [],
      totalCurrentItems: 0
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);

    Promise.all([
      get(this.props.urls.available),
      get(this.props.urls.saved)
    ])
    .then(([{ data: filterData }, { data: stored }]) => {
      const savedFilters = Object.keys(stored).reduce((acc, item) => (
        stored[item] && stored[item].filter(Boolean).length
        ? Object.assign(acc, { [item]: stored[item] })
        : acc
      ), {});

      this.setState({ savedFilters });

      const url = window.location.href.split('?');
      const params = qs.parse(url[1]);
      const previousFilters = params.filters || savedFilters;
      const availableFilters = this.props.filterOptions(filterData);

      const activeFilters = availableFilters.reduce((acc, filter, index) => {
        if (previousFilters[filter.key] !== undefined && previousFilters[filter.key] !== null) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      const inactiveFilters = availableFilters.reduce((acc, filter, index) => {
        if (previousFilters[filter.key] === undefined || previousFilters[filter.key] === null) {
          acc.push(Object.assign(filter, { index }));
        }

        return acc;
      }, []);

      this.setState({ inactiveFilters, activeFilters, loading: {} }, () => {
        this.updateUrl();
        this.props.onComplete();
      });
    })
    .catch(e => { console.error(e); }) // eslint-disable-line
  }

  onExpand = (evt) => {
    evt.stopPropagation();
    const key = evt.currentTarget.dataset.key;

    if (key !== 'inactive' && !(this.state.options[key] && this.state.options[key].length)) {
      this.setState({ loading: { [key]: true } }, () => {
        const filter = this.state.activeFilters.find(item => item.key === key);

        get(filter.endpoint)
        .then(({ data }) => {
          const options = data.map((item) => {
            if (this.state.savedFilters[key].includes(item.key)) {
              return Object.assign(item, { checked: true });
            }

            return item;
          });

          this.setState({
            loading: { [key]: false },
            options: { [key]: options }
          });
        });
      });
    }

    if (this.state.loading[key]) {
      return;
    }

    const expandedStatus = !this.state.expanded[key];

    if (expandedStatus === false && key !== 'inactive') {
      this.onBlur();
    }

    const expanded = { [key]: expandedStatus };

    this.setState({ currentIndex: -1, expanded }, () => {
      this.setState({ totalCurrentItems: this.getTotalCurrentItems() });
    });
  }

  onBlur = () => {
    const activeExpandedCount = this.state.activeFilters.reduce((acc, filter) =>
      (this.state.expanded[filter.key] === true ? acc + 1 : acc), 0);

    if (activeExpandedCount) {
      this.updateUrl();
      this.removeEmptyActive();
      this.saveOptions();
    }

    this.setState({ currentIndex: -1, expanded: {}, totalCurrentItems: 0 });
  }

  onSearch = (evt) => {
    evt.stopPropagation();

    const value = evt.target.value.toLowerCase();
    const key = evt.target.dataset.key;

    const options = this.state.options;

    const filteredOptions = options[key].map(option => Object.assign(option,
      { hidden: (option.value.toLowerCase().indexOf(value) === -1) }));

    const totalCurrentItems = options[key].reduce((acc, filter) =>
      (!filter.hidden ? acc + 1 : acc), 0);

    options[key] = filteredOptions;

    this.setState({ totalCurrentItems, options });
  }

  getTotalCurrentItems = () => {
    let { totalCurrentItems } = this.state;

    const { expanded, inactiveFilters, options } = this.state;

    const currentItems = options[Object.keys(expanded)[0]];

    if (expanded.inactive) {
      totalCurrentItems = inactiveFilters.length;
    } else if (currentItems) {
      totalCurrentItems = currentItems.length;
    }

    return totalCurrentItems;
  }

  keyListeners = (evt) => {
    let { currentIndex } = this.state;
    const { expanded, totalCurrentItems } = this.state;

    const isExpanded = Object.values(expanded)[0];

    const minimum = expanded.inactive ? 0 : -1;

    if (evt.keyCode === 38 && isExpanded) {
      evt.preventDefault();
      if (currentIndex > minimum) {
        currentIndex -= 1;
        this.setState({ currentIndex });
      }
    } else if (evt.keyCode === 40 && isExpanded) {
      evt.preventDefault();
      if (currentIndex < totalCurrentItems - 1) {
        currentIndex += 1;
        this.setState({ currentIndex });
      }
    } else if (evt.keyCode === 27 && isExpanded) {
      this.onBlur();
    }
  }

  updateUrl = () => {
    const url = window.location.href.split('?');
    const params = qs.parse(url[1]);
    params.filters = this.createPayload();
    params.page = 1;

    const newParams = qs.stringify(params, { arrayFormat: 'brackets' });

    history.pushState(history.state, '', `${url[0]}?${newParams}`);
  };

  createPayload = () => {
    const { activeFilters, options, savedFilters } = this.state;

    const reduceSingle = (acc, value) => {
      if (value.key && value.checked === true) {
        acc.push(value.key);
      }

      return acc;
    };

    const reduceAll = (acc, filter) => {
      let checked = options[filter.key] || [];

      if (checked.length === 0 && savedFilters[filter.key]) {
        checked = savedFilters[filter.key].map(item => ({ checked: true, key: item }));
      }

      return Object.assign(acc, { [filter.key]: checked.reduce(reduceSingle, []) });
    };

    return activeFilters.reduce(reduceAll, {});
  }

  saveOptions = () => {
    if (!this.props.urls.patch) {
      this.props.onComplete();
      return;
    }

    const payload = { filters: this.createPayload() };

    const { savedFilters } = this.state;
    const newFilters = Object.keys(payload.filters);
    const storedFilters = Object.keys(savedFilters);
    const isFiltersSame = newFilters.reduce((acc, key) => acc && storedFilters.includes(key), true);
    const isFiltersSameLength = storedFilters.length === newFilters.length;

    if (!(isFiltersSame && isFiltersSameLength)) {
      const newSaved = Object.assign(payload.filters, savedFilters);

      if (newFilters.length) {
        patch(this.props.urls.patch, payload)
        .then(this.props.onComplete)
        .then(() => this.setState({ savedFilters: newSaved }));
      } else {
        destroy(this.props.urls.delete)
        .then(this.props.onComplete)
        .then(() => this.setState({ savedFilters: newSaved }));
      }
    }
  }

  checkOne = (evt) => {
    const isExpanded = Object.values(this.state.expanded)[0];

    if (isExpanded && (evt.type === 'change' || evt.keyCode === 13)) {
      evt.stopPropagation();

      let key;
      let filterKey;

      const { options } = this.state;

      if (evt.type === 'change') {
        key = evt.currentTarget.dataset.key;
        filterKey = evt.currentTarget.dataset.filterKey;
      } else if (evt.keyCode === 13) {
        key = evt.currentTarget.children[0].dataset.key;
        filterKey = evt.currentTarget.children[0].dataset.filterKey;
      }

      options[filterKey] = options[filterKey].reduce((acc, option) => {
        option.key.toString() === key
          ? acc.push(Object.assign(option, { checked: !option.checked }))
          : acc.push(option);

        return acc;
      }, []);

      this.setState({
        options,
        expanded: Object.assign(this.state.expanded, { [filterKey]: true })
      });
    }
  }

  checkAll = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const { options } = this.state;

    options[key].reduce((acc, option) => {
      if (option.hidden === true) {
        return acc;
      }

      return acc.concat(Object.assign(option, { checked: true }));
    }, []);

    this.setState({ options });
  }

  checkNone = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const options = this.state.options;

    options[key].reduce((acc, option) =>
      Object.assign(option, { checked: false }), []);

    this.setState({ options });
  }

  addActive = (evt) => {
    const isExpanded = Object.values(this.state.expanded)[0];

    if (isExpanded && (evt.type === 'click' || evt.keyCode === 13)) {
      evt.stopPropagation();

      const { activeFilters, inactiveFilters, loading, options } = this.state;

      const key = evt.target.dataset.key;
      const index = inactiveFilters.findIndex(filter => filter.key === key);
      const item = inactiveFilters[index];

      loading[key] = true;
      inactiveFilters.splice(index, 1);
      activeFilters.push(item);

      const retrieveOptions = () => {
        if (options[key] === undefined) {
          return get(item.endpoint);
        }

        return Promise.resolve({ data: options[key] });
      };

      retrieveOptions().then(({ data }) => {
        options[key] = data.map(d => Object.assign(d, { checked: false, hidden: false }));
        const newLoading = this.state.loading;
        newLoading[key] = false;

        const newExpanded = this.state.expanded;
        newExpanded[key] = true;

        this.setState({ options, loading: newLoading, expanded: newExpanded }, () => {
          this.setState({ totalCurrentItems: this.getTotalCurrentItems() });
        });
      });

      this.setState({ activeFilters, currentIndex: -1, expanded: {}, inactiveFilters, loading });
    }
  }

  removeActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters } = this.state;
    const key = evt.target.dataset.key;

    const index = activeFilters.findIndex(filter => filter.key === key);
    const item = activeFilters[index];

    activeFilters.splice(index, 1);
    inactiveFilters.push(item);
    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters, activeFilters }, () => {
      this.updateUrl();
      this.saveOptions();
    });
  }

  removeAllActive = () => {
    const { activeFilters, inactiveFilters } = this.state;
    const inactive = inactiveFilters.concat(activeFilters)
      .sort((a, b) => (a.index - b.index));

    this.setState({ inactiveFilters: inactive, activeFilters: [] }, () => {
      this.updateUrl();
      this.saveOptions();
    });
  }

  removeEmptyActive = () => {
    const { activeFilters, inactiveFilters } = this.state;

    const activeUpdated = activeFilters.reduce((activeAcc, filter) => {
      const isPopulated =
        (this.state.options[filter.key]
        && this.state.options[filter.key].reduce((acc, option) => acc || option.checked, false))
        || (
          this.state.options[filter.key]
          && this.state.options[filter.key].length === 0
          && this.state.savedFilters[filter.key]
          && this.state.savedFilters[filter.key].length
        );

      if (isPopulated === false) {
        inactiveFilters.push(filter);
      } else {
        activeAcc.push(filter);
      }

      return activeAcc;
    }, []);

    inactiveFilters.sort((a, b) => (a.index - b.index));

    this.setState({
      activeFilters: activeUpdated,
      inactiveFilters
    });
  }

  render() {
    const inactiveFilters =
      this.state.inactiveFilters.length
      ? (
        <TatariDropdownPlain
          keyListeners={this.keyListeners}
          currentIndex={this.state.currentIndex}
          data={this.state.inactiveFilters}
          i18n={this.props.i18n}
          isExpanded={this.state.expanded.inactive}
          isLoading={this.state.loading.inactive}
          onChange={this.addActive}
          onExpand={this.onExpand}
          styles={styles}
        />
      ) : null;

    const activeFilters = this.state.activeFilters
      .map((item) => {
        const savedSelections = this.state.savedFilters[item.key];

        return (
          <TatariDropdownCheckboxes
            currentIndex={this.state.currentIndex}
            filter={item}
            i18n={this.props.i18n}
            isExpanded={this.state.expanded[item.key]}
            isHiding={this.state.hiding[item.key]}
            isLoading={this.state.loading[item.key]}
            key={`active-${item.key}`}
            keyListeners={this.keyListeners}
            onCheckAll={this.checkAll}
            onCheckNone={this.checkNone}
            onCheckOne={this.checkOne}
            onExpand={this.onExpand}
            onRemove={this.removeActive}
            onSearch={this.onSearch}
            options={this.state.options[item.key]}
            savedSelections={savedSelections}
            styles={styles}
          />
        );
      });

    const clearAll = (
      activeFilters.length
      ? (
        <div onClick={this.removeAllActive} className={styles.clearAllFilters}>
          {this.props.i18n.clear_all}
        </div>
      ) : null
    );

    return (
      <div className={styles.filterContainer}>
        {activeFilters}
        {inactiveFilters}
        {clearAll}
      </div>
    );
  }
}
