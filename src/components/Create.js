import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import createIntel from '../util/create';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            providerAddress: '',
            tokenDepositAmount: '',
            rewardAmount: '',
            id: '',
            expireTime: '',
        };
    }

    handleProviderAddressChange = (e) => {
        this.setState({ providerAddress: e.target.value })
    }

    handleDepositAmountChange = (e) => {
        this.setState({ tokenDepositAmount: e.target.value });
    }

    handleRewardAmountChange = (e) => {
        this.setState({ rewardAmount: e.target.value });
    }

    handleIDChange = (e) => {
        this.setState({ id: e.target.value });
    }

    handleExpireTimeChange = (e) => {
        this.setState({ expireTime: e.target.value })
    }

    depositTokens = async () => {
        await createIntel(this.state.providerAddress, this.state.tokenDepositAmount, this.state.rewardAmount, this.state.id, this.state.expireTime);
    }

    render() {
        return (
            <div style={{ border: '1px dotted black', padding: '100px', margin: '10px', textAlign: 'center', width: '80%' }}>
                <h2>Create Intel</h2>
                <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                    <form>
                        <FormGroup
                            controlId="formBasicText"
                        >
                            <div style={{ paddingTop: '10px' }}>
                                <ControlLabel>Enter provider's address</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.providerAddress}
                                    placeholder="0xaca..."
                                    onChange={this.handleProviderAddressChange}
                                />
                                <FormControl.Feedback />
                            </div>
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
                                <ControlLabel>Enter Pareto token amount to reward</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.rewardAmount}
                                    placeholder="10..."
                                    onChange={this.handleRewardAmountChange}
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
                            <div style={{ paddingTop: '10px' }}>
                                <ControlLabel>Enter Intel's expiration time in EPOCH format</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.expireTime}
                                    placeholder="10..."
                                    onChange={this.handleExpireTimeChange}
                                />
                                <FormControl.Feedback />
                            </div>
                        </FormGroup>
                        <Button bsStyle="primary" onClick={this.depositTokens}>Deposit!</Button>

                    </form>
                </div>
            </div>
        );
    }
}

export default Create;