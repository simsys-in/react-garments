// import React, { Fragment, PureComponent } from 'react';
// import { withRouter } from 'react-router';
// import { connect } from 'react-redux';
// import { getRequest } from '../../../helpers/apihelper';
// import { getStandardDate } from '../../../helpers/timer';

// class Report extends PureComponent {
//     constructor(props){
//         super(props);
//         this.state ={
//             report_details : {},
//             show_details : false
//         }
//     }

//     componentDidMount = () => {
//         getRequest('transactions/getJobworkInvoiceReport?id=' + this.props.itemId).then(data => {
//             if(data.status === "info")
//             {
//                 this.setState({
//                     ...this.state,
//                     report_details : data.data,
//                     show_details : true
//                 })
//             }
//         })
//     }


//     render(){
//         const { report_details } = this.state;
//         return(
//             <Fragment>
//                 { this.state.show_details &&
//                     <div id="printable-area">
//                         <div className="row">
//                             <div className="col-6" style={{ border : '1px lightgray' }} >
//                                 <b>{ report_details.company_details.company }</b><br/>
//                                 <p> Address :  { report_details.company_details.address } </p>
//                                 <p> Phone :  { report_details.company_details.phone } </p>
//                                 <p> Mail :  { report_details.company_details.email } </p>
//                                 <p> GSTIN :  <b> { report_details.company_details.email } </b> </p>
//                             </div>
//                             <div className="col-6">
//                                 <table border={1} width={"100%"}>
//                                     <tr>
//                                         <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center' }}> <b> DELIVERY NOTE </b> </td>
//                                     </tr>
//                                     <tr>
//                                         <th> DC No </th>
//                                         <td> { report_details.dcno }</td>
//                                         <th> Dated </th>
//                                         <td> { getStandardDate(report_details.vou_date)} </td>
//                                     </tr>
//                                     <tr>
//                                         <th> Process </th>
//                                         <td> { report_details.process }</td>
//                                         <th> HSN Code </th>
//                                         <td> {report_details.hsnsac} </td>
//                                     </tr>
//                                     <tr>
//                                         <th> Order No </th>
//                                         <td> { report_details.order_no }</td>
//                                         <th> Vehicle No </th>
//                                         <td> {report_details.vehicle_no} </td>
//                                     </tr>
//                                     <tr>
//                                         <th> Product </th>
//                                         <td> { report_details.product }</td>
//                                         <th>  </th>
//                                         <td>  </td>
//                                     </tr>
//                                 </table>
//                             </div>

//                             <table border={1} width="100%">
//                                 <thead>
//                                     <th>Color</th>
//                                     { this.state.size_data_for_order.map((item, index) => 
//                                                 item !== "" && <th key={index} width="100px"> <b> {item}</b></th>
//                                             ) }
//                                 </thead>
//                                 <tbody>
//                                     { report_details.color_details.map(item => 
//                                         <tr>
//                                             <td>{ item.color }</td>
//                                             <td>{ item.size1 }</td>
//                                             <td>{ item.size2 }</td>
//                                             <td>{ item.size3 }</td>
//                                             <td>{ item.size4 }</td>
//                                             <td>{ item.size5 }</td>
//                                             <td>{ item.size6 }</td>
//                                             <td>{ item.size7 }</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 }
//             </Fragment>
//         )
//     }
// }
// const mapStateToProps = (state) => {
//     return {
//         store: state
//     }
// }

// const mapDispatchToProps = {
//   }
  


// export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Report));


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
            // size1_total : 0,
            // size2_total : 0,
            // size3_total : 0,
            // size4_total : 0,
            // size5_total : 0,
            // size6_total : 0,
            // size7_total : 0,
            // size8_total : 0,
            // size9_total : 0,
            // qty_total : 0
        }
    }

    componentDidMount = () => {
        getRequest('transactions/getYarnInvoiceReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                // var size1_total = 0;
                // var size2_total = 0;
                // var size3_total = 0;
                // var size4_total = 0;
                // var size5_total = 0;
                // var size6_total = 0;
                // var size7_total = 0;
                // var size9_total = 0;
                // var size8_total = 0;
                // var qty_total = 0;

                // data.data.color_details.map(item => {
                //     size1_total += item.size1;
                //     size2_total += item.size2;
                //     size3_total += item.size3;
                //     size4_total += item.size4;
                //     size5_total += item.size5;
                //     size6_total += item.size6;
                //     size7_total += item.size7;
                //     size8_total += item.size8;
                //     size9_total += item.size9;
                //     qty_total += item.qty;
                // })

                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true,
                    // size1_total : size1_total,
                    // size2_total : size2_total,
                    // size3_total : size3_total,
                    // size4_total : size4_total,
                    // size5_total : size5_total,
                    // size6_total : size6_total,
                    // size7_total : size7_total,
                    // size8_total : size8_total,
                    // size9_total : size9_total,
                    // qty_total : qty_total
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
                    <div className="col-md-12">
                        <div >
                        <div className="row flex-nowrap" >
                            <div className="col-md-8" style={{ border : '1px light gray', padding : 0, paddingLeft : 5 }}>

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
                            <div className="col-md-4" style={{ padding : 0,border : '1px lightgray' }}>

                                <table width={"100%"} style={{border:"lightgray", margin : 0, padding : 0}} border="1">
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px lightgray' }}> <h5> Jobwork Invoice </h5> </td>
                                        </tr>
                                        <tr>
                                            <th> DC No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.vouno } </td>
                                            <th> Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                        </tr>
                                        <tr>
                                            <th> Process </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.process } </td>
                                            <th> HSN Code </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.hsnsac}</td>
                                        </tr>
                                        <tr>
                                            <th> Order No </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.order_no}</td>
                                        
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
                                          
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>FABRIC</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>GSM</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>Counts</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>Qty Kg </th>
                                           
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>Rate</th>
                                            <th style={{fontWeight:"bold", border : '1px light gray', paddingLeft : '5px'}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { report_details.inventory.map(item => 
                                            <tr border={1}>

                                    {/* <td style={{border : '1px lightgray', paddingLeft : '5px'}}>{ item.size_id }</td> */}
                                               
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.fabric_id }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.gsm }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.counts }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.qty_kg }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.rate }</td>
                                                <td style={{border : '1px light gray', paddingLeft : '5px'}}>{ item.amount }</td>
                                            </tr>
                                        )}

                                        <tr>
                                            <td>GRAND TOTAL</td>
                                            <td></td>
                                            <td></td>
                                            <td>{report_details.inventorytotal[0].inventory_qty_total}</td>
                                            <td></td>
                                            <td>{report_details.inventorytotal[0].inventory_amount_total}</td>
                                            
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

