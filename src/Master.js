import React, {Component} from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import BigNumber from "bignumber.js";
import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { fUSDC_address } from "./config";
import { fUSDCx_address } from "./config";
import { fUSDCxabi } from "./abis/fUSDCxabi";
import {ERC20abi} from "./abis/ERC20abi";
import ConnectWallet from "./ConnectWallet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "./ConnectWallet.css";
import Balances from "./Balances";
import { calculateFlowRate } from "./config";
import { calculateStream } from "./config";
import { calculateEndDate } from "./config";
import StreamList from "./StreamList";
import CreateStream from "./CreateStream";
import EditStream from "./EditStream";
import "./Master.css"


class Master extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: {},
            provider: {},
            sf: {},
            connected: true,
            account: '',
            fUSDC: {},
            fUSDCx: {},
            fUSDCxBal: 0,
            creatingStream: false,
            editingStream: false,
            editingAddress: "",
            outFlows: [],
            totalOutflows: 0, 
            endDate: ''
        }

        this.initWeb3 = this.initWeb3.bind(this);
        this.getAccount = this.getAccount.bind(this);
        this.isConnected = this.isConnected.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.addFunding = this.addFunding.bind(this);
        this.withdrawFunding = this.withdrawFunding.bind(this);
        this.createStream = this.createStream.bind(this);
        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.listOutFlows = this.listOutFlows.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.editStream = this.editStream.bind(this);
        this.deleteStream = this.deleteStream.bind(this);
        this.getEndDate = this.getEndDate.bind(this);
        this.getTotalOutflows = this.getTotalOutflows.bind(this);

    }

    async initWeb3() {
        
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);

        if (provider) {
            const sf = new SuperfluidSDK.Framework({
                web3: new Web3(provider)
            });

            await sf.initialize();

        
        const fUSDC = new web3.eth.Contract(ERC20abi, fUSDC_address);
        const fUSDCx = new web3.eth.Contract(fUSDCxabi, fUSDCx_address);
        
        this.setState({
            web3: web3,
            provider: provider,
            sf: sf,
            fUSDC: fUSDC,
            fUSDCx: fUSDCx
        })

    await this.getAccount();

    if (this.state.account.length > 0) {
    await this.getBalance();
    await this.listOutFlows();
    await this.getTotalOutflows();
    await this.getEndDate(); 
    }

    }
    else {
        console.log("You should consider metamask!")
    }

   
}

async getAccount() {
    const acct = await window.ethereum.request({ method: 'eth_accounts' })
          
          if (acct.length > 0) {
              this.setState({
                  connected: true, 
                  account: acct[0]
                })
          }
          else if (acct.length === 0) {
              this.setState({
                  connected: false,
                  account: ""
              })
          }
          
          let currentAccount = acct;
            window.ethereum
            .request({ method: 'eth_accounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available,
                // eth_accounts will return an empty array.
                console.error(err);
            });

            //handles a change in connected accounts
            function handleAccountsChanged(accounts) {
                if (accounts.length === 0) {
                    // MetaMask is locked or the user has not connected any accounts
                    console.log('Please connect to MetaMask.');
               
                } else if (accounts[0] !== currentAccount) {
                    currentAccount = accounts[0];
                }
            }
            
            window.ethereum.on('accountsChanged', this.isConnected, handleAccountsChanged);
    }


isConnected() {
    let accts = window.ethereum._state.accounts;
    
    if (accts.length === 0) {
        console.log('not connected')
        this.setState({connected: false})
    } else {
        console.log('connected')
        this.setState({account: accts[0]})
        this.setState({connected: true})
    }
}

async getBalance() {
    const fUSDCxBal = await this.state.fUSDCx.methods.balanceOf(this.state.account).call({from: this.state.account});
    const adjustedfUSDCx = Number(new BigNumber(fUSDCxBal).shiftedBy(-18)).toFixed(5);

    this.setState({
        fUSDCxBal: adjustedfUSDCx
    })
}

async addFunding(amount) {
    await this.state.fUSDC.methods.approve(fUSDCx_address, amount).send({from: this.state.account}).then(console.log)
    .then(
        await this.state.fUSDCx.methods.upgrade(amount).send({from: this.state.account}).then(console.log)
        .then(
            await this.getBalance()
        )
    )
}

async withdrawFunding(amount) {
    await this.state.fUSDCx.methods.downgrade(amount).send({from: this.state.account}).then(console.log)
    .then(
        await this.getBalance()
    )
}

async createStream(stream) {
    let amount = (new BigNumber(stream.amount).shiftedBy(18));;
    let address = Web3.utils.toChecksumAddress(stream.address);
    let _flowRate = calculateFlowRate(amount);

    const sf = this.state.sf;
    const tx = (sf.cfa._cfa.contract.methods
        .createFlow(
            fUSDCx_address.toString(),
            address.toString(),
            _flowRate.toString(),
            "0x"
        )
        .encodeABI())

    await sf.host.contract.methods.callAgreement(
        sf.cfa._cfa.address, tx, "0x").send({from: this.state.account, type: "0x2"})
    .then(console.log)
}

