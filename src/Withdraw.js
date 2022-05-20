import React, {Component} from "react";
import BigNumber from "bignumber.js";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdraw: ""
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
        this.props.withdraw(new BigNumber(this.state.withdraw).shiftedBy(18).toString());
        this.setState({withdraw: ""})
    }


    render() {
        return (
        <div>   
            <Form onSubmit={this.handleSubmit}>
                <Form.Label htmlFor="withdraw">Withdraw Funds: </Form.Label>
                <InputGroup>
		            <Form.Control type="text" name="withdraw" placeholder="Enter a USDC amount..." onChange={this.handleChange} value={this.state.withdraw}></Form.Control>
		            <Button type="submit" className="addWithdrawButton" size="sm" >Submit</Button>
                </InputGroup>
            </Form>
            </div>
        )
    }
}

export default Withdraw;