import React from 'react';
import { render } from 'react-dom';
import Modal from '../src/Modal';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  render() {
    return (
      <div>
        <div>
          <Modal
            closeOnOverlayClicked
            show={this.state.show}
            closeModal={() => this.setState({ show: false })}
            header={(<div>Header</div>)}
            footer={(<div>Footer</div>)}
            onShow={show => this.setState({ show })}
            onHide={show => this.setState({ show })}
          >
            <div style={{ height: '200px;' }}>Modal Body</div>
          </Modal>
        </div>
        <button onClick={() => this.setState({ show: !this.state.show })}>
          Toggle
        </button>
      </div>
    );
  }
}

render(
  React.createElement(Component),
  document.getElementById('root')
);
