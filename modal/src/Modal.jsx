import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from './Modal.scss';

const isOpening = (s1, s2) => !s1.show && s2.show;
const isClosing = (s1, s2) => s1.show && !s2.show;

class Modal extends Component {
  constructor(props) {
    super(props);
    this.onOverlayClicked = this.onOverlayClicked.bind(this);
    this.onCloseClicked = this.onCloseClicked.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (isOpening(this.props, nextProps) && this.props.beforeOpen) {
      this.props.beforeOpen();
    }

    if (isClosing(this.props, nextProps) && this.props.beforeClose) {
      this.props.beforeClose();
    }
  }

  componentDidUpdate(prevProps) {
    if (isOpening(prevProps, this.props) && this.props.afterOpen) {
      this.props.afterOpen();
    }

    if (isClosing(prevProps, this.props) && this.props.afterClose) {
      this.props.afterClose();
    }
  }

  onOverlayClicked() {
    if (this.props.closeOnOverlayClicked) {
      this.props.closeModal();
    }
    if (this.props.onOverlayClicked) {
      this.props.onOverlayClicked();
    }
  }

  onCloseClicked() {
    if (this.props.onCloseClicked) {
      this.props.onCloseClicked();
    }
    this.props.closeModal();
  }

  render() {
    const {
      className: propClassName,
      closeClassName: propCloseClassName,
      children,
      custom,
      footer,
      header,
      disableHeader,
      disableFooter,
      label,
      size,
      scrollBody,
      show,
    } = this.props;

    const modalClassName = cx(
      styles['modal-window'], propClassName, {
        [styles['modal-small']]: size === 'small',
        [styles['modal-medium']]: size === 'medium',
        [styles['modal-large']]: size === 'large'
      }
    );
    const closeClassName = cx(
      styles.close, propCloseClassName, {
        [styles['close-black']]: disableHeader
      }
    );

    return show ? (
      <div className={styles.container}>
        <div onClick={this.onOverlayClicked} className={styles.overlay} />
        <div className={modalClassName}>
          <div>
            <div className={closeClassName}>
              <i
                className='fa fa-close'
                onClick={this.onCloseClicked}
              />
            </div>
            { !disableHeader &&
              <header className={styles.header}>
                {header || <h1>{label}</h1>}
              </header>
            }
            <div className={styles.content}>
              {children}
            </div>
            { !disableFooter && (
              <footer className={styles.footer}>
                {footer || 'footer'}
              </footer>
            )}
          </div>
        </div>
      </div>
    ) : null;
  }
}

export default Modal;

Modal.propTypes = {
  disableHeader: PropTypes.bool,
  disableFooter: PropTypes.bool,
  onCloseClicked: PropTypes.func,
  onOverlayClicked: PropTypes.func,
  beforeOpen: PropTypes.func,
  afterOpen: PropTypes.func,
  beforeClose: PropTypes.func,
  afterClose: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  closeOnOverlayClicked: PropTypes.bool,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
}
