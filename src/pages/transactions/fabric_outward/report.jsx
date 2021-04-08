import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getRequest } from '../../../helpers/apihelper';
import { getStandardDate } from '../../../helpers/timer';

class Report extends PureComponent {
    constructor(props){
        super(props);
        this.state ={
            report_details : {},
            show_details : false
        }
    }

    componentDidMount = () => {
        getRequest('transactions/getJobworkInvoiceReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true
                })
            }
        })
    }


    render(){
        const { report_details } = this.state;
        return(
            <Fragment>
                { this.state.show_details &&
                    <div id="printable-area">
                        <div className="row">
                            <div className="col-6" style={{ border : '1px solid black' }} >
                                <b>{ report_details.company_details.company }</b><br/>
                                <p> Address :  { report_details.company_details.address } </p>
                                <p> Phone :  { report_details.company_details.phone } </p>
                                <p> Mail :  { report_details.company_details.email } </p>
                                <p> GSTIN :  <b> { report_details.company_details.email } </b> </p>
                            </div>
                            <div className="col-6">
                                <table border={1} width={"100%"}>
                                    <tr>
                                        <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center' }}> <b> DELIVERY NOTE </b> </td>
                                    </tr>
                                    <tr>
                                        <th> DC No </th>
                                        <td> { report_details.dcno }</td>
                                        <th> Dated </th>
                                        <td> { getStandardDate(report_details.vou_date)} </td>
                                    </tr>
                                    <tr>
                                        <th> Process </th>
                                        <td> { report_details.process }</td>
                                        <th> HSN Code </th>
                                        <td> {report_details.hsnsac} </td>
                                    </tr>
                                    <tr>
                                        <th> Order No </th>
                                        <td> { report_details.order_no }</td>
                                        <th> Vehicle No </th>
                                        <td> {report_details.vehicle_no} </td>
                                    </tr>
                                    <tr>
                                        <th> Product </th>
                                        <td> { report_details.product }</td>
                                        <th>  </th>
                                        <td>  </td>
                                    </tr>
                                </table>
                            </div>

                            <table border={1} width="100%">
                                <thead>
                                    <th>Color</th>
                                    { this.state.size_data_for_order.map((item, index) => 
                                                item !== "" && <th key={index} width="100px"> <b> {item}</b></th>
                                            ) }
                                </thead>
                                <tbody>
                                    { report_details.color_details.map(item => 
                                        <tr>
                                            <td>{ item.color }</td>
                                            <td>{ item.size1 }</td>
                                            <td>{ item.size2 }</td>
                                            <td>{ item.size3 }</td>
                                            <td>{ item.size4 }</td>
                                            <td>{ item.size5 }</td>
                                            <td>{ item.size6 }</td>
                                            <td>{ item.size7 }</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        store: state
    }
}

const mapDispatchToProps = {
  }
  


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Report));
