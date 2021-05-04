import React, {  PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router';
import { seo } from '../../helpers/default';
import { getRequest } from '../../helpers/apihelper';
import _ from 'lodash'
import { getStandardDate, getDifferentBetweenTwoDate} from '../../helpers/timer';

import {Button} from 'antd';
import Selectbox from '../../components/Inputs/Selectbox';
// import Selectbox from '../../../Inputs/Selectbox';
// import Numberbox from '../../../Inputs/Numberbox';

class OrderStatus extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            formData : {
                order_id : '',
            },
            show_report : false,
            order_no : [],

            orderstatus_details : {
                processDetails : []
            },
        };

    }

    getOrderSB = () => {
        getRequest('garments/getOrderSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    order_no : data.data
                })
            }
        })
    }

    onOrderIDChange = (order_id) => {
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_id : order_id
            }
        })
    }

    componentDidMount = () => {
        this.getOrderSB();
       
        
      seo({
          title: 'OrderStatus',
          metaDescription: 'OrderStatus'
        });
    // })
    }

    
   

    
    getReport = () => {
        getRequest('garments/getOrderProgramReport?order_id=' + this.state.formData.order_id  ).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    orderstatus_details : data.data,
                    show_report : true,

                })
            }
        })
        
    }
    
    render(){
        const { orderstatus_details } = this.state;

        return(
            <Fragment>
                <div className="row">
                    <Selectbox modelName="order_id" label="Order No" onChange={this.onOrderIDChange} className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                </div>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button onClick={this.getReport}>Get Report</Button>
                    </div>
                </div>
                <br></br>
                <br></br>
                
                
                { this.state.show_report &&
                <div className="row print-area" id="printableArea">
                    <div className="col-md-12">
                        <div >
                        <div className="row" >
                            
                            <div className="col-md-12" style={{ padding : 0,border : '1px solid gray' }}>

                                <table width={"100%"} style={{border:"lightgray", margin : 0, padding : 0}}>
                                        <tr> 
                                            <td colSpan={6} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid gray' }}> <h5> ORDER STATUS </h5> </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Order No </th>
                                            <td style={{fontWeight:"bold"}}> { orderstatus_details.order_no }</td>
                                            <th> Order Date </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(orderstatus_details.orderDate)} </td>
                                        </tr>
                                        <tr>
                                            <th> Due Date </th>
                                            <td style={{fontWeight:"bold"}}> { getStandardDate(orderstatus_details.due_date)} </td>
                                            <th> Remaining </th>
                                            <td style={{fontWeight:"bold"}}> { getDifferentBetweenTwoDate( orderstatus_details.due_date,  new Date(), 'days')} </td>
                                        </tr>
                                        <tr>
                                            <th  style={{paddingLeft : '5px'}}> Style </th>
                                            <td style={{fontWeight:"bold"}}> { orderstatus_details.product }</td>
                                            <th> Size </th>
                                            <td style={{fontWeight:"bold"}}> {orderstatus_details.size} </td>
                                        </tr>
                                       
                                    </table>
                                </div>
                        </div>
                       
                        <div className="row">
                        <div className="col-md-12" style={{ padding : 0 , borderRight:'1px solid grey'}}>
                                    <table  width="100%"  >
                                        <thead>
                                            <tr  style={{ backgroundColor : 'lightgray' }}>
                                            
                                                <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} > PROCESS</th>
                                                {/* <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >TO PROCESS</th> */}
                                                <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >LEDGER</th>
                                                {/* <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} > DELIVERY QTY</th> */}
                                                <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >RECEIVED QTY</th>
                                                {/* <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >SHORTAGE </th> */}
                                            
                                            
                                            </tr>
                                        </thead>
                                        <tbody >
                                        { orderstatus_details.cuttingprogram.map((item, index) => 
                                                <tr key={index}>
                                                    <td style={{ paddingTop: item.process === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.process }</td>

                                                    {/* <td style={{ paddingTop: item.to_process === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.to_process }</td> */}

                                                    <td style={{ paddingTop: item.employee === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.employee }</td>

                                                    <td style={{ paddingTop: item.inventory_qty_total === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.inventory_qty_total }</td>

                                                    {/* <td style={{ paddingTop: item.inventory_qty_total === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.inward_qty_total }</td>

                                                    <td style={{ paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{   item.outward_qty_total - item.inward_qty_total }</td> */}


                                                    {/* <td style={{ paddingTop: item.qty_kg === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px' }}>{ item.qty_kg !== "" && Number(item.qty_kg).toFixed(2) }</td> */}
                                                    
                                                </tr>
                                            )}

                                            {/* <tr> */}
                                                {/* <td style={{fontWeight:"bold", border:'1px solid gray', textAlign:'right', paddingRight:'5px'}} colSpan={2}>GRAND TOTAL</td> */}
                                            
                                                {/* <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{this.state.inventory_qty_kg_total !== "" && Number(this.state.inventory_qty_kg_total).toFixed(2) }</td> */}
                                                {/* <td></td>
                                                <td></td>
                                                <td></td> */}
                                            
                                                
                                            {/* </tr> */}
                                            </tbody>
                                    </table>
                                </div>
                            <div className="col-md-12" style={{ padding : 0 }}>
                                <table  width="100%" >
                                    <thead>
                                        <tr  style={{ backgroundColor : 'lightgray' }}>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>From Process</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>To Process</th>

                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>ledger</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Delivery Qty</th>
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Recevied Qty</th>   
                                            <th style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:"center"}}>Shortage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        { orderstatus_details.processDetails.map(item => 
                                            <tr>

                                                <td style={{paddingTop: item.fromprocess === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.fromprocess }</td>
                                                <td style={{paddingTop: item.toprocess === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.toprocess }</td>
                                                <td style={{paddingTop: item.ledger === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.ledger }</td>
                                                
                                                <td style={{paddingTop: item.delivery_qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.delivery_qty }</td>
                                               
                                                <td style={{paddingTop: item.received_qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.received_qty }</td>
                                               
                                                <td style={{paddingTop: item.shortage === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px', borderRight:'1px solid gray'}}>{  item.delivery_qty - item.received_qty }</td>
                                            </tr>
                                        )}
                                        <tr>
                                           
                                            <td colSpan={5} style={{border : '1px solid gray', paddingLeft : '5px',textAlign:'right', paddingRight:'5px'}}> Grand Total</td>
                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{this.state.shortage !=="" && Number(this.state.shortage).toFixed(3)}</td>

                                            {/* <td style={{border : '1px solid gray', paddingLeft : '5px', fontWeight:"bold"}}> Grand Total</td> */}


                                            {/* { orderstatus_details.color_size_details.map((size,index) => 
                                            size !== "" &&
                                                    <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{ this.state.orderstatus_details["size" + Number(Number(index) + 1) + "_total"] }</td>
                                                ) } */}

                                            {/* <td> </td>
                                            <td> </td>
                                            <td></td>
                                            <td style={{fontWeight:"bold", border : '1px solid gray', paddingLeft : '5px', textAlign:'right', paddingRight:'5px'}}>{orderstatus_details.shortage !=="" && Number(orderstatus_details.shortage).toFixed(2)}</td> */}

                                        </tr>
                                    </tbody>
                                </table>
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

export default withRouter(OrderStatus);