import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BigNumber } from "bignumber.js";

class EditStream extends Component {
constructor(props) {
    super(props);
    this.state = {
        placeholderAmount: this.props.amount,
        amount: "",
        amountEditing: false,
        deleting: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleDeleteStream = this.handleDeleteStream.bind(this);
    this.amountEdit = this.amountEdit.bind(this);
    this.deletingStream = this.deletingStream.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
}

handleChange(evt) {
    this.setState({
        [evt.target.name]: evt.target.value
    })
}

amountEdit() {
    this.setState({amountEditing: !this.state.amountEditing})
}

deletingStream() {
    this.setState({deleting: !this.state.deleting})
}

updateAmount() {
    this.setState({
        placeholderAmount: this.state.amount,
        amountEditing: false
    })
}

sendUpdate() {
    let adjustedAmountObject = {
        address: this.props.address,
        amount: new BigNumber(this.state.amount).shiftedBy(18),
    }
    this.props.editStream(adjustedAmountObject);
}

handleDeleteStream(evt) {
    evt.preventDefault();
    this.props.deleteStream(this.props.address);
}



render() {
   

if (this.state.amountEditing) {
    let amountDisplay;
    amountDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.toggleEditModal}>
                <Modal.Header closeButton onClick={this.props.toggleEditModal}>
                  <Modal.Title>Edit Stream Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="amount">Edit Amount </Form.Label>
                    <Form.Control type="text" name="amount" value={this.state.amount} onChange={this.handleChange}></Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={this.updateAmount}>Done</Button>
                <Button className="goBack" variant="secondary" onClick={this.amountEdit}>Cancel</Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </Container>
    )
    return amountDisplay;
}

if (this.state.deleting) {
    let deletionDisplay;
    deletionDisplay = (

        <Container>
            <Modal show={true} onHide={this.props.toggleEditModal}>
                <Modal.Header closeButton onClick={this.props.toggleEditModal}>
                  <Modal.Title>Edit Amount Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Form >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="amountEdit">Are you sure you want to delete this stream? </Form.Label>
                    <p>
                    <Button variant="danger" onClick={this.handleDeleteStream}>Yes</Button>
                    <Button className="goBack" variant="secondary" onClick={this.deletingStream}>No</Button>
                    </p>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditModal}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      </Container>
    )
    return deletionDisplay;
}

else {
    return (
    <Container>
         <Modal show={true} onHide={this.props.toggleEditModal}>
                <Modal.Header closeButton onClick={this.props.toggleEditModal}>
                  <Modal.Title>Edit Stream Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
        <p>
            <strong>Address</strong>: {this.props.address}
        </p>
        <p>
            <strong>Amount</strong>: {`$${this.state.placeholderAmount}/month`} <Button size="sm" variant="secondary" onClick={this.amountEdit}>Edit</Button>
        </p>
        <Button size="sm" variant="danger" onClick={this.deletingStream}>Delete</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.toggleEditModal}>
            Close
          </Button>
          <Button onClick={this.sendUpdate} variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
        </Container>
    )
}

}}

export default EditStream;
