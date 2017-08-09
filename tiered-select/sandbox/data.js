module.exports = [
  {
    id: 1,
    parent_id: null,
    name: 'United States',
    full_name: 'United States'
  },
  {
    id: 2,
    parent_id: null,
    name: 'New Zealand',
    full_name: 'New Zealand'
  },
  {
    id: 3,
    parent_id: 1,
    name: 'California',
    full_name: 'United States > California'
  },
  {
    id: 4,
    parent_id: 1,
    name: 'Oregon',
    full_name: 'United States > Oregon'
  },
  {
    id: 5,
    parent_id: 2,
    name: 'Manawatu',
    full_name: 'New Zealand > Manawatu'
  },
  {
    id: 6,
    parent_id: 2,
    name: 'Auckland',
    full_name: 'New Zealand > Auckland'
  },
  {
    id: 7,
    parent_id: 4,
    name: 'Portland',
    full_name: 'United States > Oregon > Portland'
  },
  {
    id: 8,
    parent_id: 4,
    name: 'Eugene',
    full_name: 'United States > Oregon > Eugene'
  },
  {
    id: 9,
    parent_id: 3,
    name: 'Fresno',
    full_name: 'United States > California > Fresno'
  },
  {
    id: 10,
    parent_id: 3,
    name: 'Bakersfield',
    full_name: 'United States > California > Bakersfield'
  },
  {
    id: 11,
    parent_id: 10,
    name: 'Neighborhood',
    full_name: 'United States > California > Bakersfield > Neighborhood'
  },
  {
    id: 12,
    parent_id: 11,
    name: 'Street',
    full_name: 'United States > California > Bakersfield > Neighborhood > Street'
  }
];
