import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getRequest } from '../../../helpers/apihelper';
import { getStandardDate } from '../../../helpers/timer';
import { humanize } from '../../../helpers/amount';



class Report extends PureComponent {
    constructor(props){
        super(props);
        this.state ={
            report_details : {},
            show_details : false,
         
        }
    }

    componentDidMount = () => {
        getRequest('garments/getPaymentReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                var total_amount = data.data.amount;
                data.data.inventory.map(item =>{
                    total_amount += Number(item.amount);
                })
                // data.data.inventory
                if(data.data.inventory.length < 10)
                {
                    var item = {
                        narration : '',
                        amount : '',
                      
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
                <div className="row print-area" id="printableArea" border={"light gray"} style={{border:"1px  gray"}} >
                    <br></br><br></br>
                    <div className="col-md-12"
                    //  style={{border:"1px solid gray"}}
                     >
                        <div >
                        <div className="row flex-nowrap" >
                        <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5,borderBottom:'0' }}>
                        <h6 style={{fontWeight:"bold"}}>   { report_details.company_details.company } </h6>
                                <div style={{ marginLeft : 15 }}>
                                <p style={{ whiteSpace : 'pre-wrap' }}> Address :  { report_details.company_details.address } </p>
                                <p> Phone :  { report_details.company_details.phone } </p>
                                <p> Mail :  { report_details.company_details.email } </p>
                                {/* <p> GSTIN :  <b style={{fontWeight:"bold"}}> { report_details.company_details.gstno } </b> </p> */}
                                </div>

                        </div>

                            <div className="col-md-6" style={{ padding : 0,border:'1px solid grey', borderLeft:'0',borderBottom:'1px solid grey',borderTop:'0' }}>

                        <table width={"100%"} style={{border:"1px solid gray", margin : 0, padding : 0,borderLeft:'0',borderRight:'0'}} >
                                <tr> 
                                    <td colSpan={2} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid grey', borderLeft:'0' }}> <h5>PAYMENT VOUCHER </h5> </td>
                                </tr>
                                <tr style={{textAlign:'center'}}>
                                  
                                    <th > Vou No </th>
                                    <td style={{fontWeight:"bold"}}> { report_details.refno} </td>
                                </tr>
                                <tr style={{textAlign:'center'}}>
                                    <th > Dated </th>
                                    <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>

                                </tr>
                                
                            
                                
                            </table>
                        </div>
                        


                        </div>
                        <div className="row flex-nowrap" >
                        <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5,borderBottom:'0' }}>

                    
                                    <b>Delivery to</b>
                                    <div style={{ marginLeft : 15 }}>
                                        <p><b>{ report_details.ledger_details.ledger } , </b></p> 
                                        <p>Address : { report_details.ledger_details.address }</p>
                                        <p> Contact :{ report_details.ledger_details.mobile} </p>
                                        {/* <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p> */}
                                    </div>
                                    {/* </div> */}
                                    </div>
                                    <div className="col-md-6" style={{ padding : 0,border:'1px solid grey', borderLeft:'0',borderBottom:'0',borderTop:'0' }}>

                                    <b> Narration</b>
                                    <div style={{ marginLeft : 15 }}>
                                    <p>  { report_details.narration }</p>

                                        </div>


                                    </div>                        


                        </div>
                        
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 , borderRight:'1px solid grey'}}>
                                <table  width="100%"  >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                          
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >DESCRIPTION</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >AMOUNT</th>
                                            {/* <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Counts</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Qty Per</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Qty Bag</th>
                                            <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Qty Kg </th> */}
                                           
                                           
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr>
                                            <td style={{border:'1px solid grey', borderBottom:'0'}}>{report_details.account_ledger}</td>
                                            <td style={{ textAlign:'right'}}>{Number(report_details.amount).toFixed(2)}</td>
                                        </tr>
                                    { report_details.inventory.map((item, index) => 
                                            <tr key={index}>
                                                <td style={{ paddingTop: item.narration === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{  item.account_ledger + " " +  item.narration  }  
                                                
                                                </td>

                                                <td style={{ paddingTop: item.amount === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.amount }</td>

                                                {/* <td style={{ paddingTop: item.counts === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.counts }</td>

                                                <td style={{ paddingTop: item.qtybag_per === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qtybag_per }</td>

                                                <td style={{ paddingTop: item.qty_bag === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qty_bag }</td> */}

                                                {/* <td style={{ paddingTop: item.qty_kg === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px' }}>{ item.qty_kg !== "" && Number(item.qty_kg).toFixed(2) }</td> */}
                                                
                                            </tr>
                                        )}

                                        <tr>
                                            <td style={{fontWeight:"bold", border:'1px solid gray', textAlign:'right', paddingRight:'5px'}}     >GRAND TOTAL</td>
                                          
                                            {/* <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{this.state.inventory_amount_total !== "" && Number(this.state.inventory_amount_total).toFixed(2) }</td> */}

                                            <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{Number(this.state.inventory_amount_total).toFixed(2)}</td>
                                          
                                            
                                        </tr>
                                         </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ border : '1px  solid gray', padding : 0, paddingLeft : 5,borderTop:'0' }}>
                                {/* <p style={{textDecorationLine: 'underline'}}>Terms</p> */}
                                {/* <p style={{ whiteSpace : 'pre-line' }}> Payment should be made by DD/pay order/Cheque or  RTGS in favour of "<b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>"</p> */}
                                <p style={{ whiteSpace : 'pre-line',borderTop:'0' }}> Rupees in Words :  { humanize(this.state.inventory_amount_total)}</p>
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

