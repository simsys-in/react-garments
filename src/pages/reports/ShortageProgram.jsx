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

class ShortageProgram extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            formData : {
                order_id : '',
                process_id : ''
            },
            show_report : false,
            order_no : [],
            process : [],
            shortage_details : {
                processdetails : []
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

    getProcessSB = () => {
        getRequest('garments/getAllProcessSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    process : data.data
                })
            }
        })
    }

    componentDidMount = () => {
        this.getOrderSB();
        // this.getProcessSB();
        // getRequest('garments/getShortageReport?id=' + this.props.itemId).then(data => {
        //     if(data.status === "info")
        //     {}
        //     else{
        //         this.setState({
        //             ...this.state,
        //             shortage_details : data.data,
        //             show_details : true,

        //         })
        //     }
        // })
            

        
      seo({
          title: 'Shortage Program',
          metaDescription: 'Shortage Program'
        });
    // })
    }

    
    getProcessSBForOrderID = (order_id) => {
        getRequest('garments/getProcessSBForOrderID?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    process : data.data
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
        }, () => {
            this.getProcessSBForOrderID(this.state.formData.order_id);
        })
    }
    
    onProcessChange = (process_id) => {
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                process_id : process_id
            }
        })
    }
    
    getReport = () => {
        getRequest('garments/getShortageReport?order_id=' + this.state.formData.order_id + "&process_id=" + this.state.formData.process_id ).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    shortage_details : data.data,
                    show_report : true,

                })
            }
        })
        
    }

     
  printDiv = () => {
    var printContents = document.getElementById('printableArea').innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
     window.location.reload();
  }
    
    render(){
        const { shortage_details } = this.state;

        return(
            <Fragment>
                <div className="row">
                    <Selectbox autoFocus modelName="order_id" label="Order No" onChange={this.onOrderIDChange} className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                    <Selectbox modelName="process_id" label="Process" className="col-md-6" onChange={this.onProcessChange} options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                </div>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button onClick={this.getReport}>Get Report</Button>
                    </div>
                </div>
                <br></br>
                <br></br>
                
                
                { this.state.show_report &&
                    <Fragment>
                        <div className="row">
                            <div className="col-md-12">
                                <Button type="primary" onClick={this.printDiv} > Print </Button>
                            </div>
                        </div>
                        <div className="row print-area" id="printableArea">
                            <div className="col-md-12">
                                <div className="row flex-nowrap" >
                                
                                    <div className="col-md-12" style={{ padding : 0,border:'1px solid grey', borderLeft:'0',borderBottom:'0',borderTop:'0' }}>

                                        <table width={"100%"} style={{border:"1px solid gray", margin : 0, padding : 0,borderRight:'0'}} >
                                                <tr> 
                                                    <td colSpan={6} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid grey' }}> <h5>SHORTAGE DETAILS</h5> </td>
                                                </tr>
                                                <tr>
                                                    <th style={{paddingLeft : '5px'}}> Order No </th>
                                                    <td style={{fontWeight:"bold"}}> { shortage_details.order_no } </td>
                                                    {/* <th> Dated </th>
                                                    <td style={{fontWeight:"bold"}}> { getStandardDate(shortage_details.vou_date)} </td> */}
                                                </tr>
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> Order Date </th>
                                                    <td style={{fontWeight:"bold"}}> { getStandardDate(shortage_details.vou_date)} </td>

                                                </tr>
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> Due Date </th>
                                                    <td style={{fontWeight:"bold"}}> { getStandardDate(shortage_details.due_date)} </td>

                                                </tr>
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> Remaining Days</th>
                                                    <td style={{fontWeight:"bold"}}> { getDifferentBetweenTwoDate( shortage_details.due_date,  new Date(), 'days')} Days </td>

                                                </tr>
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> Style </th>
                                                    <td style={{fontWeight:"bold"}}> { shortage_details.product} </td>

                                                </tr>
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> Size </th>
                                                    <td style={{fontWeight:"bold"}}> { shortage_details.size} </td>

                                                </tr>
                                            
                                                
                                            
                                                
                                            </table>
                                        </div>
                                                {/* <div className="col-md-4" style={{ padding : 0,border:'1px solid grey' }}>
                                                    </div> */}
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-12" style={{ padding : 0 , borderRight:'1px solid grey'}}>
                                        { this.state.formData.process_id === 8 &&
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
                                            <tbody style={{ borderBottom : '1px solid grey' }} >
                                            { shortage_details.cuttingprogram.map((item, index) => 
                                                    <tr key={index}>
                                                        <td style={{ paddingTop: item.process === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.process }</td>

                                                        {/* <td style={{ paddingTop: item.to_process === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.to_process }</td> */}

                                                        <td style={{ paddingTop: item.employee === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.employee }</td>

                                                        <td style={{ paddingTop: item.qty === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.qty + " " + "Pcs"}</td>

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
                                        </table>}
                                    </div>
                                    <div className="col-md-12" style={{ padding : 0 , borderRight:'1px solid grey'}}>
                                        { shortage_details.processdetails.length > 0 &&
                                        <table  width="100%"  border={1}>
                                            <thead>
                                                <tr  style={{ backgroundColor : 'lightgray' }}>
                                                
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >FROM PROCESS</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >TO PROCESS</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >LEDGER</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} > DELIVERY QTY</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >RECEIVED QTY</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >SHORTAGE </th>
                                                
                                                
                                                </tr>
                                            </thead>
                                            <tbody  style={{borderBottom:'1px solid grey'}}>
                                            { shortage_details.processdetails.map((item, index) => 
                                                    <tr key={index}>
                                                        <td style={{ paddingTop: item.fromprocess === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', }}>{ item.fromprocess }</td>

                                                        <td style={{ paddingTop: item.toprocess === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.toprocess }</td>

                                                        <td style={{ paddingTop: item.ledger === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.ledger }</td>

                                                        <td style={{ paddingTop: item.inventory_qty_total === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.outward_qty_total + " " + shortage_details.unit } </td>

                                                        <td style={{ paddingTop: item.inventory_qty_total === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.inward_qty_total + " " + shortage_details.unit}</td>

                                                        <td style={{ paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{   item.outward_qty_total - item.inward_qty_total + " " + shortage_details.unit }</td>


                                                        {/* <td style={{ paddingTop: item.qty_kg === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px' }}>{ item.qty_kg !== "" && Number(item.qty_kg).toFixed(2) }</td> */}
                                                        
                                                    </tr>
                                                )}

                                                {/* <tr>
                                                    <td style={{fontWeight:"bold", border:'1px solid gray', textAlign:'right', paddingRight:'5px'}} colSpan={2}>GRAND TOTAL</td> */}
                                                
                                                    {/* <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{this.state.inventory_qty_kg_total !== "" && Number(this.state.inventory_qty_kg_total).toFixed(2) }</td> */}
                                                    {/* <td></td>
                                                    <td></td>
                                                    <td></td> */}
                                                
                                                    
                                                {/* </tr> */}
                                                </tbody>
                                        </table>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>

                    </Fragment>
                }
            </Fragment>
        )
    }
}

export default withRouter(ShortageProgram);