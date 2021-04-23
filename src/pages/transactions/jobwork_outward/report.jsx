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
        getRequest('garments/getJobworkOutwardReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")

            {

                if(data.data.color_details.length < 7)
                {
                    var item = {
                        color : '',
                        size1_total : 0,
                        size2_total: 0,
                        size3_total : 0,
                        size4_total : 0,
                        size5_total : 0,
                        size6_total : 0,
                        size7_total : 0,
                        size8_total : 0,
                        size9_total : 0,
                        // ["size" + Number(Number(index) + 1)] : 0,
                        inventory_qty_total : '',
                    }
                    for(var i=data.data.color_details.length; i < 7; i++ )
                    {
                        data.data.color_details.push(item);
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
                <div className="row print-area" id="printableArea">
                    <div className="col-md-12">
                        <div >
                        <div className="row" >
                            <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>
                                <h6 style={{fontWeight:"bold"}}>   { report_details.company_details.company } </h6>
                                <p style={{ whiteSpace : 'pre-wrap' }}> Address :  { report_details.company_details.address } </p>
                                <p> Phone :  { report_details.company_details.phone } </p>
                                <p> Mail :  { report_details.company_details.email } </p>
                                <p> GSTIN :  <b style={{fontWeight:"bold"}}> { report_details.company_details.gstno } </b> </p>
                            </div>
                            <div className="col-md-6" style={{ padding : 0,border : '1px solid gray' }}>

                                <table width={"100%"} style={{border:"lightgray", margin : 0, padding : 0}}>
                                        <tr> 
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid gray' }}> <h5> JOBWORK DELIVERY NOTE </h5> </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> DC No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.dcno }</td>
                                            <th> Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Process </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.process }</td>
                                            <th> HSN Code </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.hsnsac} </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Order No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.order_no }</td>
                                            <th> Vehicle No </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.vehicle_no} </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Product </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.product }</td>
                                            <th>  </th>
                                            <td>  </td>
                                        </tr>
                                    </table>
                                </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>
                                <b>Delivery to</b>
                                <div style={{ marginLeft : 15 }}>
                                    <p><b>{ report_details.ledger_details.ledger } , </b></p> 
                                    <p>Address : { report_details.ledger_details.address }</p>
                                    <p> Contact :{ report_details.ledger_details.mobile} </p>
                                    <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p>
                                </div>
                            </div>
                            <div className="col-md-6" style={{ border : '1px solid gray', padding : 0}}>
                                <b style={{fontWeight:"bold", marginLeft : 5}}>ACCESSORIES</b>
                                <table border={1} width="100%" style={{border:"lightgray"}}>
                                    <thead>
                                        <tr style={{ backgroundColor : 'lightgray' }}>
                                            <th> <b> Accessories</b></th>
                                            <th> <b> Qty</b></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { report_details.accessories.map(item => 
                                            <tr>
                                                <td>  { item.product }</td>
                                                <td>  { item.qty }
                                                    { " " + item.unit } </td>    
                                            </tr>
                                        )}
                                    </tbody>
                                    
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Color</th>

                                            { report_details.color_size_details.map((size,index) => 
                                            size !== "" &&
                                                    <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>{ size }</th>
                                                ) }

                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        { report_details.color_details.map(item => 
                                            <tr>

                                                <td style={{paddingTop: item.color === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.color }</td>

                                                { report_details.color_size_details.map((size,index) => 
                                                    size !== "" && <td style={{paddingTop: item["size" + Number(Number(index) + 1)]  === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.color !== "" && item["size" + Number(Number(index) + 1)] !==""  && Number(item["size" + Number(Number(index) + 1)]) }</td>
                                                ) }

                                                <td style={{paddingTop: item.qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px', borderRight:'1px solid gray'}}>{ item.color !== "" && item.qty !=="" && Number(item.qty).toFixed(2)  }</td>
                                            </tr>
                                        )}
                                        <tr>


                                            <td style={{border : '1px solid gray', paddingLeft : '5px', fontWeight:"bold"}}> Grand Total</td>


                                            { report_details.color_size_details.map((size,index) => 
                                            size !== "" &&
                                                    <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{ this.state.report_details["size" + Number(Number(index) + 1) + "_total"] }</td>
                                                ) }


                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{report_details.inventory_qty_total !=="" && Number(report_details.inventory_qty_total).toFixed(2)}</td>

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
