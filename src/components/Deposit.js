import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import depositTokens from '../util/deposit';

class Deposit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenAmount: ''
        };
    }

    handleTokenAmountChange = (e) => {
        this.setState({ tokenAmount: e.target.value })
    }

    depositTokens = async () => {
        if (parseFloat(this.state.tokenAmount) > 0 ) {
            await depositTokens(this.state.tokenAmount);
        } else {
            alert("Enter amount greater than 0.");
        }
    }

    render() {
        return (
            <div style={{border: '1px dotted black', padding: '100px', margin: '10px', textAlign: 'center', width: '80%'}}>
                <h2>Deposit Pareto Tokens</h2>
                <div style={{paddingTop: '30px', textAlign: 'center'}}>
                    <form>
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <ControlLabel>Enter Pareto token amount to deposit</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.tokenAmount}
                                placeholder="10..."
                                onChange={this.handleTokenAmountChange}
                            />
                            <FormControl.Feedback />
                        </FormGroup>
                        <Button bsStyle="primary" onClick={this.depositTokens}>Deposit!</Button>

                    </form>
                </div>
            </div>
        );
    }
}

export default Deposit;