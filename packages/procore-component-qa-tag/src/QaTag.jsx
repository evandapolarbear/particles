import React from 'react';
import camelize from 'camelize';

const QaTag = ({ tag, children }) => {
  return (
    <div data-qa-tag={camelize(tag)}>
      {children}
    </div>
  );
};

export default QaTag;
