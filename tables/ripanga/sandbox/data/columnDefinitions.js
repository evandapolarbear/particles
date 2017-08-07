const def = {
  editable: false,
  hidden: false,
  label: '',
  key: '',
  sortable: false,
  sortKey: '',
  width: 100
};

const columnDefinitions = [
  Object.assign({ ...def }, { label: 'Col A', key: 'colA', width: 200 }),
  Object.assign({ ...def }, { label: 'Col B', key: 'colB', width: 125 }),
  Object.assign({ ...def }, { label: 'Col C', key: 'colC', width: 150 }),
  Object.assign({ ...def }, { label: 'Col D', key: 'colD', width: 50 }),
  Object.assign({ ...def }, { label: 'Col E', key: 'colE', width: 100 }),
  Object.assign({ ...def }, { label: 'Col F', key: 'colF', width: 175 }),
  Object.assign({ ...def }, { label: 'Col G', key: 'colG', width: 100 }),
  Object.assign({ ...def }, { label: 'Col H', key: 'colH', width: 150 }),
  Object.assign({ ...def }, { label: 'Col I', key: 'colI', width: 75 })
];

module.exports = columnDefinitions;
