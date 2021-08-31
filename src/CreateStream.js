import React, {Component} from "react";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from "react-bootstrap/Modal";
import Spinner from 'react-bootstrap/Spinner';

class CreateStream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            amount: "",
            created: true
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({created: false})
        setTimeout(() => {
            this.props.createStream(this.state)
            .then(console.log())
            .then(this.setState({address: "", amount: "", created: true}))
        }, 2000);
    }

    render() {
        return (
        <Container>
            <Modal show={true} onHide={this.props.closeCreateModal}>
            <Modal.Header closeButton onClick={this.props.closeCreateModal}>
                <Modal.Title>Add New Stream</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="address">Recipient Address </Form.Label>
                        <Form.Control type="text" name="address" value={this.state.address} onChange={this.handleChange}></Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="amount">Amount/Month</Form.Label>
                        <Form.Control type="text" name="amount" value={this.state.amount} onChange={this.handleChange}></Form.Control>
                    </Form.Group>
                </Form>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                {this.state.created? <Button variant="primary" onClick={this.handleSubmit}>Create Stream</Button>
                :<Spinner animation="border" variant="primary"></Spinner>}
              <Button variant="secondary" onClick={this.props.closeCreateModal}>
                Close
              </Button>
              
            </Modal.Footer>
            </Modal>
            </Container>
        )
    }
}

export default CreateStream;