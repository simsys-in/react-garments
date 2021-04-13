
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
            
        }
    }

    componentDidMount = () => {
        getRequest('transactions/getJobworkInvoiceReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                
                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true,
                    
                })
            }
        })
    }


    render(){
        const { report_details } = this.state;
        return(
            <Fragment>
                { this.state.show_details &&
                <div className="row print-area" id="printableArea" border={"light gray"}>
                    <br></br><br></br>                  
                      <div className="col-md-12">
                        <div >
                        <div className="row flex-nowrap" >
                            <div className="col-md-8" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>

                                <h6 style={{fontWeight:"bold"}}>   { report_details.company_details.company } </h6>
                                <div style={{ marginLeft : 15 }}>
                                <p style={{ whiteSpace : 'pre-wrap' }}> Address :  { report_details.company_details.address } </p>
                                <p> Phone :  { report_details.company_details.phone } </p>
                                <p> Mail :  { report_details.company_details.email } </p>
                                <p> GSTIN :  <b style={{fontWeight:"bold"}}> { report_details.company_details.gstno } </b> </p>
                                </div>
                                <hr></hr>
                                {/* <div className="col-md-6" style={{ border : '1px lightgray', padding : 0, paddingLeft : 5 }}> */}
                                <b>Delivery to</b>
                                <div style={{ marginLeft : 15 }}>
                                    <p><b>{ report_details.ledger_details.ledger } , </b></p> 
                                    <p>Address : { report_details.ledger_details.delivery_address }</p>
                                    <p> Contact :{ report_details.ledger_details.mobile} </p>
                                    <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p>
                                </div>
                            {/* </div> */}
                            </div>
                            <div className="col-md-4" style={{ padding : 0,border : '1px solid gray' }}>

                                <table width={"100%"} style={{border:"lightgray", margin : 0, padding : 0}} border="1">
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px lightgray' }}> <h5> Jobwork Invoice </h5> </td>
                                        </tr>
                                        <tr>
                                            <th> DC No <br />
                                            <p style={{fontWeight:"bold"}}> { report_details.vouno }</p></th>
                                            <th> Dated <br />
                                            <p style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </p></th>
                                        </tr>
                                        <tr>
                                            <th> HSN Code <br />
                                            <p style={{fontWeight:"bold"}}> {report_details.hsnsac} </p></th>
                                        
                                            <th></th>
                                        </tr>
                                        
                                       
                                        
                                    </table>
                                </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" style={{border:"lightgray"}} border={1} >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                          
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>ORDER NO</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>PRODUCT</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>SIZE</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>QTY </th>
                                           
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>RATE</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { report_details.inventory.map(item => 
                                            <tr border={1}>

                                    {/* <td style={{border : '1px lightgray', paddingLeft : '5px'}}>{ item.size_id }</td> */}
                                               
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.order_no }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.product }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.size }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.qty }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.rate }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.amount }</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{fontWeight:"bold"}}>GRAND TOTAL</td>
                                            <td></td>
                                            <td></td>
                                            <td style={{fontWeight:"bold"}}>{report_details.inventorytotal[0].inventory_qty_total}</td>
                                            <td></td>
                                            <td style={{fontWeight:"bold"}}>{report_details.inventorytotal[0].inventory_amount_total}</td>
                                            
                                        </tr>
                                         </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5 }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                <p style={{ whiteSpace : 'pre-line' }}> Payment should be made by DD/pay order/Cheque or  RTGS in favour of "<b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>"</p>
                                <p style={{ whiteSpace : 'pre-line' }}>  Any discrepancy found in this invoice should be notified imediately Subject to "Tirupur Jurisdiction only".</p>
                            </div>
                            <div className="col-md-3" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5}}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    Receiver's Seal Signature
                                </div>
                            </div>
                            <div className="col-md-3" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5 }}>
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

