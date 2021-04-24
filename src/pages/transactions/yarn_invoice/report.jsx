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
        getRequest('garments/getYarnInvoiceReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                if(data.data.inventory.length < 14)
                {
                    var item = {
                        fabric_id : '',
                        gsm : '',
                        // counts : '',
                        amount : '',
                        rate : '',
                        qty_kg : '',
                    }
                    for(var i=data.data.inventory.length; i < 14; i++ )
                    {
                        data.data.inventory.push(item);
                        if(i === 13)
                        {
                            this.setState({
                                ...this.state,
                                report_details : data.data,
                                show_details : true,
                            })

                        }
                    }
                }
                else{
                    this.setState({
                        ...this.state,
                        report_details : data.data,
                        show_details : true,
                    })
                }
               
              
            }
        })
    }


    render(){
        const { report_details } = this.state;
        return(
            <Fragment>
                { this.state.show_details &&
                <div className="row print-area" id="printableArea" border={"light gray"} style={{border:"1px solid black"}}>
                        <br></br><br></br>
                    <div className="col-md-12">
                        <div >
                        <div className="row flex-nowrap" >
                            <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>

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
                            <div className="col-md-6" style={{ padding : 0,border : '1px solid gray' }}>

                                <table width={"100%"} style={{border:"light gray", margin : 0, padding : 0}} >
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px lightgray' }}> <h5>YARN INVOICE </h5> </td>
                                        </tr>
                                        <tr>
                                            <th style={{paddingLeft : '5px'}}> DC No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.vouno } </td>
                                            <th> Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                        </tr>
                                        <tr>
                                            <th style={{paddingLeft : '5px'}}> Process </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.process } </td>
                                            <th> HSN Code </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.hsnsac}</td>
                                        </tr>
                                        <tr>
                                            <th style={{paddingLeft : '5px'}}> Order No </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.order_no}</td>
                                        
                                            <th></th>
                                            <td></td>
                                        </tr>
                                        
                                       
                                        
                                    </table>
                                </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" style={{border:"lightgray"}}>
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                          
                                            <th style={{fontWeight:"bold", border : '1px solid gray', textAlign:"center", paddingLeft : '5px'}}>FABRIC</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', textAlign:"center", paddingLeft : '5px'}}>GSM</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', textAlign:"center", paddingLeft : '5px'}}>Counts</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', textAlign:"center", paddingLeft : '5px'}}>Qty Kg </th>
                                           
                                            <th style={{fontWeight:"bold", border : '1px solid gray', textAlign:"center", paddingLeft : '5px'}}>Rate</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', textAlign:"center", paddingLeft : '5px'}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { report_details.inventory.map(item => 
                                            <tr border={1}>

                                    {/* <td style={{border : '1px lightgray', paddingLeft : '5px'}}>{ item.size_id }</td> */}
                                               
                                                <td style={{ paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.product }</td>

                                                <td style={{paddingTop: item.gsm === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.gsm }</td>

                                                <td style={{paddingTop: item.counts === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.counts }</td>

                                                <td style={{paddingTop: item.qty_kg === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qty_kg !=="" && Number(item.qty_kg ).toFixed(3) }</td>

                                                <td style={{paddingTop: item.rate === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.rate }</td>

                                                <td style={{paddingTop: item.amount === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px', borderRight : '1px solid grey'}}>{ item.amount !=="" && Number(item.amount).toFixed(2) }</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}} colSpan={3}>GRAND TOTAL</td>
                                           
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}>{report_details.inventorytotal[0].inventory_qty_kg_total !== "" && Number(report_details.inventorytotal[0].inventory_qty_kg_total).toFixed(3)}</td>

                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}></td>
                                            
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}>{report_details.inventorytotal[0].inventory_amount_total !== "" && Number(report_details.inventorytotal[0].inventory_amount_total).toFixed(2)}</td>
                                            
                                        </tr>
                                         </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5 }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                {/* <p style={{ whiteSpace : 'pre-line' }}> Payment should be made by DD/pay order/Cheque or  RTGS in favour of "<b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>"</p> */}
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

