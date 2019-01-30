import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Deposit from './Deposit';
import Create from './Create';
import Reward from './Reward';
import Distribute from './Distribute';
import IntelCount from './IntelCount';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
          <Jumbotron style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <IntelCount />
            <Deposit />
            <Create />
            <Reward />
            <Distribute />
          </Jumbotron>  
        );
    }
}

export default Home;