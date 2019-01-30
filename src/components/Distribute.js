import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import distributeIntel from '../util/distribute';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
        };
    }

    handleIDChange = (e) => {
        this.setState({ id: e.target.value });
    }

    distribute = async () => {
        await distributeIntel(this.state.id, this.state.tokenDepositAmount);
    }

    render() {
        return (
            <div style={{ border: '1px dotted black', padding: '100px', margin: '10px', textAlign: 'center' }}>
                <h2>Distribute Intel</h2>
                <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                    <form>
                        <FormGroup
                            controlId="formBasicText"
                        >
                           
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
                        <Button bsStyle="primary" onClick={this.distribute}>Reward!</Button>

                    </form>
                </div>
            </div>
        );
    }
}

export default Create;