import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider, message  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';
import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';
import Datebox from '../../../components/Inputs/Datebox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { issetNotEmpty } from '../../../helpers/formhelpers';


let interval;


class AddJobworkInvoice extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                narration :"",
                vehicle_no :"",
                mobile :"",
                refno :"",
                status : 'active',
                vou_date : moment(),
                jobwork_invoice_inventory : [
                    {  
                        
                        qty : 0,
                        rate : 0,
                        amount : 0
                      
                    }
               
                ],
                
            },
        
            ledger_name : [],
         menu_data : [],
         acLedger_data : [],
            product : [],
            order_no : [],
            size_data : [],
            process : [],
            style_id : [],
            size_id : []
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

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


   
    getProcessSB = (order_id = null) => {
        
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


   
    getProductSB = (order_id = null) => {
        
        getRequest('garments/getAllProductSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product : data.data
                })
            }
        })
    }

   

    getSizeSB = (order_id = null) => {
        
        getRequest('garments/getAllSizeSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    size_data : data.data
                })
            }
        })
    }

    getJobworkInwardColorDetails = (order_id) => {
        if(!this.id){
            getRequest('garments/getJobworkInwardColorDetails?order_id=' +order_id).then(data => {
                if(data.status === "info")
                {
                    var newArr = data.data;
                    this.state.formData.jobwork_invoice_inventory.map((item) => {
                        newArr.map(obj => {
                            if(obj.color_id === item.color_id)
                            {
                                obj.selected = true;
                            }
                        })
                    })
                    // newArr.map(item => {
                    //     item.selected = true;
                    // })

                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            jobwork_invoice_inventory : newArr
                        },
                    },()=>{
                        this.formRef.current.setFieldsValue({
                            jobwork_invoice_inventory : this.state.formData.jobwork_invoice_inventory
                        })
                        this.setTOTAL()
                    })
                }
            })
       }
    }

    

    getAccountsLedger = () => {
        getRequest('garments/getAccountsLedger').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    acLedger_data : data.data
                })
            }
        })
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

    

    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var jobwork_invoice_inventory = values.jobwork_invoice_inventory;
        var total_qty = 0;
        var total_amount = 0;
        jobwork_invoice_inventory.map((item, index) => {
            // console.log(item);
            item.amount = item.qty *item.rate; 
            if(item.selected){
                total_qty += Number(item.qty)
                total_amount += Number(item.amount)

                if(index === jobwork_invoice_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            inventory_qty_total : total_qty,
                            inventory_amount_total : total_amount
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            inventory_qty_total : total_qty,
                            inventory_amount_total : total_amount
                        })
                    })
                }
            }
            else{
                
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_total : total_qty,
                        inventory_amount_total : total_amount,
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_total : total_qty,
                        inventory_amount_total : total_amount,
                    })
                })
            }
        })
    }

    

    validate = () => {
        if(this.formRef.current)
        {
            var values = this.formRef.current.getFieldValue();
            var errors = this.formRef.current.getFieldsError().filter(({ errors }) => errors.length).length;
            var passwordMisMatched = values.password === values.confirm_password
            this.setState({
                ...this.state,
                formData : values,
                buttonDisabled : Boolean(errors),
                passwordMisMatched : passwordMisMatched
            })
        }
    }

    getJobworkInvoice = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/jobworkInvoice?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.getProductAndSizeSBForOrderID(data.data.order_id);
                this.getMobileForLedgerId(data.data.ledger_id)
                this.getJobworkInwardColorDetails(data.data.order_id);

                // this.getOrdersForLedgerAndProcess(data.data.ledger_id, data.data.process_id)
            
                
            })

        }
        else{

            this.getNextJobworkInvoiceVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextJobworkInvoiceVouNo = () => {
        getRequest('garments/getNextJobworkInvoiceVouNo').then(data => {
            // console.log(data.max_vou_no);
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        vouno : data.data.max_vou_no
                    }
                },() => {
                    this.formRef.current.setFieldsValue({
                        vouno : this.state.formData.vouno
                    })
                })
            }
        })
    }


    

    // getProductAndSizeSBForOrderID = (order_id,index) => {
    //     getRequest('garments/getProductAndSizeSBForOrderID?order_id=' + order_id).then(data => {
    //         if(data.status === "info")
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 formData : {
    //                     ...this.state.formData,
    //                     product : data.data.style_id,
    //                     size_data : data.data.size_id

    //                 }
    //             },() => {
    //                 this.formRef.current.setFieldsValue({
    //                     product : this.state.formData.style_id,
    //                     size_data : this.state.formData.size_id
    //                 })
    //             })
    //         }
    //     })
    // }


    getProductAndSizeSBForOrderID = (order_id) => {
        getRequest('garments/getProductAndSizeSBForOrderID?order_id=' + order_id).then(data => {
            console.log(data)
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                
                        product_id :data.data[0].style_id,
                        size_id : data.data[0].size_id
                        
                    }
                }, () => {
                    this.formRef.current.setFieldsValue(this.state.formData);
                })
            }
        })
    }

    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        this.getProcessSB();
        this.getProductSB();
        this.getSizeSB();
        this.getAccountsLedger();
        this.setTOTAL();
        this.getJobworkInvoice();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Job Work Invoice',
            metaDescription: 'Add Job Work Invoice'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Job Work Invoice',
                metaDescription: 'Edit Job Work Invoice'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/jobworkInvoice?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_jobwork_invoice')
                    // console.log(data) 
                }
            })
            .catch(err => {
                // console.log(err);
                this.setState({
                    ...this.state,
                    buttonLoading : false
                })

            })
        })
    };

    

    
    
    


    getMobileForLedgerId = (ledger_id) => {
        getRequest('garments/getMobileForLedgerID?ledger_id=' + ledger_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        mobile : data.data
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        mobile : this.state.formData.mobile
                    })
                })
            }
        })
    }


    addJobworkInvoiceInventory = () => {
        var newJobworkInvoiceInventory = {
           
            qty : 0,
            rate : 0,
            amount : 0
            
        }

        var oldJobworkInvoiceInventoryArray = this.state.formData.jobwork_invoice_inventory;

        oldJobworkInvoiceInventoryArray.push(newJobworkInvoiceInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_invoice_inventory : oldJobworkInvoiceInventoryArray

            }
        })
    }

   
    removeJobworkInvoiceInventory = (index) => {
        var oldJobworkInvoiceInventoryArray = this.state.formData.jobwork_invoice_inventory;

        oldJobworkInvoiceInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_invoice_inventory : oldJobworkInvoiceInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.jobwork_invoice_inventory;
        // console.log(checked);
        inventories.map((item, index) => {
            item.selected = checked;
            if(index === inventories.length - 1)
            {
                // console.log(formData);
                this.setState({
                    ...this.state,
                    formData : formData
                }, () => {
                    this.formRef.current.setFieldsValue(formData);
                    this.setTOTAL()
                })
            }
        })

    }

    getOrdersForLedgerAndProcess = (ledger,process) => {
        getRequest('garments/getOrdersForLedgerAndProcess?ledger=' + ledger + '&process=' + process).then(data => {
            if(data.status === "info")
            // {
            //     data.data.map((item, index) => {
            //         this.state.formData.jobwork_invoice_inventory.map((savedItem, key) => {
                        // if(Number(savedItem.order_id) === Number(item.order_id) && Number(item.product_id) === Number(savedItem.product_id) && Number(item.size_id) === Number(savedItem.size_id))
                        // {
                        //     item = savedItem;
                        //     item.selected = true;
                        // }
                        // console.log(index, data.data.length-1, key, this.state.formData.jobwork_invoice_inventory.length-1)
                        // if(index === data.data.length -1 && key === this.state.formData.jobwork_invoice_inventory.length - 1)
                        {
                            this.setState({
                                ...this.state,
                                formData : {
                                    ...this.state.formData,
                                    jobwork_invoice_inventory : data.data
                                }
                            }, () => {
                                this.formRef.current.setFieldsValue(this.state.formData);
                                this.setTOTAL()
                            })
                        }
            //         })
            //     })

            // }
        })
    }

    onLedgerAndProcessChange = () => {
        const FORMDATA = this.formRef.current.getFieldValue();
        const PROCESS = issetNotEmpty(FORMDATA.process_id) ? FORMDATA.process_id : null;
        const LEDGER = issetNotEmpty(FORMDATA.ledger_id) ? FORMDATA.ledger_id : null;

        if(issetNotEmpty(LEDGER))
        {
            this.getMobileForLedgerId(LEDGER);
        }
        if(issetNotEmpty(LEDGER) && issetNotEmpty(PROCESS))
        {
            this.getOrdersForLedgerAndProcess(LEDGER, PROCESS);
        }

    }

    
    // addJobworkOutwardProduct = () => {
    //     var newJobworkOutwardProduct = {
    //        product_id : '',
    //        qty : '',
    //        unit_id : ''
            
    //     }

    //     var oldJobworkOutwardProductArray = this.state.formData.jobwork_outward_product;

    //     oldJobworkOutwardProductArray.push(newJobworkOutwardProduct);

    //     this.setState({
    //         ...this.state,
    //         formData : {
    //             ...this.state.formData,
    //             jobwork_outward_product : oldJobworkOutwardProductArray

    //         }
    //     })
    // }

   
    // removeJobworkOutwardProduct = (index) => {
    //     var oldJobworkOutwardProductArray = this.state.formData.jobwork_outward_product;

    //     oldJobworkOutwardProductArray.splice(index, 1);
        
    //     this.setState({
    //         ...this.state,
    //         formData : {
    //             ...this.state.formData,
    //             jobwork_outward_product : oldJobworkOutwardProductArray
    //         }
    //     })
    //     this.setTOTAL();
    // }

    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.process_id) && issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno))
        {
            var selectedItems = _.filter(FORMDATA.jobwork_invoice_inventory, (item) => {
                // console.log(item)
                return item.selected  && item.qty && item.rate &&item.amount  ;
            });

            if(selectedItems.length > 0)
            {
                return false;
            }
            else{
                return true;
            }
        }
        else{
            return true;
        }
    }
   
    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_jobwork_invoice') } }>
                            { this.id ? "Back" : 'List'}
                        </Button>
                    </div>
                </div>
                <br/>
                <Form
                    ref={this.formRef}
                    name="basic"
                    initialValues={this.state.formData}
                    // onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    >
                        
                   
                   <div className="row">
                       <Selectbox modelName="ledger_id" autoFocus label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.onLedgerAndProcessChange}></Selectbox>
                       <Selectbox modelName="process_id" className="col-md-4" label="Process" options={this.state.process} value={this.state.formData.process_id} onChange={this.onLedgerAndProcessChange} ></Selectbox>
                       <Selectbox modelName="order_id" onChange={this.getProductAndSizeSBForOrderID} label="Order No" className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id} ></Selectbox>
                   </div>

                   <div className="row">
                   <Selectbox modelName="product_id"  label="Product" className="col-md-4" options={this.state.product} value={this.state.formData.product} ></Selectbox>
                   <Selectbox modelName="size_id"  label="Size" className="col-md-4" options={this.state.size_data} value={this.state.formData.size_id} ></Selectbox>
                    <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                   </div>

                   <div className="row">
                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                       {/* <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox> */}
                        <Selectbox modelName="ledger2_id"  label="Accounts Ledger" className="col-md-4" options={this.state.acLedger_data} required="false" value={this.state.formData.ledger2_id} ></Selectbox>

                     <Textbox label="Ref No" modelName="refno" required="false" className="col-md-4"></Textbox>
                   </div>

                    
                  
                   <div className="row">
                     {/* <Textbox label="Ref No" modelName="refno" required="false" className="col-md-4"></Textbox> */}
                        <Textbox label="Vehicle No" modelName="vehicle_no" required="false" className="col-md-4"></Textbox>
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                     {/* <Selectbox modelName="menu_id" required="false" label="Menu" className="col-md-6" options={this.state.menu_data} value={this.state.formData.menu_id} ></Selectbox> */}
 
                   </div>

                   

                          <Divider orientation="left" plain> Product</Divider>
                    <br/>
                    <div className="row">
                        <div className="col-md-12 table-scroll">
                            <table id="dynamic-table" className="table table-bordered">
                                    {/* <thead>
                                        <tr>
                                            <th colSpan="1" className="primary-header" style={{ backgroundColor : 'lightblue' }} > <b> COLOR</b></th>
                                            <th colSpan={this.state.size_data_for_order.length} className="primary-header" style={{ backgroundColor : 'grey' }} > <b> </b></th>
                                        </tr>
                                    </thead> */}
                                    <thead>
                                        <tr>
                                            <th width="100px"> <Checkbox onChange={this.checkAllItems} /></th>
                                            {/* <th width="250px"> <b> Product</b></th> */}
                                            <th width="200px"> <b> DC No</b></th>
                                            <th width="200px"> <b> Qty</b></th>
                                            <th width="200px"> <b> Rate</b></th>
                                            <th width="200px"> <b> Amount</b></th>
                                            <th width="100px">
                                                <Button type="primary"  onClick={this.addJobworkInvoiceInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="jobwork_invoice_inventory">
                                                        { (fields, { add, remove } )=> (
                                                            fields.map((field, index) => (
                                                                <tr key={index}>
                                                                {/* <Fragment> */}
                                                                
                                                                <td style={{ textAlign : 'center' }}>
                                                                    <Form.Item
                                                                    valuePropName="checked"
                                                                    name={[field.name, "selected"]}
                                                                    fieldKey={[field.fieldKey, "selected"]}
                                                                    // initialValue={false}
                                                                    >
                                                                        <Checkbox onChange={this.setTOTAL}></Checkbox>
                                                                    </Form.Item>


                                                                    {/* <Checkbox field={field} fieldKey={[ field.fieldKey, 'selected' ]} modelName={[field.name, 'selected']} checked={[field.name, 'selected']} value={[field.name, 'selected']} /> */}
                                                                </td>
                                                                
                                                                {/* <td>
                                                                <Selectbox disabled onChange={(order_id) => this.getProductAndSizeSBForOrderID(order_id,index)}  noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} options={this.state.order_no} field={field} fieldKey={[ field.fieldKey, 'order_id' ]}  modelName={[field.name, 'order_id']} value={[field.name, 'order_id']} label="Order No" ></Selectbox>  
                                                                </td> */}
                                                                {/* <td>
                                                                <Selectbox label="Product"  noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} options={this.state.product} field={field} fieldKey={[ field.fieldKey, 'product_id' ]} disabled modelName={[field.name, 'product_id']} value={[field.name, 'product_id']}  ></Selectbox>  
                                                                </td> */}
                                                                <td>
                                                                <Selectbox label="DC No"  noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} options={this.state.size_id} field={field} fieldKey={[ field.fieldKey, 'vouno' ]} disabled modelName={[field.name, 'vouno']} value={[field.name, 'vouno']}  ></Selectbox>  
                                                                </td>
                                                                
                                                                
                                                               
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']} disabled  label="Qty" onChange={this.setTOTAL}></Numberbox>
 
                                                                </td>
                                                                <td>
                                                                <Numberbox noPlaceholder disabled required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'rate' ]}  modelName={[field.name, 'rate']} value={[field.name, 'rate']} label="Rate"></Numberbox>
 
                                                                </td>
                                                                <td>
                                                                <Numberbox noPlaceholder disabled required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'amount' ]}  modelName={[field.name, 'amount']} value={[field.name, 'amount']} label="Amount" disabled onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobworkInvoiceInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
                                                    <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={2}> <h6> Total</h6></td>

                                            <td > <h6> { this.state.formData.inventory_qty_total }</h6></td>
                                           
                                              <td></td>
                                            <td > <h6> { this.state.formData.inventory_amount_total }</h6></td>
                                            
                                        </tr>

                                            {/* ); */}
                                        {/* })} */}
                                    </tbody>
                                </table>
                        </div>
                    </div>
                    <br/>
                       
                      
                   <div className="row">
                       <div className="col-md-12">
                           <Form.Item>
                               <Button type="primary" disabled={ this.checkButtonDisabled() } onClick={this.onFinish}  htmlType="submit" loading={this.state.buttonLoading}>
                               { this.id ? "Update" : 'Submit'}
                               </Button>
                           </Form.Item>
                       </div>
                   </div>


                   
               </Form>
               
                
                {/* <div className="row"> 
                    <div className="col-md-6">
                        <pre> { JSON.stringify(this.formRef, null, 2)  } </pre>
                    </div>
                    <div className="col-md-6">
                        <pre> { JSON.stringify(this.state.formData, null, 2)  } </pre>
                    </div>

                </div> */}
               
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddJobworkInvoice));