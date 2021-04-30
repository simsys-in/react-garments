import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider  } from 'antd';
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
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { issetNotEmpty } from '../../../helpers/formhelpers';
import _ from 'lodash';


let interval;


class AddFabricInvoice extends PureComponent{
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
                refno :"",
                
                vou_date : moment(),
                narration : "",
                order_id: 0,
                fabric_invoice_inventory : [
                    {  
                        fabric_id : '',
                        color_id : '',
                        gsm : '',
                        dia : '',
                        roll :'' ,
                        weight : '',
                        rate : '',
                        amount : ''
                    
                      
                    }
                ]
            },
            companiesList : [],
            ledger_name : [],
            process : [],
            order_no : [],
            fabric : [],
            color_data : []
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

    getColorSB = () => {
        
        getRequest('garments/getAllColorSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    color_data : data.data
                })
            }
        })
    }


    getFabricsSB = () => {
        
        getRequest('garments/getFabricsSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric : data.data
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

    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var fabric_invoice_inventory = values.fabric_invoice_inventory;
        var total_roll = 0;
        var total_weight = 0;
        var total_amount = 0;
        fabric_invoice_inventory.map((item, index) => {
            if(item.selected){

                total_roll += Number(item.roll);
                total_weight += Number(item.weight);
                item.amount = Number(item.rate) * Number(item.weight);
                total_amount += Number(item.amount);
    
                if(index === fabric_invoice_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            inventory_roll_total : total_roll,
                            inventory_weight_total : total_weight,
                            inventory_amount_total : total_amount
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            inventory_roll_total : total_roll,
                            inventory_weight_total : total_weight,
                            inventory_amount_total : total_amount
                        })
                    })
                }
            }else{
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_roll_total : total_roll,
                        inventory_weight_total : total_weight,
                        inventory_amount_total : total_amount
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_roll_total : total_roll,
                        inventory_weight_total : total_weight,
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

    getFabricInvoice = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/fabricInvoice?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.getFabricInwardInventoryDetails(data.data.ledger_id)

            })

        }
        else{

            this.getNextFabricInvoiceVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }


    getNextFabricInvoiceVouNo = () => {
        getRequest('garments/getNextFabricInvoiceVouNo').then(data => {
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

    getFabricInwardInventoryDetails = (ledger_id) =>{
        if(!this.id){

            getRequest('garments/getFabricInwardInventoryDetails?ledger_id=' +ledger_id).then(data => {
                if(data.status === "info")
                {
                    var newArr = data.data;
                    this.state.formData.fabric_invoice_inventory.map((item) => {
                        newArr.map(obj => {
                            if(obj.fabric_id === item.fabric_id)
                            {
                                // item.selected = true;
                                obj = Object.assign({},  item);
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
                            fabric_invoice_inventory : newArr
                        },
                    },()=>{
                        this.formRef.current.setFieldsValue({
                            fabric_invoice_inventory : this.state.formData.fabric_invoice_inventory
                        })
                        this.setTOTAL()
                    })
                }
            })
        }
    }

    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.setTOTAL();
        this.getFabricInvoice();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Fabric Invoice',
            metaDescription: 'Add Fabric Invoice'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Fabric Invoice',
                metaDescription: 'Edit Fabric Invoice'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/fabricInvoice?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_fabric_invoice')
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

    addFabricInvoiceInventory = () => {
        var newFabricInvoiceInventory = {
            fabric_id : '',
            color_id : '',
            gsm : '',
            dia : '',
            roll :'' ,
            weight : '',
            rate : '',
            amount : ''
        }

        var oldFabricInvoiceInventoryArray = this.state.formData.fabric_invoice_inventory;

        oldFabricInvoiceInventoryArray.push(newFabricInvoiceInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                fabric_invoice_inventory : oldFabricInvoiceInventoryArray

            }
        })
    }

   
    removeFabricInvoiceInventory = (index) => {
        var oldFabricInvoiceInventoryArray = this.state.formData.fabric_invoice_inventory;

        oldFabricInvoiceInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                fabric_invoice_inventory : oldFabricInvoiceInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.fabric_invoice_inventory;
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
    
    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno)  && issetNotEmpty(FORMDATA.process_id) && issetNotEmpty(FORMDATA.refno))
        {
            var selectedItems = _.filter(FORMDATA.fabric_invoice_inventory, (item) => {
                // console.log(item)
                return item.selected && item.fabric_id && item.color_id && item.gsm && item.dia && item.roll &&item.weight &&item.rate &&item.amount ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_fabric_invoice') } }>
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
                       
                            <Selectbox modelName="ledger_id" label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getFabricInwardInventoryDetails} ></Selectbox>
                            <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                        <Textbox label="Vou No" modelName="vouno"  className="col-md-4"></Textbox>
                       </div>
                   
                   
                  
                   <div className="row">
                       <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID} className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                       <Selectbox modelName="process_id" label="Process" className="col-md-4" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                       <Textbox label="Ref No" required="false" modelName="refno"  className="col-md-4"></Textbox>
                   </div>

                  

                   <div className="row">
                       <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                       <Textbox label="Vehicle No" modelName="vehicle_no" required="false" className="col-md-4"></Textbox>
                   </div>
                   
                   <div className="row">
                            <div className="col-md-12 table-scroll">
                            <Divider plain orientation="left" >Products</Divider>
                            <table id="dynamic-table" className="table table-bordered">
                             <thead >
                                    <tr>

                                        <th width="100px"> <Checkbox onChange={this.checkAllItems} /></th>
                                        <th width="200px">Fabric </th>
                                        <th width="200px">Color</th>
                                        <th>GSM</th>
                                        <th>Dia</th>
                                        <th>Roll</th>
                                        <th>Weight</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th><Button type="primary"  onClick={this.addFabricInvoiceInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="fabric_invoice_inventory">
                                   { (fields, { add, remove } )=> (
                                       fields.map((field, index) => (
                                        <tr key={index}>
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
                                            
                                               <td>  <Selectbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} options={this.state.fabric} label="Fabric"></Selectbox></td>

                                               <td> <Selectbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} disabled options={this.state.color_data} label="Color"></Selectbox></td>

                                               <td>   <Numberbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} disabled modelName={[field.name, 'gsm']} value={[field.name, 'gsm']} label="Gsm"></Numberbox></td>

                                               <td> <Numberbox withoutMargin required="false" noPlaceholder className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} required = 'false' modelName={[field.name, 'dia']} disabled value={[field.name, 'dia']} label="Dia"></Numberbox> </td>

                                               <td> <Numberbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'roll' ]}  modelName={[field.name, 'roll']} value={[field.name, 'roll']} label="Roll" max={this.state.formData.fabric_invoice_inventory[index]['max_roll']} onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                               <td><Numberbox withoutMargin required="false" noPlaceholder className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'weight' ]}  modelName={[field.name, 'weight']} value={[field.name, 'weight']} max={this.state.formData.fabric_invoice_inventory[index]['max_weight']} label="Weight" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                               <td><Numberbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'rate' ]}  modelName={[field.name, 'rate']} value={[field.name, 'rate']} onChange={(ev) => this.setTOTAL(ev,field.fieldKey)} label="Rate"></Numberbox></td>
                                               <td>  <Numberbox withoutMargin required="false" noPlaceholder className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'amount' ]}  modelName={[field.name, 'amount']} value={[field.name, 'amount']} label="Amount" disabled onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                               <td> { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeFabricInvoiceInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}</td>
                                           </tr>
                                            )
                                           
                                            )
                                        ) }
                                       </Form.List> 
                                       <tr>
                                            <td colSpan={5} style={{textAlign:'right'}}> <h6> Total</h6></td>

                                            <td> <Numberbox withoutMargin showLabel={false} className="col-md-12" modelName='inventory_roll_total' value={this.state.formData.total_roll} disabled label='Total Roll'></Numberbox></td>

                                            <td><Numberbox withoutMargin showLabel={false} className="col-md-12" modelName='inventory_weight_total' value={this.state.formData.total_weight} disabled label='Total Weight'></Numberbox></td>
                                            <td></td>
                                            <td > <Numberbox withoutMargin showLabel={false} className="col-md-12" modelName='inventory_amount_total' value={this.state.formData.total_amount} disabled label='Total Amount'></Numberbox></td>

                                       </tr>
                                </tbody>
                                {/* <tfoot> */}

                                {/* </tfoot> */}
                                </table>
                             </div>
                        </div>
                         <br />
                        

                   <div className="row">
                       <div className="col-md-12">
                           <Form.Item>
                               <Button type="primary" disabled={  this.checkButtonDisabled()  } onClick={this.onFinish}  htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddFabricInvoice));