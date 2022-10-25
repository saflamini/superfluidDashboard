import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import DisplayBalance from "./DisplayBalance";
import Fund from "./Fund";
import Withdraw from "./Withdraw";
import "./Balances.css";
import MonthlyOutflows from "./MonthlyOutflows";

class Balances extends Component {
    constructor(props) {
        super(props);

        this.addFunding = this.addFunding.bind(this);
        this.withdrawFunding = this.withdrawFunding.bind(this);
    }

    addFunding(amount) {
        this.props.funding(amount)
    }

    withdrawFunding(amount) {
        this.props.withdraw(amount)
    }

    render() {
        return(
            <div>
			<Container>
            <Row>            
            
            <Col>
            {this.props.fUSDCxBal == 0?
                <Card className="balances">
                   <div >
                        <h5>USDCx Balance </h5>
                        <h2>$0.00</h2>
                   </div>
                   </Card>
               :
               <Card className="balances">
                    <DisplayBalance 
                    fUSDCxBal={this.props.fUSDCxBal}
                    outflows={this.props.outflows}

                    />
                </Card>
                }
                 
                 <Card className="addFunds">
                    <Fund 
	                funding={this.addFunding}
                    />
                </Card>

                <Card className="withdrawFunds">
                    <Withdraw 
	                withdraw={this.withdrawFunding}
                    />
                </Card>
            </Col>
               

            <Col>
                <Card className="funding" >
                    <MonthlyOutflows
                    outflows={this.props.outflows}
                    endDate={this.props.endDate}
                    />
                </Card>
            </Col>

            </Row>
            </Container>

            </div>
        )
    }
}

export default Balances;