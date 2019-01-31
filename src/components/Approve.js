import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import approve from '../util/approve';

class Approve extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    approveTokens = async () => {
        await approve();
    }

    render() {
        return (
            <div style={{ border: '1px dotted black', padding: '100px', margin: '10px', textAlign: 'center', width: "80%" }}>
                <h3>Enable interaction</h3>
                <Button className="btn btn-primary" onClick={this.approveTokens}>Enable</Button>
            </div>
        );
    }
}

export default Approve;