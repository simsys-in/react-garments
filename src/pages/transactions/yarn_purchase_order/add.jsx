import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider, message,Input  } from 'antd';
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

const paymentMode = [
    {
        name : "Cash",
        value : 'cash'
    },
    {
        name : "Cheque",
        value : 'cheque'
    },
    {
        name : "Internet Banking",
        value : "internet_banking"
    }
]


class AddYarnPurchaseOrder extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active',
                order_id : '',
                vou_date : moment(),
                narration: '',
                payment_mode : '',
                payment_terms_conditions : '',
                yarn_purchase_order_inventory : [
                    {
                        yarn_id : null,
                        hsnsac : null,
                        unit_id: null,
                        gsm: 0,
                        count : 0,
                        qty : 0,
                        rate : 0,
                        amount : 0
                      
                    }
               
                ],
                
            },
        
            ledger_name : [],
            yarn_data : [],
            unit_data: [],
            order_no : [],
           
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


   
   

   
  

    getYarnSB = () => {

        getRequest('garments/getYarnSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    yarn_data : data.data
                })
            }
        })
    }

    getUnitSB = () => {
        getRequest('garments/getUnitSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    unit_data : data.data
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
        var yarn_purchase_order_inventory = values.yarn_purchase_order_inventory;
        var total_qty = 0;
        var total_amount = 0;
        yarn_purchase_order_inventory.map((item, index) => {
            // console.log(item);
            item.amount = item.qty *item.rate; 
        
                total_qty += Number(item.qty)
                total_amount += Number(item.amount)

                if(index === yarn_purchase_order_inventory.length - 1)
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

    getYarnPurchaseOrder = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/yarnPurchaseOrder?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.getMobileForLedgerId(data.data.ledger_id);
                

                data.data.yarn_purchase_order_inventory.map((item,index) => {
                    this.getHsnAndRateForProductId(item.yarn_id, index)
                })

                
               
            })

        }
        else{

            this.getNextYarnPurchaseOrderVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextYarnPurchaseOrderVouNo = () => {
        getRequest('garments/getNextYarnPurchaseOrderVouNo').then(data => {
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

    
 componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        this.getYarnSB();
        this.getUnitSB();
        this.setTOTAL();
        this.getYarnPurchaseOrder();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }

    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Yarn Purchase Order',
            metaDescription: 'Add Yarn Purchase Order'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Purchase Order',
                metaDescription: 'Edit Purchase Order'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/yarnPurchaseOrder?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_yarn_purchase_order')
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

    
    getHsnAndRateForProductId = (yarn_id, index) => {
        getRequest('garments/getHsnAndRateForProductId?product_id=' + yarn_id).then(data => {
            if(data.status === "info")
            {
                var yarn_purchase_order_inventory = this.state.formData.yarn_purchase_order_inventory;
                var currentItem = yarn_purchase_order_inventory[index];
                currentItem.unit_id = data.data.unit_id;
                currentItem.hsnsac = data.data.hsnsac;
                currentItem.rate = data.data.purchase_amount;
                currentItem.yarn_id = yarn_id;
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        yarn_purchase_order_inventory : yarn_purchase_order_inventory
                    },
                },()=>{
                    this.formRef.current.setFieldsValue(this.state.formData)
                })
            }
        })
    }
    
    
    


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


    addYarnPurchaseOrderInventory = () => {
        var newYarnPurchaseOrderInventory = {
        
            yarn_id : null,
            unit_id: null,
            hsnsac : null,
            gsm: 0,
            count : 0,
            qty : 0,
            rate : 0,
            amount : 0
            
        }

        var oldYarnPurchaseOrderInventoryArray = this.state.formData.yarn_purchase_order_inventory;

        oldYarnPurchaseOrderInventoryArray.push(newYarnPurchaseOrderInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_purchase_order_inventory : oldYarnPurchaseOrderInventoryArray

            }
        })
    }

   
    removeYarnPurchaseOrderInventory = (index) => {
        var oldYarnPurchaseOrderInventoryArray = this.state.formData.yarn_purchase_order_inventory;

        oldYarnPurchaseOrderInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_purchase_order_inventory : oldYarnPurchaseOrderInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno) && issetNotEmpty(FORMDATA.payment_mode))
        {
            var selectedItems = _.filter(FORMDATA.yarn_purchase_order_inventory, (item) => {
                // console.log(item)
                return  item.yarn_id &&item.gsm &&item.count && item.hsnsac && item.qty && item.rate && item.amount ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_yarn_purchase_order') } }>
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
                       <Selectbox modelName="ledger_id" autoFocus label="Ledger Name"  className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getMobileForLedgerId}></Selectbox>
                       <Textbox modelName="mobile" disabled label="Mobile" className="col-md-4" required="false"></Textbox>
                       <Selectbox modelName="order_id" label="Order No" required='false' className="col-md-4" options={this.state.order_no}  value={this.state.formData.order_id}  ></Selectbox>

                   </div>
                   <div className="row">
                       <Textbox modelName="delivery_address"  label="Delivery Address" className="col-md-4" required="false"></Textbox>
                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                       {/* <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox> */}
                       <Selectbox modelName="payment_mode"  label="Payment Mode" className="col-md-4" options={paymentMode} value={this.state.formData.payment_mode} ></Selectbox>

                   </div>
                    
                   <div className="row">
                       <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                        {/* <Form.Item name={'payment_terms_conditions'} label="Terms And Conditions" className="col-md-8">
                            <Input.TextArea addonBefore="Terms and Conditions"  />
                        </Form.Item> */}

                  </div>
                 
                  
                  

                          <Divider orientation="left" plain> Inventory</Divider>
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
                                            <th width="300px"> <b> Yarn</b></th>
                                            <th width="250px"> <b> GSM</b></th>
                                            <th width="250px"> <b> Count</b></th>
                                            <th width="250px"> <b> HSN/SAC</b></th>
                                            <th width="200px"> <b> Qty</b></th>
                                            <th width="300px"> <b> Unit</b></th>
                                            <th width="200px"> <b> Rate</b></th>
                                            <th width="200px"> <b> Amount</b></th>
                                            <th width="100px">
                                                <Button type="primary"  onClick={this.addYarnPurchaseOrderInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="yarn_purchase_order_inventory">
                                                        { (fields, { add, remove } )=> (
                                                            fields.map((field, index) => (
                                                                <tr key={index}>
                                                                
                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'yarn_id' ]}  modelName={[field.name, 'yarn_id']} value={[field.name, 'yarn_id']} onChange={(yarn_id) => this.getHsnAndRateForProductId(yarn_id, index)} options={this.state.yarn_data} label="Yarn"></Selectbox>
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]}  modelName={[field.name, 'gsm']} value={[field.name, 'gsm']}   label="GSM" ></Numberbox>
 
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'count' ]}  modelName={[field.name, 'count']} value={[field.name, 'count']}   label="Count" ></Numberbox>
 
                                                                </td>

                                                                <td>
                                                                <Textbox label="HSN/SAC"  noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'hsnsac' ]} disabled modelName={[field.name, 'hsnsac']} value={[field.name, 'hsnsac']}  ></Textbox>  
                                                                </td>


                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']}   label="Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                                <td><Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'unit_id' ]} disabled modelName={[field.name, 'unit_id']}  label="Unit" value={[field.name, 'unit_id']} options={this.state.unit_data} noPlaceholder withoutMargin ></Selectbox></td>
                                                                <td>
                                                                <Numberbox noPlaceholder  required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'rate' ]} onChange={(ev) => this.setTOTAL(ev,field.fieldKey)} modelName={[field.name, 'rate']} value={[field.name, 'rate']} label="Rate"></Numberbox>
 
                                                                </td>
                                                                <td>
                                                                <Numberbox noPlaceholder  required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'amount' ]}  modelName={[field.name, 'amount']} value={[field.name, 'amount']} label="Amount" disabled onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarnPurchaseOrderInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
                                                    <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={5}> <h6> Total</h6></td>

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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddYarnPurchaseOrder));