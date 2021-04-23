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
        getRequest('garments/getYarnInwardReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                var total_kg = 0;
                data.data.inventory.map(item => {
                    total_kg += item.qty_kg;
                })
                // data.data.inventory
                if(data.data.inventory.length < 7)
                {
                    var item = {
                        product : '',
                        gsm : '',
                        counts : '',
                        qtybag_per : '',
                        qty_bag : '',
                        qty_kg : '',
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
                                inventory_qty_kg_total : total_kg
                            })

                        }
                    }
                }
                else{
                    this.setState({
                        ...this.state,
                        report_details : data.data,
                        show_details : true,
                        inventory_qty_kg_total : total_kg
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
                <div className="row print-area" id="printableArea" border={"light gray"} style={{border:"1px  gray"}} >
                    <br></br><br></br>
                    <div className="col-md-12" style={{border:"1px solid gray"}}>
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
                            <div className="col-md-6" style={{ padding : 0, border : '1px  black' }}>

                                <table width={"100%"} style={{border:"gray", margin : 0, padding : 0}}>
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px lightgray' }}> <h5>YARN DELIVERY NOTE</h5> </td>
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
                                        
                                            <th> Vehicle</th>
                                            <td style={{fontWeight:"bold"}}> {report_details.vehicle_no}</td>
                                        </tr>
                                        
                                       
                                        
                                    </table>
                                </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%"  >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                          
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >FABRIC</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >GSM</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Counts</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Qty Per</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Qty Bag</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Qty Kg </th>
                                           
                                           
                                        </tr>
                                    </thead>
                                    <tbody >
                                    { report_details.inventory.map((item, index) => 
                                            <tr key={index}>
                                                <td style={{ paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.product }</td>

                                                <td style={{ paddingTop: item.gsm === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.gsm }</td>
                                                <td style={{ paddingTop: item.counts === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.counts }</td>

                                                <td style={{ paddingTop: item.qtybag_per === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qtybag_per }</td>

                                                <td style={{ paddingTop: item.qty_bag === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qty_bag }</td>

                                                <td style={{ paddingTop: item.qty_kg === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px' }}>{ item.qty_kg !== "" && Number(item.qty_kg).toFixed(2) }</td>
                                                
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{fontWeight:"bold", border:'1px solid gray', textAlign:'right', paddingRight:'5px'}} colSpan={5}>GRAND TOTAL</td>
                                          
                                            <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{this.state.inventory_qty_kg_total !== "" && Number(this.state.inventory_qty_kg_total).toFixed(2) }</td>
                                          
                                            
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
                                    <br></br>
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

