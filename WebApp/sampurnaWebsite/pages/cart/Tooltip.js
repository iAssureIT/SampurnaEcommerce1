import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import axios from 'axios';

class Tooltip extends Component {
  constructor(props) {
    super(props);
        this.state = {
            userID  : "",
        }
}

componentDidMount() {
   
}

render() {
    return (
        <div className="col-12 NoPadding tooltip">
             My ToolTip
        </div>
    );
  }
}

  export default Tooltip;
