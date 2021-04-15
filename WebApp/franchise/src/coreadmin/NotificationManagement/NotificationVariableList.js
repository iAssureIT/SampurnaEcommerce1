import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import $ 							from 'jquery';
import jQuery 						from 'jquery';


class NotificationVariableList extends Component {
	constructor(props){
		super(props);
		this.state = {
			
		}
	}
	
	render() {
		
		return (
         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
         	 <section className="Content">
         	 	<div className="row">
         	 		<div className="col-md-12">
         	 			<div className="invoiceWrapper">
         	 				<div className="box-header with-border invoice-title">
			          			<h4 className="invoiceTitle">Notification Variable List</h4>
			          		</div>
			          		<div className="box-body">
			          			<div className="col-lg-12">
			          				<div className="col-lg-12 col-md-12 col-sm-12">
			          					<p style={{"color":"#666"}}>NOTE: Please use the token provided here for each module. All tokens should be enclosed in square bracket(for eg: [userName])</p>
			          				</div>
			          				<div className="col-lg-12 marginStyle">
			          					<div className="table-responsive col-lg-12 col-md-12">
				          					<table className="table table-bordered">
				          						<thead>
					                            <tr style={{"background":"#eee"}}>
			              							<td className="textCenter"><strong> TOKEN </strong></td>
			              							<td className="textCenter"><strong>DESCRIPTION</strong></td>
					                            </tr>
				          						</thead>
				          						<tbody className="tableBody" id="tableBody">
				          							<tr className="">
							                            <th className="bg-warning textCenter" colSpan="2"> TRIP BOOKING </th>
							                        </tr>
				          							<tr>
					          							<td>EmployeeName</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>EmployeeID</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>manager1Name</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>manager2Name</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>manager3Name</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>manager1ID</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>manager2ID</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>manager3ID</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>pickUpLocation</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>dropLocation</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>FromDateTime</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>ToDateTime</td>
					          							<td></td>
				          							</tr>
				          							<tr className="">
							                            <th className="bg-warning textCenter" colSpan="2"> Manager Approve/Reject </th>
							                        </tr>
				          							<tr>
					          							<td>EmployeeName</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>EmployeeID</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>managerName</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>managerID</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>managerNumber</td>
					          							<td></td>
				          							</tr>
				          							<tr>
					          							<td>BookingNum</td>
					          							<td></td>
				          							</tr>
				          							
				          						</tbody>
				          					</table>
				          				</div>
			          				</div>
			          			</div>
			          		</div>
         	 			</div>
         	 		</div>
         	 	</div>
		    </section>
	     </div>
	    );
		
	} 

}

export default withRouter(NotificationVariableList);

