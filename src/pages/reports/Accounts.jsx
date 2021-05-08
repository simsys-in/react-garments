import React, {  PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router';
import { seo } from '../../helpers/default';
import { getRequest } from '../../helpers/apihelper';
import _ from 'lodash'
import { getStandardDate, getDifferentBetweenTwoDate} from '../../helpers/timer';

import {Button} from 'antd';
import moment from 'moment';

import Selectbox from '../../components/Inputs/Selectbox';
import Datebox from '../../components/Inputs/Datebox';
import Textbox from '../../components/Inputs/Textbox';

// import Numberbox from '../../Inputs/Numberbox';
const Features = [
    {
        name : "Include Narration",
        value : 'narration'
    },
   

]
const Report = [
    {
        name : "Ledger Statement",
        value : 'statement'
    },
    {
        name : "Day Book",
        value : 'daybook'
    },
    {
        name : "Ledger Outstanding",
        value : 'ledger_standing'
    },
    {
        name : "GST Report",
        value : 'gst_report'
    },
    {
        name : "GST Report2",
        value : 'gst_report2'
    },
    {
        name : "Outstanding Aging",
        value : 'aging'
    },
    {
        name : "Outstanding Overdue Bills",
        value : 'overdue_bills'
    },
    {
        name : "Daybook Raw",
        value : 'daybook_raw'
    },
    {
        name : "Order Status Report",
        value : 'order_Status'
    },
    {
        name : "InProcess Report",
        value : 'inprocess_report'
    },
    {
        name : "P&L Summary" , 
        value : 'p&l_summary'
    },
    {
        name : "Balance Sheet" , 
        value : 'balance_sheet'
    },
    {
        name : "Trail Balance" , 
        value : 'trail_balance'
    },
    {
        name : "Sales Register" , 
        value : 'sales_register'
    },
    {
        name : "Silent Ledger" , 
        value : 'silent_ledger'
    },
    {
        name : "VAT Return" , 
        value : 'vat_return'
    },
   

]

const Subaction = [
    {
        name : "Print",
        value : 'print'
    },
    {
        name : "Mail",
        value : 'mail'
    },
    {
        name : "Save as PDF",
        value : 'pdf'
    },
    {
        name : "Export to Excel",
        value : 'excel'
    },
    {
        name : "SMS",
        value : 'sms'
    },
    {
        name : "Telegram",
        value : 'telegram'
    },
]


class Accounts extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            formData : {
             
                from_date : moment(),
            },
            accounts :{
                company_details : {
                    name : "Simsys Softwares",
                    address : "No 1, Chellam Nagar, Mangalam Road, Tirupur",
                },
                ledger : {
                    from_date : "05-10-1998",
                    to_date :  "15-10-2021", 
                    ledger : "SELVAM INFO MEDIA",


                },
                inventories : [
                    {
                        vou_date : '08-4-1998',
                        vou_no :'6',
                        account_ledger : 'Purchase',
                        vou_type : 'Purchase Invoice',
                        debit : '1200',
                        credit : '10,322',
                    },
                    {
                        vou_date : '09-4-1998',
                        vou_no :'7',
                        account_ledger : 'VIJAYA BANK',
                        vou_type : 'Payment',
                        debit : '1300',
                        credit : '11,322',
                    },
                    {
                        vou_date : '10-4-1998',
                        vou_no :'8',
                        account_ledger : 'GOLD',
                        vou_type : 'Sales Invoice',
                        debit : '1400',
                        credit : '12,322',
                    },

                ]
            },
            show_report : false,
            ledger_name : [],
            ledger_category : [],
            ledger_group :[],
            // accounts : {
            //     processdetails : []
            // },
        };

    }

        getLedgerNameSB = () => {
        getRequest('garments/getAllLedgerSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    ledger_name : data.data
                })
            }
        })
    }
    

    getLedgerCategorySB = () => {
        getRequest('garments/getLedgerCategorySB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    ledger_category : data.data
                })
            }
        })
    }

    getLedgerGroupSB = () => {
        
        getRequest('garments/getLedgerGroupSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    ledger_group : data.data
                })
            }
        })
    }


  

    componentDidMount = () => {
        this.getLedgerNameSB();
        this.getLedgerCategorySB();
        this.getLedgerGroupSB();
        // this.setTotalDebits();

    
          

        
      seo({
          title: 'Accounts',
          metaDescription: 'Accounts'
        });
    // })
    }

    

    
    
    getReport = () => {
        // getRequest('garments/getAccountsReport?ledger_id=' + this.state.formData.order_id ).then(data => {
        //     if(data.status === "info")
        //     {

        
                this.setState({
                    ...this.state,
                    // accounts : data.data,
                    show_report : true,
                    // inventory_debit_total : total_debit


                })
        //     }
        // })
        
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
        const { accounts } = this.state;

        return(
            <Fragment>
                <div className="row">
                    <Datebox label="From Date" value={this.state.formData.vou_date} modelName="from_date" className="col-md-4"></Datebox>
                    <Datebox label="To Date" value={this.state.formData.vou_date} modelName="to_date" className="col-md-4"></Datebox>
                    <Textbox label=" Vou Ref" required="false" modelName=" vouref" className="col-md-4"></Textbox>
                    {/* <Selectbox modelName="process_id" label="Process" className="col-md-4" onChange={this.onProcessChange} options={this.state.process} value={this.state.formData.process_id}  ></Selectbox> */}

                </div>
                <div className="row">
                    <Selectbox  modelName="ledger_id" label="Ledger"  className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id}  ></Selectbox>
                    <Textbox label=" Voucher" required="false" modelName="voucher" className="col-md-4"></Textbox>
                    <Textbox label=" Narration" required="false" modelName="narration" className="col-md-4"></Textbox>


                </div>
                <div className="row">
                    <Selectbox  modelName="ledger_group_id" label="Ledger Group"  className="col-md-4" options={this.state.ledger_group} value={this.state.formData.ledger_id}  ></Selectbox>

                    <Selectbox  modelName="ledger_category_id" label="Ledger Group"  className="col-md-4" options={this.state.ledger_category} value={this.state.formData.ledger_id}  ></Selectbox>

                    <Textbox label=" Amount" required="false" modelName="amount" className="col-md-4"></Textbox>


                </div>
                <div className="row">

                        <Selectbox modelName="report"  required="false"  label="Report" options={Report} value={this.state.formData.report}  ></Selectbox>

                        <Selectbox modelName="sub_action"  required="false"  label="Sub Action" options={Subaction} value={this.state.formData.sub_action}  ></Selectbox>

                        <Selectbox modelName="features"  required="false"  label="Features" options={Features} value={this.state.formData.features}  ></Selectbox>

        
                    
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

                                <div className="col-md-4" style={{ padding : 0,border:'1px solid grey', borderBottom:'0', borderRight:'0' }}>

                                <h6 style={{fontWeight:"bold", paddingLeft:'5px'}} >   { accounts.company_details.name } </h6>
                                <div style={{ marginLeft : 15 }}>
                                <p style={{ whiteSpace : 'pre-wrap' }}> Address :  { accounts.company_details.address } </p>
                               
                                </div>  

                                </div>
                                
                                    <div className="col-md-8" style={{ padding : 0,border:'1px solid grey', borderLeft:'0',borderBottom:'0',borderTop:'0' }}>

                                    <table width={"100%"} style={{border:"1px solid gray", margin : 0, padding : 0,borderRight:'0', borderBottom:'0'}} >
                                                <tr> 
                                                    <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center', border : '1px solid grey' }}> <h5>Ledger Statement</h5> </td>
                                                </tr>
                                                <tr>
                                                    <th style={{paddingLeft : '5px'}}>   </th>
                                                    <td style={{fontWeight:"bold"}}> : accounts</td>
                                                  
                                                    <th style={{paddingLeft : '5px'}}> From Date  </th>
                                                    <td style={{fontWeight:"bold"}}> : {accounts.ledger.from_date} </td>
                                                </tr>
                                               
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> To Date </th>
                                                    <td style={{fontWeight:"bold"}}> : { accounts.ledger.to_date} </td>
                                                    <th style={{paddingLeft : '5px'}}>Ledger</th>
                                                    <td style={{fontWeight:"bold"}}>: { accounts.ledger.ledger} </td>

                                                </tr>
                                              
                                                <tr>
                                                
                                                    <th style={{paddingLeft : '5px'}}> </th>
                                                    <td style={{fontWeight:"bold"}}> : print </td>

                                                </tr>
                                                </table>
                                        </div>
                                    </div>
                                
                                <div className="row">
                                    <div className="col-md-12" style={{ padding : 0 , borderRight:'1px solid grey'}}>
                                        <table  width="100%"  >
                                            <thead>
                                                <tr  style={{ backgroundColor : 'lightgray' }}>
                                                
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} > Vou Date</th>
                                         
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Vou No</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Account Ledger</th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Vou Type </th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Debit </th>
                                                    <th style={{fontWeight:"bold", paddingLeft : '5px' , border: '1px solid gray', textAlign:"center"}} >Credit </th>
                                                
                                                
                                                </tr>
                                            </thead>
                                            <tbody style={{ borderBottom : '1px solid grey' }} >
                                            { accounts.inventories.map((item, index) => 
                                                    <tr key={index}>

                                                        <td style={{ paddingTop: item.vou_date === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'center'}}>{ item.vou_date }</td>

                                                        <td style={{ paddingTop: item.vou_no === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'center'}}>{ item.vou_no }</td>

                                                        <td style={{ paddingTop: item.account_ledger === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey'}}>{ item.account_ledger }</td>

                                                         <td style={{ paddingTop: item.vou_type === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'center', paddingRight:'5px'}}>{ item.vou_type }</td>

                                                        <td style={{ paddingTop: item.debit === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ Number(item.debit).toFixed(2) }</td>

                                                        <td style={{ paddingTop: item.credit === "" ? '27px' : 'auto', paddingLeft : '5px' , borderLeft  : '1px solid grey', textAlign : 'right', paddingRight:'5px'}}>{ item.credit }</td>

                                                        
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td colspan={4} style={{textAlign:'right', paddingRight:'5px', border:'1px solid grey'}}>
                                                        Current Total
                                                    </td>
                                                    <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{this.state.inventories_debit_total !== "" && Number(this.state.inventories_debit_total).toFixed(2) }</td>

                                                    <td style={{fontWeight:"bold", textAlign : 'right', border:'1px solid gray', paddingRight:'5px'}}>{this.state.inventories_qty_kg_total !== "" && Number(this.state.inventories_qty_kg_total).toFixed(2) }</td>


                                                </tr>

                                                
                                                </tbody>
                                        </table>
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

export default withRouter(Accounts);