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
            
            total_roll : 0,
            total_weight : 0
        }
    }

    componentDidMount = () => {
        getRequest('garments/getFabricOutwardReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {

                if(data.data.color_details.length < 10)
                {
                    var item = {
                       color :'',
                        gsm : '',
                        fabric : '',
                        dia : '',
                        roll : '',
                        weight : ''
                    }
                    for(var i=data.data.color_details.length; i < 10; i++ )
                    {
                        data.data.color_details.push(item);
                        if(i === 9)
                        {
                            this.setState({
                                ...this.state,
                                report_details : data.data,
                                show_details : true,
                                inventory_roll_total : total_roll,
                                inventory_weight_total : total_weight
                            })

                        }
                    }
                }
                else{
                    this.setState({
                        ...this.state,
                        report_details : data.data,
                        show_details : true,
                        inventory_roll_total : total_roll,
                        inventory_weight_total : total_weight
                    })
                }

                
                var total_roll = 0;
                var total_weight = 0;

                data.data.color_details.map(item => {
                    total_roll += Number(item.roll);
                    total_weight += Number(item.weight);
        
                                   })

                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true,
                    inventory_roll_total : total_roll,
                    inventory_weight_total : total_weight
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
                        <div className="row flex-nowrap" >
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
                                            <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid gray' }}> <h5> FABRIC DELIVERY NOTE </h5> </td>
                                        </tr>
                                        <tr>
                                            <th> DC No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details. vouno}</td>
                                            <th> Dated </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                        </tr>
                                        <tr>
                                            <th> Process </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.process }</td>
                                            <th> HSN Code </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.hsnsac} </td>
                                        </tr>
                                        <tr>
                                            <th> Order No </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.order_no }</td>
                                            <th> Vehicle No </th>
                                            <td style={{fontWeight:"bold"}}> {report_details.vehicle_no} </td>
                                        </tr>
                                        <tr>
                                            <th> Product </th>
                                            <td style={{fontWeight:"bold"}}> { report_details.product }</td>
                                            <th>  </th>
                                            <td>  </td>
                                        </tr>
                                    </table>
                                </div>
                        </div>
                        <div className="row flex-nowrap">
                            <div className="col-md-12" style={{ border : '1px solid gray', padding : 0, paddingLeft : 5 }}>
                                <b>Delivery to</b>
                                <div style={{ marginLeft : 15 }}>
                                    <p><b>{ report_details.ledger_details.ledger } , </b></p> 
                                    <p>Address : { report_details.ledger_details.address }</p>
                                    <p> Contact :{ report_details.ledger_details.mobile} </p>
                                    <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p>
                                </div>
                            </div>
                            {/* <div className="col-md-6" style={{ border : '1px solid gray', padding : 0}}>
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
                            </div> */}
                        </div>
                        <div className="row flex-nowrap">
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                            <th style={{fontWeight:"bold",textAlign:"center", border : '1px solid gray', paddingLeft : '5px'}}>Fabric</th>
                                            <th style={{fontWeight:"bold",textAlign:"center", border : '1px solid gray', paddingLeft : '5px'}}>Color</th>
                                            <th style={{fontWeight:"bold",textAlign:"center", border : '1px solid gray', paddingLeft : '5px'}}>GSM</th>
                                            <th style={{fontWeight:"bold",textAlign:"center", border : '1px solid gray', paddingLeft : '5px'}}>Dia</th>
                                            <th style={{fontWeight:"bold",textAlign:"center", border : '1px solid gray', paddingLeft : '5px'}}>Roll</th>
                                            <th style={{fontWeight:"bold",textAlign:"center", border : '1px solid gray', paddingLeft : '5px'}}>Weight</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        { report_details.color_details.map((item,index) => 
                                            <tr key={index}>

                                                <td style={{ paddingTop: item.fabric === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.fabric }</td>

                                                <td style={{ paddingTop: item.color === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', }}>{ item.color }</td>

                                                <td style={{ paddingTop: item.gsm === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',  textAlign : 'right', paddingRight:'5px'}}>{ item.gsm }</td>

                                                <td style={{ paddingTop: item.dia === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',  textAlign : 'right', paddingRight:'5px'}}>{ item.dia }</td>

                                                <td style={{ paddingTop: item.roll === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',  textAlign : 'right',paddingRight:'5px'}}>{ item.roll }</td>
                                               
                                                <td style={{ paddingTop: item.weight === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey',borderRight  : '1px solid grey',  textAlign : 'right', paddingRight:'5px'}}>{ item.weight !=="" && Number(item.weight).toFixed(3)  }</td>
                                            </tr>
                                        )}
                                        <tr>

                                            <td colSpan={4} style={{border : '1px solid gray', paddingLeft : '5px',textAlign:'right', paddingRight:'5px'}}> Grand Total</td>
                                            
                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign : 'right', paddingRight:'5px'}}>{this.state.inventory_roll_total }</td>

                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign : 'right', paddingRight:'5px'}}>{this.state.inventory_weight_total !=="" && Number(this.state.inventory_weight_total) !== 0 && Number(this.state.inventory_weight_total).toFixed(3)}</td>

                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row flex-nowrap">
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
