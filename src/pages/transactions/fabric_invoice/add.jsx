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
                status : 'active',
                vou_date : moment(),
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
        getRequest('masters/getAllLedgerSB').then(data => {
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
        
        getRequest('transactions/getProcessSB').then(data => {
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
        
        getRequest('transactions/getColorSB').then(data => {
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
        
        getRequest('transactions/getFabricSB').then(data => {
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

        getRequest('transactions/getOrderSB').then(data => {
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
        getRequest('masters/getProcessSBForOrderID?order_id=' + order_id).then(data => {
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
            total_roll += Number(item.roll);
            total_weight += Number(item.weight);
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
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/fabricInvoice?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }


    getNextFabricInvoiceVouNo = () => {
        getRequest('transactions/getNextFabricInvoiceVouNo').then(data => {
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
        this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.getNextFabricInvoiceVouNo();
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
            putRequest('transactions/fabricInvoice?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_fabric_invoice')
                    console.log(data) 
                }
            })
            .catch(err => {
                console.log(err);
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
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    >
                        
                        <div className="row">
                       
                            <Selectbox modelName="ledger_id" label="Ledger Name" className="col-md-6" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                            <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-6"></Datebox>
                       </div>
                   
                   
                  
                   <div className="row">
                       <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID} className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                       <Selectbox modelName="process_id" label="Process" className="col-md-6" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                   </div>

                   <div className="row">
                        <Textbox label="Vou No" modelName="vouno"  className="col-md-6"></Textbox>
                       <Textbox label="Ref No" modelName="refno"  className="col-md-6"></Textbox>

                   </div>

                   <div className="row">
                       <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>
                   </div>
                   
                   <div className="row">
                            <div className="col-md-12">
                            <Divider plain orientation="left" >Products</Divider>
                            <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row">
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Fabric" label="Fabric" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Color" label="Color" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Gsm" label="Gsm" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Dia" label="Dia" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Roll" label="Roll" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Weight" label="Weight" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Rate" label="Rate" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Amount" label="Amount" required="false"></Textbox>
                                            
                                        </div>
                                    </div>
                                        <div className="col-md-1">
                                            <Button type="primary"  onClick={this.addFabricInvoiceInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                        </div>
                                    
                                </div>
                             <Form.List name="fabric_invoice_inventory">
                                   { (fields, { add, remove } )=> (
                                       fields.map((field, index) => (
                                               <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                   <div className="col-md-11">
                                                       <div className="row">
                                                           <Selectbox withoutMargin required="false" noPlaceholder className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} options={this.state.fabric} label="Fabric"></Selectbox>
                                                           <Selectbox withoutMargin required="false" noPlaceholder className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox>
                                                           <Textbox withoutMargin required="false" noPlaceholder className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={[field.name, 'gsm']} label="Gsm"></Textbox>
                                                           <Textbox withoutMargin required="false" noPlaceholder className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} required = 'false' modelName={[field.name, 'dia']} value={[field.name, 'dia']} label="Dia"></Textbox>                                                          
                                                           <Numberbox withoutMargin required="false" noPlaceholder className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'roll' ]}  modelName={[field.name, 'roll']} value={[field.name, 'roll']} label="Roll" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox withoutMargin required="false" noPlaceholder className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'weight' ]}  modelName={[field.name, 'weight']} value={[field.name, 'weight']} label="Weight" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox withoutMargin required="false" noPlaceholder className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'rate' ]}  modelName={[field.name, 'rate']} value={[field.name, 'rate']} label="Rate"></Numberbox>
                                                           <Numberbox withoutMargin required="false" noPlaceholder className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'amount' ]}  modelName={[field.name, 'amount']} value={[field.name, 'amount']} label="Amount" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           
                                                       </div>
                                                   </div>
                                                       <div className="col-md-1">
                                                       
                                                                { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeFabricInvoiceInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                        </div>
                                                   
                                                </div>
                                    )
                                           
                                    )
                                ) }
                               </Form.List>        
                          </div>
                        </div>
                       
                        
                       
                       <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                            <div className="col-md-11">
                                <div className="row">
                                    <div className="col-md-3"></div>
                                    <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Total" label="Total" required="false"></Textbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" modelName='inventory_roll_total' value={this.state.formData.total_roll} disabled label='Total Roll'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" modelName='inventory_weight_total' value={this.state.formData.total_weight} disabled label='Total Weight'></Numberbox>
                                    <Textbox withoutMargin noPlaceholder required="false" disabled label="empty" className="col-md-1" showLabel={false}></Textbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" modelName='inventory_amount_total' value={this.state.formData.total_weight} disabled label='Total Amount'></Numberbox>

                                </div>
                            </div>
                        </div>
                        

                   <div className="row">
                       <div className="col-md-12">
                           <Form.Item>
                               <Button type="primary" disabled={ this.state.buttonDisabled }  htmlType="submit" loading={this.state.buttonLoading}>
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