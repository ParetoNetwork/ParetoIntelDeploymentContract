import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Deposit from './Deposit';
import Create from './Create';
import Reward from './Reward';
import Distribute from './Distribute';
import IntelCount from './IntelCount';
import Approve from './Approve';
import checkAllowance from '../util/checkAllowance';
import web3 from '../util/web3';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowance: false,
        };
    }

    async componentDidMount() {
        const allowance = await checkAllowance()
        if (allowance > web3.utils.toWei("50000", "ether")) {
            this.setState({ allowance: true });
        } else {
            this.setState({ allowance: false });
        }
    }

    showComponents = () => {
        if (this.state.allowance) {
            return (
                <React.Fragment>
                    <IntelCount />
                    <Deposit />
                    <Create />
                    <Reward />
                    <Distribute />
                </React.Fragment>
            )
        } else {
            return(
                <React.Fragment>
                     <Approve />
                </React.Fragment>
            )
        }
       
    }

    render() {
        return (
            <Jumbotron style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {this.showComponents()}
            </Jumbotron>
        );
    }
}

export default Home;