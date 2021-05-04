
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
        getRequest('garments/getJobworkInvoiceReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                var total_qty = 0;
                    var total_amount = 0;
                    data.data.inventory.map(item=>{
                        total_qty += item.qty;
                        total_amount += item.amount;
                    })
                if(data.data.inventory.length < 30)
                {
                    
                    var item = {
                       order_no :'',
                        product : '',
                        size : '',
                        qty : '',
                        rate : '',
                        amount : '',
                    }
                    for(var i=data.data.inventory.length; i < 30; i++ )
                    {
                        data.data.inventory.push(item);
                        if(i === 29)
                        {
                            this.setState({
                                ...this.state,
                                report_details : data.data,
                                show_details : true,
                                inventory_amount_total : total_amount,
                                inventory_qty_total : total_qty
                            })

                        }
                    }
                }
                else{
                    this.setState({
                        ...this.state,
                        report_details : data.data,
                        show_details : true,
                        inventory_amount_total : total_amount,
                        inventory_qty_total : total_qty
                    })
                }
                
                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true,
                    inventory_amount_total : total_amount,
                    inventory_qty_total : total_qty
                    
                })
            }
        })
    }


    render(){
        const { report_details } = this.state;
        return(
            <Fragment>
                { this.state.show_details &&
                <div className="row print-area" id="printableArea" border={1}>
                    <br></br><br></br>                  
                      <div className="col-md-12">
                        <div >
                        <div className="row flex-nowrap" >
                            <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5, borderRight:'0', borderBottom:'0' }}>

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
                                    <p>Address : { report_details.ledger_details.address }</p>
                                    <p> Contact :{ report_details.ledger_details.mobile} </p>
                                    <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p>
                                </div>
                            {/* </div> */}
                            </div>
                            <div className="col-md-6" style={{ padding : 0,border : '1px solid grey' ,textAlign:"center", borderBottom:'0' }}>

                                <table width={"100%"} style={{border:"1px solid grey",textAlign:"center", margin : 0, padding : 0,  borderLeft:'0'}} border="1">
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray',textAlign:"center", textAlign: 'center', border : '1px lightgray' }}> <h5> Jobwork Invoice </h5> </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> DC No <br />
                                            <p style={{fontWeight:"bold"}}> { report_details.vouno }</p></th>
                                            <th> Dated <br />
                                            <p style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </p></th>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> HSN Code <br />
                                            <p style={{fontWeight:"bold"}}> {report_details.hsnsac} </p></th>

                                            <th  style={{paddingLeft : '5px'}}> Vehicle No <br />
                                            <p style={{fontWeight:"bold"}}> {report_details.vehicle_no} </p></th>
                                        
                                          
                                        </tr>
                                        
                                       
                                        
                                    </table>
                                </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%"  >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                          
                                            <th style={{fontWeight:"bold",border : '1px solid gray', textAlign:"center",  paddingLeft : '5px'}}>ORDER NO</th>
                                            <th style={{fontWeight:"bold",border : '1px solid gray', textAlign:"center",  paddingLeft : '5px'}}>PRODUCT</th>
                                            <th style={{fontWeight:"bold",border : '1px solid gray', textAlign:"center",  paddingLeft : '5px'}}>SIZE</th>
                                            <th style={{fontWeight:"bold",border : '1px solid gray', textAlign:"center",  paddingLeft : '5px'}}>QTY </th>
                                           
                                            <th style={{fontWeight:"bold",border : '1px solid gray', textAlign:"center",  paddingLeft : '5px'}}>RATE</th>
                                            <th style={{fontWeight:"bold",border : '1px solid gray', textAlign:"center",  paddingLeft : '5px'}}>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { report_details.inventory.map(item => 
                                            <tr>

                                    {/* <td style={{border : '1px lightgray', paddingLeft : '5px'}}>{ item.size_id }</td> */}
                                               
                                                <td style={{paddingTop: item.order_no === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.order_no }</td>

                                                <td style={{paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.product }</td>

                                                <td style={{paddingTop: item.size === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.size }</td>

                                                <td style={{paddingTop: item.qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',  textAlign : 'right', paddingRight:'5px'}}>{ item.qty }</td>

                                                <td style={{paddingTop: item.rate === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',  textAlign : 'right', paddingRight:'5px'}}>{ item.rate }</td>

                                                <td style={{paddingTop: item.amount === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',  textAlign : 'right', paddingRight:'5px',  borderRight  : '1px solid grey'}}>{ item.amount !=="" && Number(item.amount).toFixed(2) }</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{border : '1px solid gray', paddingLeft : '5px',textAlign:'right', paddingRight:'5px'}} colSpan={3}>GRAND TOTAL</td>
                                           
                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px',textAlign:'right', paddingRight:'5px'}}>{this.state.inventory_qty_total}</td>
                                            <td style={{border:'1px solid grey'}}></td>

                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px',textAlign:'right', paddingRight:'5px'}}>{this.state.inventory_amount_total !=="" && Number(this.state.inventory_amount_total).toFixed(2)}</td>
                                            
                                        </tr>
                                         </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5 , borderRight:'0', borderTop:'0' }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                <p style={{ whiteSpace : 'pre-line' }}> Payment should be made by DD/pay order/Cheque or  RTGS in favour of "<b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>"</p>
                                <p style={{ whiteSpace : 'pre-line' }}>  Any discrepancy found in this invoice should be notified imediately Subject to "Tirupur Jurisdiction only".</p>
                            </div>
                            <div className="col-md-3" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5, borderRight:'0', borderTop:'0'}}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    Receiver's Seal Signature
                                </div>
                            </div>
                            <div className="col-md-3" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5,  borderTop:'0' }}>
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

