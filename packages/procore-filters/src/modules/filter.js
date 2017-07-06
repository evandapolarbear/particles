import { createAction, handleActions } from 'redux-actions';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';

import { get } from '../../utils/apiRequest';

const ADD_FILTER = 'filterBuilder/ADD_FILTER';
const FETCH_DEFINITIONS_REQUEST = 'filterBuilder/FETCH_DEFINITIONS_REQUEST';
const FETCH_DEFINITIONS_RESOLVE = 'filterBuilder/FETCH_DEFINITIONS_RESOLVE';
const FETCH_FILTER_VALUES_REQUEST = 'filterBuilder/FETCH_FILTER_VALUES_REQUEST';
const FETCH_FILTER_VALUES_RESOLVE = 'filterBuilder/FETCH_FILTER_VALUES_RESOLVE';
const REMOVE_ALL_FILTERS = 'filterBuilder/REMOVE_ALL_FILTERS';
const REMOVE_FILTER = 'filterBuilder/REMOVE_FILTER';
const REMOVE_FILTER_BY_ID_FIELD = 'filterBuilder/REMOVE_FILTER_BY_ID_FIELD';
const SET_ACTIVE_FILTER = 'filterBuilder/SET_ACTIVE_FILTER';
const SET_FILTER_VALUES = 'filterBuilder/SET_FILTER_VALUES';
export const REMOVE_EMPTY_FILTERS = 'filterBuilder/REMOVE_EMPTY_FILTERS';

export const fetchFilterValuesRequest = createAction(FETCH_FILTER_VALUES_REQUEST);
export const fetchFilterValuesResolve = createAction(FETCH_FILTER_VALUES_RESOLVE);
export const fetchDefinitionsRequest = createAction(FETCH_DEFINITIONS_REQUEST);
export const fetchDefinitionsResolve = createAction(FETCH_DEFINITIONS_RESOLVE);
export const removeAllFilters = createAction(REMOVE_ALL_FILTERS);
export const removeEmptyFilters = createAction(REMOVE_EMPTY_FILTERS);
export const removeFilter = createAction(REMOVE_FILTER);
export const removeFilterByIdField = createAction(REMOVE_FILTER_BY_ID_FIELD);
export const setActiveFilter = createAction(SET_ACTIVE_FILTER);
export const setFilterValues = createAction(SET_FILTER_VALUES);

export const isCustomRange = (range) => range.some(value => moment(value).isValid());

export const fetchDefinitions = payload => async (dispatch) => {
	const { scope, url } = payload;

	dispatch(fetchDefinitionsRequest());

	try {
		const response = await get(url);
		const { data } = response;
		dispatch(fetchDefinitionsResolve({ scope, data }));
	} catch (e) {
		console.error('fetchDefinitions error', e);
	}
};

export const fetchFilterValues = payload => async (dispatch, getState) => {
	const { filterBuilder } = getState();
	const { filter, idField, getFilterValuesUrl, scope, session = [] } = payload;
	const key = filter.get(idField);
	const bank = [...scope, ...session, 'bank'];

	// check cache and return if set
	if (
		filterBuilder.getIn([...bank, key], false) &&
		filterBuilder.getIn([...bank, 'search'], window.location.search) == window.location.search
	) { return }

	dispatch(fetchFilterValuesRequest());

	const url = getFilterValuesUrl(filter);
	let response = {};

	try {
		response = await get(url + window.location.search);
	} catch (e) {
		console.error('fetchFilterValues error', e);
	}

	const { data } = response;
	dispatch(fetchFilterValuesResolve({ key, data, scope, session }));
};

export const addFilter = payload => dispatch => {
	dispatch({ type: ADD_FILTER, payload });
	dispatch(fetchFilterValues(payload));
};

export const setFilters = payload => dispatch => {
	const { filters, getFilterValuesUrl, idField, scope, session = [] } = payload;

	dispatch(removeAllFilters(payload));
	filters.forEach(filter => {
		dispatch(addFilter({filter, idField, getFilterValuesUrl, scope, session}));
	});
};

export const transformations = {

	[ADD_FILTER]: (state, { payload }) => {
		const { scope, session = [], filter } = payload;

		return state.updateIn([...scope, ...session, 'filters'], (filters = List()) => {
			return filters.push(filter);
		});
	},

	[FETCH_DEFINITIONS_RESOLVE]: (state, { payload }) => {
		const { scope, session = [], data } = payload;

		return state.setIn([...scope, ...session, 'definitions'], fromJS(data));
	},

	[FETCH_FILTER_VALUES_RESOLVE]: (state, { payload }) => {
		const { scope, session = [], key, data } = payload;

		return state
			.setIn([...scope, ...session, 'bank', 'search'], window.location.search)
			.setIn([...scope, ...session, 'bank', key], fromJS(data));
	},

	[REMOVE_ALL_FILTERS]: (state, { payload }) => {
		const { scope, session = [] } = payload;

		return state.setIn([...scope, ...session, 'filters'], List());
	},

	[REMOVE_EMPTY_FILTERS]: (state, { payload }) => {
		const { scope, session = [] } = payload;

		return state.updateIn([...scope, ...session, 'filters'], (filters = List()) => {
			return filters.filter(filter => filter.get('values', List()).size);
		});
	},

	[REMOVE_FILTER]: (state, { payload }) => {
		const { scope, session = [], filter } = payload;

		return state.updateIn([...scope, ...session, 'filters'], (filters = List()) => {
			return filters.filter(obj => obj !== filter);
		});
	},

	[REMOVE_FILTER_BY_ID_FIELD]: (state, { payload }) => {
		const { scope, session = [], filter, idField } = payload;

		return state.updateIn([...scope, ...session, 'filters'], (filters = List()) => {
			return filters.filter(obj => obj.get(idField) !== filter);
		});
	},

	[SET_ACTIVE_FILTER]: (state, { payload }) => {
		const { scope, filter } = payload;

		return state.setIn([...scope, 'active'], filter);
	},

	[SET_FILTER_VALUES]: (state, { payload }) => {
		const { scope, session = [], filter, values } = payload;

		const rangeOperator = isCustomRange(values) ? 'range' : 'default_date_range';
		const operator = filter.get('data_type') === 'date' ? rangeOperator : '=';

		const newFilter = filter
			.set('values', values)
			.set('operator', operator);

		return state.updateIn([...scope, ...session, 'filters'], (filters = List()) => {
			return !filters.size ? filters.push(newFilter) : filters.map(obj => {
				return obj === filter ? newFilter : obj;
			});
		});
	},

};

export const reducer = handleActions(transformations, Map());
