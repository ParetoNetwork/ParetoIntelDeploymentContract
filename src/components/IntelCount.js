import React, { Component } from 'react';
import intelCount from '../util/intelCount';
import intelAddress from '../util/intelAddress';

class IntelCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: '',
            address: '',
        };
    }

    async componentDidMount() {
        const count = await intelCount();
        const address = intelAddress();
        this.setState({ count, address })
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h2>Intel contract's address is {this.state.address}</h2>

                <h2>Last Intel's ID was {this.state.count}</h2>
            </div>
        );
    }
}

export default IntelCount;