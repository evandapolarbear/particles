import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import composeStyles from '../../../shared/stylesheetComposer';

import baseStyles from './BulkEditor.scss';

const keyGen = (item, valueField) => (
  valueField ? item[valueField] : item
);

class BulkEditor extends React.Component {
  constructor(props) {
    super(props);

    this.styles = composeStyles(baseStyles, props.stylesheets);

    this.state = {
      submitDisabled: false
    };
  }

  render() {
    const {
      cancelText,
      children,
      emptyMessage,
      itemFormatter,
      items,
      itemsTitle,
      onCancel,
      onRemove,
      onSubmit,
      submitText,
      valueField
    } = this.props;

    const { submitDisabled } = this.state;

    const itemsContainer = items.length > 0
    ? items.map(item =>
        (<div className={this.styles.itemContainer} key={`bulk-editor-item-${keyGen(item, valueField)}`}>
          <button type='button' className={`fa fa-times ${this.styles.removeButton}`} onClick={() => onRemove(item)} />
          <span className={this.styles.item}>{itemFormatter(item)}</span>
        </div>)
      )
    : <div className={this.styles.emptyMessage}>{emptyMessage}</div>;

    return (
      <div className={this.styles.container}>
        <span className={this.styles.itemsTitle}>{itemsTitle}</span>
        <div className={this.styles.subContainer}>
          <div
            className={cx(this.styles.selectedItems, { [this.styles.empty]: !items.length })}
          >{itemsContainer}</div>
          <div className={this.styles.fields} id='batch-editor-fields'>
            <div className={this.styles.fieldsContainer}>{children}</div>
          </div>
        </div>
        <span className={this.styles.footer}>
          <a className={this.styles.cancel} onClick={onCancel}>{cancelText}</a>
          <button
            className={this.styles.submitButton}
            disabled={!items.length || submitDisabled}
            onClick={() => { this.setState({ submitDisabled: true }); onSubmit(items); }}
            type='button'
          >{submitText}</button>
        </span>
      </div>
    );
  }
}

BulkEditor.propTypes = {
  cancelText: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.any]),
  emptyMessage: PropTypes.string,
  itemFormatter: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any])),
  itemsTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
  onSubmit: PropTypes.func,
  stylesheets: PropTypes.arrayOf(PropTypes.shape()),
  submitText: PropTypes.string,
  valueField: PropTypes.string
};

BulkEditor.defaultProps = {
  cancelText: 'Cancel',
  children: [],
  emptyMessage: 'No items being passed in',
  itemFormatter: item => item,
  items: [],
  itemsTitle: 'Selected Items: ',
  onCancel: () => console.log('No onCancel was passed to BulkEditor'), // eslint-disable-line
  onRemove: () => console.log('No onRemove was passed to BulkEditor'), // eslint-disable-line
  onSubmit: () => console.log('No onSubmit was passed to BulkEditor'), // eslint-disable-line
  stylesheets: [],
  submitText: 'Save Edits',
  valueField: null
};

export default BulkEditor;
