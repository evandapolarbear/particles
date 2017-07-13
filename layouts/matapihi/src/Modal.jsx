import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import styles from './style.scss';

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
      children,
      custom,
      footer,
      header,
      label,
      large,
      medium,
      scrollBody,
      show,
      small,
    } = this.props;

    const modalClassName = cx(
      styles['modal-window'], propClassName, {
        [styles['modal-small']]: small,
        [styles['modal-medium']]: medium,
        [styles['modal-large']]: large,
      }
    );

    return show ? (
      <div className={styles.container}>
        <div onClick={this.onOverlayClicked} className={styles.overlay} />
        <div className={modalClassName}>
          <div>
            <header className={styles.header}>
              {header || <h1>{label}</h1>}
              <div className={styles.close}>
                <i
                  className="fa fa-close"
                  onClick={this.onCloseClicked}
                />
              </div>
            </header>
            <div className={styles.content}>
              {children}
            </div>
            {footer && (
              <footer className={styles.footer}>
                {footer}
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
