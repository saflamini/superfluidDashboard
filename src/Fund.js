import React, {Component} from "react";
import BigNumber from "bignumber.js";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class Fund extends Component {
    constructor(props) {
        super(props);
        this.state = {
            funding: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //methods to handle input

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    handleSubmit(evt) {
        evt.preventDefault();
        this.props.funding(new BigNumber(this.state.funding).shiftedBy(18).toString());
        this.setState({funding: ""})
    }

    render() {
        return (
            <div>
            <Form onSubmit={this.handleSubmit}>
                <Form.Label htmlFor="funding">Add Funds: </Form.Label>
                <InputGroup>
		            <Form.Control type="text" name="funding" placeholder="Enter a USDC amount..." onChange={this.handleChange} value={this.state.funding}></Form.Control>
		            <Button type="submit" className="addWithdrawButton" size="sm" >Submit</Button>
                </InputGroup>
            </Form>
            </div>
        )
    }
}

export default Fund;