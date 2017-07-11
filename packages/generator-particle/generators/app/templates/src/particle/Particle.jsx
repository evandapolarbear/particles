import React from 'react';
import PropTypes from 'prop-types';

const <%= componentName %> = ({ name }) => {
  return (
    <div>Hello {name}!</div>
  );
}

<%= componentName %>.propTypes = {
  name: PropTypes.string,
};

<%= componentName %>.defaultProps = {
  name: 'World',
};

export default <%= componentName %>;
