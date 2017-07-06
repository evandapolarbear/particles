import React, { PropTypes } from 'react';
import { DropdownList } from 'react-widgets';
import { fromJS, List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { deprecate } from 'react-is-deprecated';
import qs from 'qs';

import TaggedElement from '../TaggedElement';
import SingleValueFilter from './SingleValueFilter';
import DateRangeFilter from './DateRangeFilter';
import PresetDateRangeFilter from './PresetDateRangeFilter';
import MultiValueFilter from './MultiValueFilter';

const getLocalStorage = () => {
  if (window && window.localStorage) {
    return qs.parse(window.localStorage.getItem('params'));
  }
};

export default class Filters extends React.Component {

  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func),
    active: ImmutablePropTypes.map,
    bank: ImmutablePropTypes.map,
    definitions: ImmutablePropTypes.list,
    definitionsPlaceholder: PropTypes.string,
    definitionsTextField: PropTypes.string,
    definitionsValueField: PropTypes.string,
    disabled: PropTypes.bool,
    filterFunc: PropTypes.func,
    filters: ImmutablePropTypes.list,
    filtersTextField: PropTypes.string,
    filtersValueField: PropTypes.string,
    idField: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onReset: PropTypes.func,
    onSetFilterValues: deprecate(
      PropTypes.func,
      'onSetFilterValues is deprecated. Use onChange instead.',
    ),
    onFilterValuesBlur: PropTypes.func,
    presetDateRangeEnabled: PropTypes.bool,
    resetLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    session: PropTypes.arrayOf(),
    typeField: PropTypes.string,
  };

  static defaultProps = {
    actions: {},
    active: null,
    customFilters: {},
    bank: Map(),
    definitions: List(),
    definitionsPlaceholder: 'Add Filter',
    definitionsTextField: 'label',
    definitionsValueField: 'value',
    disabled: false,
    filters: List(),
    filtersTextField: 'label',
    filtersValueField: 'value',
    idField: 'value',
    onBlur: () => {},
    onChange: () => {},
    onRemove: () => {},
    onReset: () => {},
    onSetFilterValues: () => {},
    onFilterValuesBlur: () => {},
    presetDateRangeEnabled: false,
    resetLabel: 'Clear All',
    session: [],
    typeField: 'type',
  };

  constructor() {
    super();
    const ls = getLocalStorage();
    const isIncludeSublocations = ls
      && ls.filters
      && ls.filters.include_sublocations;
    this.state = {
      isIncludeSublocations,
    };
  }

  render() {
    const {
      actions: {
        addFilter,
        removeEmptyFilters,
        removeFilter,
        removeAllFilters,
        setActiveFilter,
        setFilterValues,
      },
      active,
      bank,
      customFilters,
      definitions,
      definitionsPlaceholder,
      definitionsTextField,
      definitionsValueField,
      disabled,
      filterFunc,
      filters,
      filtersTextField,
      filtersValueField,
      idField,
      onBlur,
      onChange,
      onRemove,
      onReset,
      onSetFilterValues,
      onFilterValuesBlur,
      presetDateRangeEnabled,
      resetLabel,
      session,
      typeField,
    } = this.props;

    const filterIds = filters.toJS().map(filter => filter[idField]);
    const data = definitions.toJS().filter((def) => {
      return filterIds.indexOf(def[idField]) < 0;
    });

    const showResetLabel = resetLabel && filters;

    return (
      <TaggedElement el="div" className="filter-tokenizer" tag="filters">
        <div className="filter-source rw-widget-override override-width-auto">
          <TaggedElement tag="filters-definitions">
            <DropdownList
              {...{
                data,
                disabled,
                duration: 0,
                editable: false,
                onChange: () => {},
                onSelect: (option) => {
                  const filter = fromJS(option);
                  addFilter({ session, filter });
                  setActiveFilter({ session, filter });
                },
                placeholder: definitionsPlaceholder,
                textField: definitionsTextField,
                value: false,
                valueField: definitionsValueField,
                itemComponent: ({ item }) => (
                  <TaggedElement
                    tag={`filters-definition-${item[definitionsTextField]}`}
                  >
                    {item[definitionsTextField]}
                  </TaggedElement>
                ),
              }}
            />
          </TaggedElement>
        </div>
        {filters.map((filter, key) => {
          let optionsModifier;
          const label = filter.get(definitionsTextField);
          const selected = filter.get('values', List());
          const activeValue = active && active.get(definitionsValueField);
          const open = filter.get(definitionsValueField) === activeValue;
          const filterOptions = bank.get(filter.get(idField), List());
          const busy = filter.get('busy');

          if (customFilters[filter.get(typeField)]) {
            const CustomFilterComponent = customFilters[filter.get(typeField)];
            return (
              <TaggedElement
                key={key} tag={`filters-token-${filter.get(idField)}`}
              >
                <CustomFilterComponent
                  {...{
                    key,
                    label,
                    onChange: (values) => {
                      setFilterValues({ session, filter, values });
                      onChange(values);
                      onSetFilterValues();
                    },
                    onRemove: () => {
                      removeFilter({ session, filter });
                      onSetFilterValues();
                      onRemove(filter);
                    },
                    onClose: () => {
                      setActiveFilter({ filter: null });
                      removeEmptyFilters({ session });
                      onFilterValuesBlur();
                      onBlur();
                    },
                    open,
                    presetDateRangeEnabled,
                    selected,
                  }}
                />
              </TaggedElement>
            );
          }

          if (filter.get(typeField) === 'single') {
            return (
              <TaggedElement tag={`filters-token-${filter.get(idField)}`}>
                <SingleValueFilter
                  {...{
                    key,
                    label,
                    onChange: (item) => {
                      const values = fromJS([ item.value ]);
                      setFilterValues({ session, filter, values });
                      onChange(values);
                      onSetFilterValues();
                    },
                    onRemove: () => {
                      removeFilter({ session, filter });
                      onSetFilterValues();
                      onRemove(filter);
                    },
                    onClose: () => {
                      setActiveFilter({ filter: null });
                      removeEmptyFilters({ session });
                      onFilterValuesBlur();
                      onBlur();
                    },
                    open,
                    selected,
                    data: filterOptions,
                    textField: filtersTextField,
                    valueField: filtersValueField,
                  }}
                />
              </TaggedElement>
            );
          }

          if (filter.get(typeField) === 'date') {
            const DateFilterComponent = presetDateRangeEnabled
              ? PresetDateRangeFilter
              : DateRangeFilter;

            return (
              <TaggedElement
                key={key} tag={`filters-token-${filter.get(idField)}`}
              >
                <DateFilterComponent
                  {...{
                    key,
                    label,
                    onChange: (values) => {
                      setFilterValues({ session, filter, values });
                      onChange(values);
                      onSetFilterValues();
                    },
                    onRemove: () => {
                      removeFilter({ session, filter });
                      onSetFilterValues();
                      onRemove(filter);
                    },
                    onClose: () => {
                      setActiveFilter({ filter: null });
                      removeEmptyFilters({ session });
                      onFilterValuesBlur();
                      onBlur();
                    },
                    open,
                    presetDateRangeEnabled,
                    selected,
                  }}
                />
              </TaggedElement>
            );
          }

          if (filter.get(typeField) === 'include_sublocations') {
            const {
              filters: { ...storedFilters },
              ...params
            } = getLocalStorage();

            const { isIncludeSublocations } = this.state;

            optionsModifier = (
              <span className="padding-left">
                <input
                  checked={isIncludeSublocations}
                  id="include-sublocations"
                  type="checkbox"
                  onChange={() => {
                    window.localStorage.setItem(
                      'params',
                      qs.stringify(
                        {
                          filters: {
                            ...storedFilters,
                            include_sublocations: isIncludeSublocations ? '0' : '1',
                          },
                          ...params,
                        },
                        { arrayFormat: 'brackets' }),
                    );
                    this.setState({
                      isIncludeSublocations: !isIncludeSublocations,
                    });
                  }}
                />
                {filter.get('secondaryLabel')}
              </span>
            );
          }

          return (
            <TaggedElement key={key} tag={`filters-token-${filter.get(idField)}`}>
              <MultiValueFilter
                {...{
                  filterFunc: filterFunc && filterFunc({ filter, filterOptions }),
                  key,
                  label,
                  onChange: (values) => {
                    setFilterValues({ session, filter, values });
                    onChange(values);
                    onSetFilterValues();
                  },
                  onRemove: () => {
                    removeFilter({ session, filter });
                    onSetFilterValues();
                    onRemove(filter);
                  },
                  onClose: () => {
                    setActiveFilter({ filter: null });
                    removeEmptyFilters({ session });
                    onFilterValuesBlur();
                    onBlur();
                  },
                  open,
                  options: filterOptions,
                  optionsModifier,
                  selected,
                  textField: filtersTextField,
                  valueField: filtersValueField,
                }}
              />
            </TaggedElement>
          );
        })}
        {showResetLabel && (
          <TaggedElement
            {...{
              el: 'a',
              className: 'link-hover inline-block padding-left padding-top',
              style: { verticalAlign: 'top' },
              onClick() {
                removeAllFilters && removeAllFilters({});
                onReset && onReset({});
              },
              tag: 'filters-reset',
            }}
          >
            {resetLabel}
          </TaggedElement>
        )}
      </TaggedElement>
    );
  }
}
