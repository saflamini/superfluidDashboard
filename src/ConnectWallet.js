import React, {Component} from "react";
import Button from 'react-bootstrap/Button';
import "./ConnectWallet.css";

class ConnectWallet extends Component {
    constructor(props) {
        super(props);
        this.enableWallet = this.enableWallet.bind(this)
    }


    async enableWallet() {
        window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        })
       
        await this.props.getAccount()

    }

    render() {
            return (
                <Button onClick={this.enableWallet} className="connectWallet">Connect Wallet</Button>

                )
        }
    }

export default ConnectWallet;