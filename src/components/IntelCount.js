import React, { Component } from 'react';
import intelCount from '../util/intelCount';

class IntelCount extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            count: '',
         };
    }

    async componentDidMount() {
        const count = await intelCount();
        this.setState({count})
    }

    render() {
        return (
            <h2>Last Intel's ID was {this.state.count}</h2>
        );
    }
}

export default IntelCount;