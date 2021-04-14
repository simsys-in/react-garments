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
            show_details : false,
            size1_total : 0,
            size2_total : 0,
            size3_total : 0,
            size4_total : 0,
            size5_total : 0,
            size6_total : 0,
            size7_total : 0,
            size8_total : 0,
            size9_total : 0,
            qty_total : 0
        }
    }

    componentDidMount = () => {
        getRequest('garments/getJobworkOutwardReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                var size1_total = 0;
                var size2_total = 0;
                var size3_total = 0;
                var size4_total = 0;
                var size5_total = 0;
                var size6_total = 0;
                var size7_total = 0;
                var size9_total = 0;
                var size8_total = 0;
                var qty_total = 0;

                data.data.color_details.map(item => {
                    size1_total += item.size1;
                    size2_total += item.size2;
                    size3_total += item.size3;
                    size4_total += item.size4;
                    size5_total += item.size5;
                    size6_total += item.size6;
                    size7_total += item.size7;
                    size8_total += item.size8;
                    size9_total += item.size9;
                    qty_total += item.qty;
                })

                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true,
                    size1_total : size1_total,
                    size2_total : size2_total,
                    size3_total : size3_total,
                    size4_total : size4_total,
                    size5_total : size5_total,
                    size6_total : size6_total,
                    size7_total : size7_total,
                    size8_total : size8_total,
                    size9_total : size9_total,
                    qty_total : qty_total
                })
            }
        })
    }


    render(){
        const { report_details } = this.state;
        return(
            <Fragment>
                { this.state.show_details &&
                <div className="row print-area" id="printableArea">
                    <div className="col-md-12">
                        <div >
                        <div className="row" >
                            <div className="col-md-6" style={{ border : '1px solid black', padding : 0, paddingLeft : 5 }}>
                                <h6 style={{fontWeight:"bold"}}>   { report_details.company_details.company } </h6>
                                <p style={{ whiteSpace : 'pre-wrap' }}> Address :  { report_details.company_details.address } </p>
                                <p> Phone :  { report_details.company_details.phone } </p>
                                <p> Mail :  { report_details.company_details.email } </p>
                                <p> GSTIN :  <b style={{fontWeight:"bold"}}> { report_details.company_details.gstno } </b> </p>
                            </div>
                            <div className="col-md-6" style={{ padding : 0,border : '1px solid black' }}>

                                <table width={"100%"} style={{border:"lightgray", margin : 0, padding : 0}}>
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid black' }}> <h5> DELIVERY NOTE </h5> </td>
                                        </tr>
                                        <tr>
                                            <th> DC No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.dcno }</td>
                                            <th> Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                        </tr>
                                        <tr>
                                            <th> Process </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.process }</td>
                                            <th> HSN Code </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.hsnsac} </td>
                                        </tr>
                                        <tr>
                                            <th> Order No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.order_no }</td>
                                            <th> Vehicle No </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.vehicle_no} </td>
                                        </tr>
                                        <tr>
                                            <th> Product </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.product }</td>
                                            <th>  </th>
                                            <td>  </td>
                                        </tr>
                                    </table>
                                </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px solid black', padding : 0, paddingLeft : 5 }}>
                                <b>Delivery to</b>
                                <div style={{ marginLeft : 15 }}>
                                    <p><b>{ report_details.ledger_details.ledger } , </b></p> 
                                    <p>Address : { report_details.ledger_details.delivery_address }</p>
                                    <p> Contact :{ report_details.ledger_details.mobile} </p>
                                    <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ border : '1px solid black', padding : 0}}>
                                <b style={{fontWeight:"bold", marginLeft : 5}}>ACCESSORIES</b>
                                <table border={1} width="100%" style={{border:"lightgray"}}>
                                    <thead>
                                        <tr style={{ backgroundColor : 'lightgray' }}>
                                            <th> <b> Accessories</b></th>
                                            <th> <b> Qty</b></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { report_details.accessories.map(item => 
                                            <tr>
                                                <td>  { item.product }</td>
                                                <td>  { item.qty }
                                                    { " " + item.unit } </td>    
                                            </tr>
                                        )}
                                    </tbody>
                                    
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px'}}>Color</th>
                                            { report_details.color_size_details.map((size,index) => 
                                            size !== "" &&
                                                    <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px'}}>{ size }</th>
                                                ) }
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px'}}>Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        { report_details.color_details.map(item => 
                                            <tr border={1}>

                                                <td style={{border : '1px solid gray', paddingLeft : '5px'}}>{ item.color }</td>
                                                { report_details.color_size_details.map((size,index) => 
                                                    size !== "" && <td style={{border : '1px solid gray', paddingLeft : '5px'}}>{ item["size" + Number(Number(index) + 1)] }</td>
                                                ) }
                                                <td style={{border : '1px solid gray', paddingLeft : '5px'}}>{ item.qty }</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td style={{border : '1px solid gray', paddingLeft : '5px'}}> Grand Total</td>
                                            { report_details.color_size_details.map((size,index) => 
                                            size !== "" &&
                                                    <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px'}}>{ this.state["size" + Number(Number(index) + 1) + "_total"] }</td>
                                                ) }
                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px'}}>{this.state.qty_total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px solid black', padding : 0, paddingLeft : 5 }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                <p style={{ whiteSpace : 'pre-line' }}>  Any discrepancy found in this invoice should be notified imediately Subject to "Tirupur Jurisdiction only.</p>
                            </div>
                            <div className="col-md-3" style={{ border : '1px solid black', padding : 0, paddingLeft : 5}}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    Receiver's Seal Signature
                                </div>
                            </div>
                            <div className="col-md-3" style={{ border : '1px solid black', padding : 0, paddingLeft : 5 }}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    {/* Receiver's Seal Signature */}
                                    For  <b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>
                                </div>
                            </div>
                        </div>
                  
                    </div>
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
