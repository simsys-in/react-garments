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
            from_process_id : '',
            to_process_id : "",
            delivery_qty: '',
            received_qty: "",
            shortage : ''
        }
    }

    componentDidMount = () => {
        getRequest('garments/getOrderProgramReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")

            {
                
                    var item = {
                        from_process_id : '',
                        to_process_id : "",
                        delivery_qty: '',
                        received_qty: "",
                        shortage : ''  
                    }
                   

                  
                
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
                <div className="row print-area" id="printableArea">
                    <div className="col-md-12">
                        <div >
                        <div className="row" >
                            
                            <div className="col-md-12" style={{ padding : 0,border : '1px solid gray' }}>

                                <table width={"100%"} style={{border:"lightgray", margin : 0, padding : 0}}>
                                        <tr> 
                                            <td colSpan={6} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid gray' }}> <h5> ORDER STATUS </h5> </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Order No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.order_no }</td>
                                            <th> Order Date </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.orderDate)} </td>
                                        </tr>
                                        <tr>
                                            <th> Due Date </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.due_date)} </td>
                                            <th> Remaining </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.remaining} </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Style </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.style_id }</td>
                                            <th> Size </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.size} </td>
                                        </tr>
                                       
                                    </table>
                                </div>
                        </div>
                       
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>From Process</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>To Process</th>

                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>ledger</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Delivery Qty</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Recevied Qty</th>   
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Shortage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        { report_details.color_details.map(item => 
                                            <tr>

                                                <td style={{paddingTop: item.from_process_id === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.from_process_id }</td>
                                                <td style={{paddingTop: item.to_process_id === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.to_process_id }</td>
                                                <td style={{paddingTop: item.ledger === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.ledger }</td>
                                                
                                                <td style={{paddingTop: item.delivery_qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.delivery_qty }</td>
                                               
                                                <td style={{paddingTop: item.received_qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.received_qty }</td>
                                               
                                                <td style={{paddingTop: item.shortage === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px', borderRight:'1px solid gray'}}>{  item.shortage }</td>
                                            </tr>
                                        )}
                                        <tr>


                                            <td style={{border : '1px solid gray', paddingLeft : '5px', fontWeight:"bold"}}> Grand Total</td>


                                            {/* { report_details.color_size_details.map((size,index) => 
                                            size !== "" &&
                                                    <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{ this.state.report_details["size" + Number(Number(index) + 1) + "_total"] }</td>
                                                ) }


                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{report_details.inventory_qty_total !=="" && Number(report_details.inventory_qty_total).toFixed(2)}</td> */}

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                <p style={{ whiteSpace : 'pre-line' }}>  Any discrepancy found in this invoice should be notified imediately Subject to "Tirupur Jurisdiction only.</p>
                            </div>
                            <div className="col-md-3" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5}}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    Receiver's Seal Signature
                                </div>
                            </div>
                            <div className="col-md-3" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>
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
