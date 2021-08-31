import React, {Component} from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Row from "react-bootstrap/esm/Row";
import { Table } from "react-bootstrap";
import "./StreamList.css";
import Stream from "./Stream";

class StreamList extends Component {
    constructor(props) {
        super(props);

        this.toggleCreateModal = this.toggleCreateModal.bind(this);
        this.renderStreams = this.renderStreams.bind(this)

    }

    toggleCreateModal() {
        this.props.toggleCreateModal();
    }


    renderStreams() {
    return (     
            this.props.streams.map(streams => (
                <tbody key={Number(streams.flowRate + Math.floor(Math.random() * 10))}>{
                    <Stream className="e"
                    address={streams.receiver}
                    flowRate={streams.flowRate}
                    fUSDCx={this.props.fUSDCx}
                    handleEditing={this.props.toggleEditModal}
                    />}
                    </tbody>
            ))
    )
    }

    render() {
        return (
            
            <div className="streamList">
                <Container>
                    <Row>
               
                        <Card className="streamListTitle">
                            <h3>Stream List</h3>
                        </Card>
                        <Button className="addStream" onClick={this.toggleCreateModal}>
                            Add Stream
                        </Button>

                        <Table className="streams"responsive bordered hover>
                        <thead>
                            <tr>
                            <th>Address</th>
                            <th>Amount/Month</th>
                            <th>Edit</th>
                            </tr>
                        </thead>
                        {this.renderStreams()}
                        </Table> 
                    </Row>
                </Container>
            </div>
        )
    }
}

export default StreamList;