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
        getRequest('garments/getGarmentsDeliveryNotePrint?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                if(data.data.inventories.length < 4)
                {
                    var item = {
                        product : '',
                        color : '',
                        hsnasc : '',
                        gst : '',
                        size1 : '',
                        size2 : '',
                        size3 : '',
                        size4 : '',
                        size5 : '',
                        size6 : '',
                        size7 : '',
                        size8 : '',
                        size9 : '',
                        qty : '',
                        
                       
                       size_data : [ "","","","","","","","","" ],
                       unit : '',
                    }
                    // var size_obj = {
                    //     size_name : "",
                    //     qty : "",
                    //     rate : "",
                    // }
                    // for(i=item.size_data.length; i < 9; i++)
                    // {
                    //     item.size_data.push(size_obj);
                    // }

                    for(var i=data.data.inventories.length; i < 4; i++ )
                    {
                        data.data.inventories.push(item);
                        if(i === 3)
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
                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true
                })
            }
        })
    }

    getTaxValue = (perc, amount) => {
        return Number((Number(perc) / 100) * Number(amount));
    }

    getRoundOffValue = (perc,amount) => {
        var sgst = this.getTaxValue(perc,amount)
        var cgst = this.getTaxValue(perc,amount)
        var finalValue = amount + sgst + cgst;
        var roundValue = Math.round(finalValue);
        return finalValue - roundValue;
    }

    getFinalValue = (perc,amount) => {
        var sgst = this.getTaxValue(perc,amount)
        var cgst = this.getTaxValue(perc,amount)
        var finalValue = amount + sgst + cgst;
        var roundValue = Math.round(finalValue);
        return roundValue;
    }

    render(){
        const { report_details } = this.state;
        const cgst = this.getTaxValue(2.5, report_details.inventory_amount_total)
        const sgst = this.getTaxValue(2.5, report_details.inventory_amount_total)
        const roundOff = this.getRoundOffValue(2.5, report_details.inventory_amount_total)
        const finalValue = this.getFinalValue(2.5, report_details.inventory_amount_total)
        return(
            <Fragment>
                { this.state.show_details &&
                <div className="row print-area" id="printableArea" >
                    <div className="col-md-12">
                        <div >
                            <div className="row flex-nowrap">
                                <div className="col-md-4" style={{ border : '1px solid grey' }}>
                                    <h4>{ report_details.company_details.company }</h4>
                                    <b>GSTIN : {report_details.company_details.gstno}</b>
                                </div>
                                <div className="col-md-4" style={{ border : '1px solid grey' }}></div>
                                <div className="col-md-4" style={{ padding : 0 }}>
                                    <table width="100%" border={1} style={{ padding : 0, margin : 0 }}>
                                        <thead>
                                            <tr>
                                                <th colSpan={4} style={{ textAlign :'center' }} >
                                                    <b >TAX INVOICE</b>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Invoice No
                                                </td>
                                                <td width={40}> {report_details.vouno} </td>
                                                <td> Invoice Date </td>
                                                <td> { getStandardDate(report_details.vou_date) } </td>
                                            </tr>
                                            <tr>
                                                <td> Credit Days </td>
                                                <td></td>
                                                <td> Transport Name </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row flex-nowrap">
                                <div className="col-md-4" style={{ border : '1px solid grey' }}>
                                    <p>Invoice to</p>
                                    <b>{ report_details.ledger_details.ledger }</b>
                                    <p> Address : { report_details.ledger_details.address }</p>
                                    <p> Mobile No : { report_details.ledger_details.mobile }</p>
                                    <p> E-Mail : { report_details.ledger_details.email }</p>
                                    <b> GST No : { report_details.ledger_details.gstno }</b>
                                </div>
                                <div className="col-md-4" style={{ border : '1px solid grey' }}>
                                    <p>Delivery to</p>
                                    <b>{ report_details.ledger_details.ledger }</b>
                                    <p> {report_details.address} </p>

                                </div>
                                <div className="col-md-4" style={{ border : '1px solid grey' }}>
                                    <div className="row flex-nowrap">
                                        <p className="col-md-4" align="right"> Account Name </p>
                                        <p className="col-md-1">: </p>
                                        <p className="col-md-6" align="left" > {report_details.company_details.company} </p>
                                    </div>
                                    <div className="row flex-nowrap">
                                        <p className="col-md-4" align="right">  Bank Name </p>
                                        <p className="col-md-1"> : </p>
                                        <p className="col-md-6" align="left" > {report_details.company_details.bankname} </p>
                                    </div>
                                    <div className="row flex-nowrap">
                                        <p className="col-md-4" align="right">  A/c No </p> 
                                        <p className="col-md-1"> : </p> 
                                        <p className="col-md-6" align="left" > {report_details.company_details.bankacno} </p>
                                    </div>
                                    <div className="row flex-nowrap">
                                        <p className="col-md-4" align="right">  Branch </p> 
                                        <p className="col-md-1"> : </p> 
                                        <p className="col-md-6" align="left" > {report_details.company_details.bankbranch} </p>
                                    </div>
                                    <div className="row flex-nowrap">
                                        <p className="col-md-4" align="right">  IFSC Code </p>
                                        <p className="col-md-1"> : </p>
                                        <p className="col-md-6" align="left" > {report_details.company_details.ifsc} </p>
                                    </div>
                                </div>
                            </div>
                        <div className="row flex-nowrap">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                    {/* <div style={{ display : 'block', minHeight : '800px', border : '1px solid grey' }}> */}
                                <table  width="100%"  >
                                    <thead>
                                        <tr >
                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> #Style </b></th>
                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Color </b></th>
                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> #HSN </b></th>
                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> GST </b></th>

                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                             <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                           <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                             <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                             <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                             <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                             <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>

                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Qty </b></th>
                                            
                                            <th row flex-nowrapSpan={2} style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray'}}> <b> Unit </b></th>
                                           
                                        </tr>
                                    </thead>

                                        <tbody >
                                            { report_details.inventories.map((item, ind) => 
                                                <tr key={ind}>
                                                    <td  style={{ paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}} >{item.product}</td>

                                                    <td  style={{ paddingTop: item.product === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}} >{item.color}</td>

                                                    <td  style={{ paddingTop: item.hsnasc === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}} >{item.hsnsac}</td>
                                                    
                                                    <td style={{ paddingTop: item.gst === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}} >{item.gst}</td>


                                                    { item.size_data.map((size, index) => 
                                                        <td key={index} style={{borderRight:'1px solid grey', borderLeft:'1px solid grey', paddingTop: item['size' + Number(Number(index) + 1)] === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}} >
                                                            <b style={{ textAlign :'center' }} >{size !== "''" ? size : Number(item['size' + Number(Number(index) + 1) + "_qty"]) > 0 ? 'Size ' + Number(Number(index) + 1) : ""}</b>  <br/>
                                                            <p style={{ textAlign : 'left' }}> { Number(item['size' + Number(Number(index) + 1) + "_qty"]) !== 0 ? item['size' + Number(Number(index) + 1) + "_qty"] : "" } </p> <br/>
                                                            <p style={{ textAlign : 'right' }}> { Number(item['size' + Number(Number(index) + 1) + "_rate"]) !== 0 ? item['size' + Number(Number(index) + 1) + "_rate"] : ''  } </p> <br/>
                                                        </td>
                                                    )}


                                                    <td style={{ paddingTop: item.qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}} >{item.qty}</td>

                                                   
                                                    <td style={{ paddingTop: item.unit === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px',borderRight : '1px solid grey'}} >{item.unit}</td>

                                                   
                                                </tr>
                                            ) }
                                        </tbody>
                                        <tfoot style={{ marginBottom : '0' }}>
                                            <tr style={{border:'1px solid grey'}}>
                                                <td colSpan={3} style={{borderLeft:'1px solid grey'}}>
                                                    <b> Net Total</b>
                                                </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size1_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size2_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size3_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size4_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size5_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size6_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size7_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size8_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size9_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.size9_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey'}}> {report_details.inventory_qty_total} </td>
                                                <td style={{borderLeft:'1px solid grey', borderRight:'1px solid grey'}}></td>
                                                {/* <td style={{borderRight:'1px solid grey'}}></td> */}
                                               
                                            </tr>
                                            {/* <tr>
                                                <td colSpan={12} style={{ textAlign : 'right' }}> <h6> CGST</h6></td>
                                                <td ></td>
                                                <td ></td>
                                                <td >2.5%</td>
                                                <td style={{ textAlign : 'right' }}> { Number(cgst).toFixed(2) } </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={12} style={{ textAlign : 'right' }}> <h6> SGST</h6></td>
                                                <td ></td>
                                                <td ></td>
                                                <td >2.5%</td>
                                                <td style={{ textAlign : 'right' }}> { Number(sgst).toFixed(2) } </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={12} style={{ textAlign : 'right' }}> <h6> Round Off </h6></td>
                                                <td ></td>
                                                <td ></td>
                                                <td ></td> */}
                                                {/* <td >2.5%</td> */}
                                                {/* <td style={{ textAlign : 'right' }}> { Number(roundOff).toFixed(2) } </td>
                                            </tr> */}
                                            {/* <tr>
                                                <td colSpan={12} style={{ textAlign : 'right' }}> <h6> Grand Total </h6></td>
                                                <td ></td>
                                                <td ></td>
                                                <td ></td> */}
                                                {/* <td >2.5%</td> */}
                                                {/* <td style={{ textAlign : 'right' }}> { Number(finalValue).toFixed(2) } </td>
                                            </tr> */}
                                            {/* <tr>
                                                <td colSpan={16}> Amount in words :  { humanize(finalValue)} </td>
                                            </tr> */}
                                        </tfoot>
                                </table>
                                {/* </div> */}
                                {/* <table border={1} width="100%">
                                    
                                </table> */}
                            </div>
                        </div>
                        <div className="row flex-nowrap">
                            <div className="col-md-6" style={{ border : '1px solid black', padding : 0, paddingLeft : 5 }}>
                                <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                <ul>
                                    <li>
                                    (10% PA Interest will be charged for delayed payment.)
                                    </li>
                                    <li>
                                    ((2% Discount for Paying within 2 Days.)
                                    </li>
                                    <li>
                                    (Credits will only be authorized under the desecration of the Management.)
                                    </li>
                                </ul>
                                {/* <p style={{ whiteSpace : 'pre-line' }}>  Any discrepancy found in this invoice should be notified imediately Subject to "Tirupur Jurisdiction only.</p> */}
                            </div>
                            <div className="col-md-3" style={{ border : '1px solid black', padding : 0, paddingLeft : 5}}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
                                    Receiver's Seal Signature
                                </div>
                            </div>
                            <div className="col-md-3" style={{ border : '1px solid black', padding : 0, paddingLeft : 5 }}>
                                <div  style={{ position : 'absolute', bottom : 0, left : 40 }}>
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
