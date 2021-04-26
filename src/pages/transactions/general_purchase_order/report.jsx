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
        getRequest('garments/getGeneralPurchaseOrderReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                var total_qty = 0;
                var total_amount = 0;
                data.data.inventory.map(item=>{
                    total_qty += item.qty;
                    total_amount += Number(item.amount)
                })
                if(data.data.inventory.length < 10)
                {
                    var item = {
                        yarn_id : '',
                        hsnasc : '',
                        count : '',
                        gsm : '',
                        amount : '',
                        rate : '',
                        unit_id : '',
                        qty : '',
                    }
                    for(var i=data.data.inventory.length; i < 10; i++ )
                    {
                        data.data.inventory.push(item);
                        if(i === 9)
                        {
                            this.setState({
                                ...this.state,
                                report_details : data.data,
                                show_details : true,
                                inventory_qty_total : total_qty,
                                inventory_amount_total : total_amount
                            })

                        }
                    }
                }
                else{
                    this.setState({
                        ...this.state,
                        report_details : data.data,
                        show_details : true,
                        inventory_qty_total : total_qty,
                        inventory_amount_total : total_amount
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
                                <b>Consignee</b>
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
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid grey' }}> <h5>PURCHASE ORDER </h5> </td>
                                        </tr>
                                        <tr>
                                            <th style={{paddingLeft : '5px'}}>  P.O No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.vouno } </td>
                                            <th style={{paddingLeft : '5px'}}> P.O Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                        </tr>
                                        <tr></tr>
                                        <tr></tr>
                                        <tr>
                                            <th style={{paddingLeft : '5px'}}>Payment Mode</th>
                                            <td style={{fontWeight:"bold"}}> {report_details.payment_mode}</td>
                                        </tr>
                                        {/* <tr>
                                            <th> Process </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.process } </td>
                                            <th> HSN Code </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.hsnsac}</td>
                                        </tr>
                                        <tr>
                                            <th> Order No </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.order_no}</td>
                                        
                                            <th></th>
                                            <td></td>
                                        </tr> */}
                                        
                                       
                                        
                                    </table>
                                </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" style={{border:"lightgray"}}>
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                          
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 350 , textAlign:"center"}}>PRODUCT</th>
                                            {/* <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>Count</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>GSM</th> */}
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100, textAlign:"center"}}>HSN/SAC</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100, textAlign:"center"}}>Qty / Unit</th>
                                            {/* <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>UNIT</th> */}
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100, textAlign:"center"}}>Rate</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100, textAlign:"center"}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { report_details.inventory.map(item => 
                                            <tr border={1}>

                                    {/* <td style={{border : '1px lightgray', paddingLeft : '5px'}}>{ item.size_id }</td> */}
                                               
                                                <td style={{ paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.product }</td>

                                                {/* <td style={{ paddingTop: item.count === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.count }</td>
                                                <td style={{ paddingTop: item.gsm === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.gsm }</td> */}

                                                <td style={{paddingTop: item.hsnsac === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.hsnsac }</td>

                                                <td style={{paddingTop: item.qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qty !=="" && Number(item.qty).toFixed(3) + " " + item.unit }</td>
                                                {/* <td style={{paddingTop: item.unit === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.unit }</td> */}


                                                <td style={{paddingTop: item.rate === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.rate !=="" && Number(item.rate).toFixed(2) }</td>

                                                <td style={{paddingTop: item.amount === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px', borderRight : '1px solid grey'}}>{ item.amount !=="" && Number(item.amount).toFixed(2) }</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}} colSpan={2}>GRAND TOTAL</td>
                                           
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}>{this.state.inventory_qty_total !== "" && Number(this.state.inventory_qty_total).toFixed(3)}</td>

                                            {/* <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}></td> */}
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}></td>
                                            
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}>{this.state.inventory_amount_total !== "" && Number(this.state.inventory_amount_total).toFixed(2)}</td>
                                            
                                        </tr>
                                         </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5 }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                {/* <p style={{ whiteSpace : 'pre-line' }}> Payment should be made by DD/pay order/Cheque or  RTGS in favour of "<b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>"</p> */}
                                <p style={{ whiteSpace : 'pre-line' }}>{ report_details.payment_terms_conditions}</p>
                            </div>
                            <div className="col-md-3" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5}}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    <br />
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

