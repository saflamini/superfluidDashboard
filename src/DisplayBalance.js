import React, {Component} from "react";
import "./DisplayBalance.css";
import { calculateStreamPerSecond } from "./config";

class DisplayBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: "$0.00"
        }

        this.loadBalance = this.loadBalance.bind(this);
        
    }

    loadBalance() {
        if (Number(this.props.fUSDCxBal) > 0) {
            this.setState({balance: this.props.fUSDCxBal})
            setInterval(() => {
                this.setState({
                    balance: (Number(this.state.balance) + (calculateStreamPerSecond(this.props.outflows) / 10)).toFixed(5)
                })
            }, 
            100)
        }
    }

    componentDidMount() {
        this.loadBalance();        
    }

    componentWillUnmount() {
        clearInterval(this.loadBalance());
        console.log('timer unmounted')
      }

render() {

    return (
        <div >
        <h5>SuperToken USDCx Balance </h5>
        <h2>{this.props.outflows === 0? '$0.00'
        : `$${this.state.balance}` }</h2>
        </div>
    )       
    }
}

export default DisplayBalance;