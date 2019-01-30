import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import rewardIntel from '../util/reward';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenDepositAmount: '',
            id: '',
        };
    }

    handleDepositAmountChange = (e) => {
        this.setState({ tokenDepositAmount: e.target.value });
    }

    handleIDChange = (e) => {
        this.setState({ id: e.target.value });
    }

    depositTokens = async () => {
        await rewardIntel(this.state.id, this.state.tokenDepositAmount);
    }

    render() {
        return (
            <div style={{ border: '1px dotted black', padding: '100px', margin: '10px', textAlign: 'center' }}>
                <h2>Reward Intel</h2>
                <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                    <form>
                        <FormGroup
                            controlId="formBasicText"
                        >
                
                            <div style={{ paddingTop: '10px' }}>
                                <ControlLabel>Enter Pareto token amount for deposit</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.tokenDepositAmount}
                                    placeholder="10..."
                                    onChange={this.handleDepositAmountChange}
                                />
                                <FormControl.Feedback />
                            </div>
                           
                            <div style={{ paddingTop: '10px' }}>
                                <ControlLabel>Enter Intel's ID</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.id}
                                    placeholder="10..."
                                    onChange={this.handleIDChange}
                                />
                                <FormControl.Feedback />
                            </div>

                        </FormGroup>
                        <Button bsStyle="primary" onClick={this.depositTokens}>Reward!</Button>

                    </form>
                </div>
            </div>
        );
    }
}

export default Create;