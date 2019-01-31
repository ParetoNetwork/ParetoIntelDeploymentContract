import React, { Component } from 'react';
import { asyncComponent } from "react-async-component";
import MetamaskAlert from './components/MetamaskAlert';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showComponent: MetamaskAlert
    }
  }

  async componentDidMount() {
    let ShowComponent;
    if (typeof window.web3 == "undefined") {
      ShowComponent = "./components/MetamaskAlert";
    } else {
      ShowComponent = "./components/Home";
    }

    const FinalComponent = asyncComponent({
      resolve: () => import(`${ShowComponent}`),
      LoadingComponent: () => <div>Loading ...</div>, // Optional
      ErrorComponent: () => <div>error</div> // Optional
    })
    this.setState({ showComponent: FinalComponent })
  }
  render() {
    const ShowComponent = this.state.showComponent;
    return (
      <div className="container">
        <ShowComponent />
      </div>
    );
  }
}

export default App;