async editStream(stream) {
    let address = stream.address;
    let newFlowRate = calculateFlowRate(stream.amount);

    const sf = this.state.sf;
    const tx = (sf.cfa._cfa.contract.methods
        .updateFlow(
            fUSDCx_address.toString(),
            address.toString(),
            newFlowRate.toString(),
            "0x"
        )
        .encodeABI())
        await sf.host.contract.methods.callAgreement(
            sf.cfa._cfa.address, tx, "0x").send({from: this.state.account, type: "0x2"})
        .then(console.log)
        .then(await this.listOutFlows())   
}   

async deleteStream(address) {
        
    const sf = this.state.sf;
    const tx = (sf.cfa._cfa.contract.methods
        .deleteFlow(
            fUSDCx_address.toString(),
            this.state.account.toString(),
            address.toString(),
            "0x"
        )
        .encodeABI())
        await sf.host.contract.methods.callAgreement(
            sf.cfa._cfa.address.toString(), tx.toString(), "0x").send({from: this.state.account, type: "0x2"})
        .then(console.log)   
        .then(await this.listOutFlows())
} 


toggleCreateModal() {
    this.setState({creatingStream: true})
}

closeCreateModal() {
    this.setState({creatingStream: false})
}

showCreateModal() {
    return (
        <CreateStream
        createStream={this.createStream}
        closeCreateModal={this.closeCreateModal}
        />
    )
}

showEditModal(streamAddress) {
    let amount;
    
    let outFlows = this.state.outFlows;
    for (let i = 0; i <= outFlows.length; i++) {
        if (outFlows[i].receiver === streamAddress) {
            amount = calculateStream(this.state.outFlows[i].flowRate);
            break;
        }
    }
    return (
        <EditStream
        address={streamAddress}
        amount={amount}
        toggleEditModal={this.toggleEditModal}
        editStream={this.editStream}
        deleteStream={this.deleteStream}
        />
    )
}

toggleEditModal(streamAddress) {

    this.setState({
        editingStream: !this.state.editingStream,
        editingAddress: streamAddress
    })

    if (!this.state.editingStream) {
        this.showEditModal(streamAddress)
    }
}

async listOutFlows() {
    const flows = await this.state.sf.cfa.listFlows({
        superToken: fUSDCx_address,
        account: this.state.account
    })
    
    const outFlowArray = [];

    for (let i = 0; i < flows.outFlows.length; i++) {
        outFlowArray.push(flows.outFlows[i]);
    }
    
    this.setState({
        outFlows: outFlowArray
    })
}

async getTotalOutflows() {
    let totalOutflows = 0;
    let outFlows = this.state.outFlows;
    for (let i = 0; i <= outFlows.length; i++) {
        if (outFlows[i] !== undefined) { 
            let stream = calculateStream(outFlows[i].flowRate)
            totalOutflows = totalOutflows - Number(stream);
        }
    }
    
    this.setState({
        totalOutflows: totalOutflows
    })
}

getEndDate() {
    let end = calculateEndDate(this.state.fUSDCxBal, this.state.totalOutflows);
    console.log(end);
    this.setState({
        endDate: end
    })
}

async componentDidMount() {
    await this.initWeb3();
}

    render() {
        return (
            <div>
            <Row className="top">
            <Container>
            <Row>
                <Col>
                <h3 className="title">Superfluid Dashboard</h3>
                </Col>
                <Col>
                {!this.state.connected || this.state.account === "" || this.state.account === undefined?
                <ConnectWallet
                getAccount={this.getAccount}
                />
                :
                <Card className="connectWallet">{`${this.state.account.toString().substring(0, 4)}...${this.state.account.toString().substring(38)}`}</Card>
                }
                </Col>
                </Row>
            </Container>

            </Row>


            <Row>
            <Container>
                <Balances
                fUSDCxBal={this.state.fUSDCxBal}
                funding={this.addFunding}
                withdraw={this.withdrawFunding}
                outflows={this.state.totalOutflows}
                endDate={this.state.endDate}
                />
            </Container>
            </Row>

           <Container>
               
               <StreamList 
                toggleCreateModal={this.toggleCreateModal}
                toggleEditModal={this.toggleEditModal}
                streams={this.state.outFlows}
                fUSDCx={this.state.fUSDCx}

                />
               
           </Container>

            <Container>
            {this.state.creatingStream? this.showCreateModal(): console.log('not creating an employee')}
            {this.state.editingStream? this.showEditModal(this.state.editingAddress): console.log('not editing')}

            </Container>

            </div>
        )
    }
}

export default Master;