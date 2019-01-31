import React from "react";
import { Alert } from "react-bootstrap";

export default () => {
  return (
    <div>
        <Alert
          style={{
            width: "50%",
            margin: "auto",
            marginTop: "5%",
            textAlign: "center"
          }}
          bsStyle="danger"
        >
          Make sure that <strong>Metamask</strong> chrome extention is installed, connected
          to <strong> Ropsten </strong> network and an account is unlocked!
        </Alert>
    </div>
  );
};