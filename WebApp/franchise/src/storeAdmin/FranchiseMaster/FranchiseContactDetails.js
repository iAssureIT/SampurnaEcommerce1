import React, { Component } from 'react';
import ContactDetails from '../../coreadmin/Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';
import _ from 'underscore';
import 'bootstrap/js/tab.js';

class FranchiseContactDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    componentWillReceiveProps(nextProps) {
    
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <ContactDetails entity="Franchise" />
            </div>
        );
    }
}
export default FranchiseContactDetails;

