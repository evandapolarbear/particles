import React from 'react';
import { expect } from 'chai';
import { shallow, mount }  from 'enzyme';
import <%= componentName %> from '../src/<%= projectName %>/<%= componentName %>.jsx';

describe('<<%= componentName %> /> >>>>', () => {

  describe('rendering', () => {
    test('can be imported successfully', () => {
      const wrapper = shallow(<<%= componentName %> name="Procore"/>);
      expect(wrapper).to.not.be.undefined;
    });

    test('renders an <div /> tag', () => {
      const wrapper = shallow(<<%= componentName %> name="Procore"/>);
      expect(wrapper.render().children().get(0).name).to.equal('div');
    });
  });

  describe('props', () => {
    test('adds the correct name', () => {
      const wrapper = shallow(<<%= componentName %> name="Procore"/>);
      expect( wrapper.render().html() ).to.contain( 'Procore' );
    });
  });
});
