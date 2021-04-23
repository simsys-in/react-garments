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
        getRequest('garments/getYarnPurchaseOrderReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                if(data.data.inventory.length < 7)
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
                    for(var i=data.data.inventory.length; i < 7; i++ )
                    {
                        data.data.inventory.push(item);
                        if(i === 6)
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
                                <b>Consignee</b>
                                <div style={{ marginLeft : 15 }}>
                                    <p><b>{ report_details.ledger_details.ledger } , </b></p> 
                                    <p>Address : { report_details.ledger_details.address }</p>
                                    <p> Contact :{ report_details.ledger_details.mobile} </p>
                                    <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p>
                                </div>
                            {/* </div> */}
                            </div>
                            <div className="col-md-4" style={{ padding : 0,border : '1px solid gray' }}>

                                <table width={"100%"} style={{border:"light gray", margin : 0, padding : 0}} border="1">
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px lightgray' }}> <h5>YARN PURCHASE ORDER </h5> </td>
                                        </tr>
                                        <tr>
                                            <th> P.O No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.vouno } </td>
                                            <th> P.O Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
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
                                          
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 250}}>YARN</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>Count</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>GSM</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>HSN/SAC</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 200}}>Qty / Unit</th>
                                            {/* <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>UNIT</th> */}
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 100}}>Rate</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', width : 200}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { report_details.inventory.map(item => 
                                            <tr border={1}>

                                    {/* <td style={{border : '1px lightgray', paddingLeft : '5px'}}>{ item.size_id }</td> */}
                                               
                                                <td style={{ paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.product }</td>

                                                <td style={{ paddingTop: item.count === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.count }</td>
                                                <td style={{ paddingTop: item.gsm === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', borderRight : '1px solid grey'}}>{ item.gsm }</td>

                                                <td style={{paddingTop: item.hsnsac === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.hsnsac }</td>

                                                <td style={{paddingTop: item.qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qty !=="" && Number(item.qty).toFixed(3) + " " + item.unit }</td>
                                                {/* <td style={{paddingTop: item.unit === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.unit }</td> */}


                                                <td style={{paddingTop: item.rate === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.rate !=="" && Number(item.rate).toFixed(2) }</td>

                                                <td style={{paddingTop: item.amount === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px', borderRight : '1px solid grey'}}>{ item.amount !=="" && Number(item.amount).toFixed(2) }</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}} colSpan={4}>GRAND TOTAL</td>
                                           
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}>{report_details.inventory_qty_total !== "" && Number(report_details.inventory_qty_total).toFixed(3)}</td>

                                            {/* <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}></td> */}
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}></td>
                                            
                                            <td style={{fontWeight:"bold" , border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}>{report_details.inventory_amount_total !== "" && Number(report_details.inventory_amount_total).toFixed(2)}</td>
                                            
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

