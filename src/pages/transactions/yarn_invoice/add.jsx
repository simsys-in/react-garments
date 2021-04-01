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


class AddYarn_Invoice extends PureComponent{
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
                yarn_invoice_inventory : [
                    {  
                        fabrics : '',
                        gsm : '',
                        counts : '',
                        qtybag_per :'' ,
                        qty_bag : '',
                        qty_kg : '',
                        rate : '',
                        amount : '',
                      
                    }
                ]
            },
            companiesList : [],
            ledger_name : [],
            process : [],
            order_no : [],
            fabric : [],
            color : [],
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      getLedgerNameSB = () => {
        getRequest('transactions/getLedgerNameSB').then(data => {
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

    getFabricsSB = () => {
        
        getRequest('transactions/getFabricsSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric : data.data
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
                    color : data.data
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

    getYarn_Invoice = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/yarn_invoice?id=" + this.id).then(data => {
                data.data.date = moment(data.data.date)
                console.log(data.data)
                data.data.vou_date = moment(data.data.vou_date)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
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


    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.getYarn_Invoice();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Yarn Invoice',
            metaDescription: 'Add Yarn Invoice'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Yarn Invoice',
                metaDescription: 'Edit Yarn Invoice'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('transactions/yarn_invoice?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_yarn_invoice')
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

    addYarn_invoice_inventory = () => {
        var newYarn_invoice_inventory = {
            fabrics : '',
            gsm : '',
            counts : '',
            qtybag_per :'' ,
            qty_bag : '',
            qty_kg : '',
            rate : '',
            amount : '',
           
        }

        var oldYarn_invoice_inventoryArray = this.state.formData.yarn_invoice_inventory;

        oldYarn_invoice_inventoryArray.push(newYarn_invoice_inventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_invoice_inventory : oldYarn_invoice_inventoryArray
            }
        })
    }
    //total of answer+answer=answer

    setTotalKgs = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_invoice_inventory = values.yarn_invoice_inventory;
        var total_kg = 0;
        yarn_invoice_inventory.map((item, index) => {
            total_kg += item.qty_kg;

            if(index === yarn_invoice_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_kg_total : total_kg
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_kg_total : total_kg
                    })
                })
            }

        })
    }
    setTotalAmounts = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_invoice_inventory = values.yarn_invoice_inventory;
        var total_amount = 0;
        yarn_invoice_inventory.map((item, index) => {
            total_amount += Number(item.amount);

            if(index === yarn_invoice_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_amount_total : total_amount
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_amount_total : total_amount
                    })
                })
            }

        })
    }

    //total of bags answer+answer+answer
    setTotalBags = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_invoice_inventory = values.yarn_invoice_inventory;
        var total_bag = 0;
        yarn_invoice_inventory.map((item, index) => {
            total_bag += Number(item.qty_bag);

            if(index === yarn_invoice_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_bag_total : total_bag
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_bag_total : total_bag
                    })
                })
            }

        })
    }

    //total of multiplication example 20*4=80

    setQTYKG = (ev, index) => {
        var values = this.formRef.current.getFieldValue();
        var fabric = values.yarn_invoice_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

        values.yarn_invoice_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_invoice_inventory : values.yarn_invoice_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            // this.setTotalKgs();
            // this.setTotalBags();
            // this.setTotalAmounts();

        })
    }

    //multiplication function example var * var = answer
    setAMOUNT = (ev, index) => {
        var values = this.formRef.current.getFieldValue();
        var fabric = values.yarn_invoice_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.amount = currentFabric.qty_kg * currentFabric.rate;

        values.yarn_invoice_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_invoice_inventory : values.yarn_invoice_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            this.setTotalKgs();
            this.setTotalBags();
            this.setTotalAmounts();

        })
    }
    removeYarn_invoice_inventory = (index) => {
        var oldYarn_invoice_inventoryArray = this.state.formData.yarn_invoice_inventory;

        oldYarn_invoice_inventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_invoice_inventory : oldYarn_invoice_inventoryArray
            }
        })
        this.setTotalAmounts();
        this.setTotalBags();
        this.setTotalKgs();
    }

    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_yarn_invoice') } }>
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
                        <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID}  className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        <Selectbox modelName="process_id" label="Process"  className="col-md-6" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-6"></Textbox> */}

                    </div>
                    <div className="row">
                       
                        <Textbox label="Ref No" modelName="refno"  className="col-md-6"></Textbox>
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>
                        
                    </div>
                    <div className="row">
                       
                      
                    

                    </div>
                    <div>
                    <div className="row">
                             <div className="col-md-12">
                             <Divider plain orientation="left" >Products</Divider>  
                             <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row flex-nowrap">
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Fabric" label="Fabric" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1-5" disabled defaultValue="GSM" label="GSM" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1-5" disabled defaultValue="Count" label="Count" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty Per" label="Qty Per" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty Bags" label="Qty Bags" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty KGs" label="Qty KGs" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty Rate" label="Qty Rate" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Amount" label="Amount" required="false"></Textbox>
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <Button type="primary" onClick={this.addYarn_invoice_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                    </div>
                                </div>   
                                     <Form.List name="yarn_invoice_inventory">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                            <div className="col-md-11">
                                                        <div className="row flex-nowrap">
                                                        <Selectbox noPlaceholder withoutMargin showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={field.name,'fabric_id'} required="false" options={this.state.fabric} label="Fabric"></Selectbox>
                                                            {/* <Selectbox className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={field.color_id} options={this.state.color} label="Color"></Selectbox> */}
                                                            <Textbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-1-5" field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={field.gsm} label="Gsm"></Textbox>

                                                            <Textbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-1-5" field={field} fieldKey={[ field.fieldKey, 'counts' ]} required = 'false' modelName={[field.name, 'counts']} value={field.counts} label="Counts"></Textbox>

                                                            <Numberbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'qtybag_per' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } modelName={[field.name, 'qtybag_per']} value={field.qtybag_per} label="Qty per"></Numberbox>

                                                            <Numberbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'qty_bag' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } modelName={[field.name, 'qty_bag']} value={field.qty_bag} label="Qty Bags"></Numberbox>

                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'qty_kg' ]} disabled required = 'false' onChange={(ev)=> this.setAMOUNT(ev,field.fieldKey)}modelName={[field.name, 'qty_kg']} value={field.qty_kg} label="Qty Kg"></Numberbox>
                                                            
                                                            <Numberbox required="false" noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'rate' ]} onChange={(ev)=> this.setAMOUNT(ev,field.fieldKey)} modelName={[field.name, 'rate']} value={field.rate} label="Rate"></Numberbox>
                                                           
                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'amount' ]} disabled required = 'false' modelName={[field.name, 'amount']} value={field.amount} label="Amount"></Numberbox>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-1">
                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarn_invoice_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}
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
                                <div className="row flex-nowrap">
                                    <div className="col-md-6"></div>
                                    <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Total" label="Total" required="false"></Textbox>
                                    <Numberbox noPlaceholder required="false" withoutMargin showLabel={false} className="col-md-1" modelName="inventory_qty_bag_total" value={this.state.formData.inventory_qty_bag_total} disabled label="Total Bags" ></Numberbox>
                             <Numberbox noPlaceholder required="false" withoutMargin showLabel={false} className="col-md-1" modelName="inventory_qty_kg_total" value={this.state.formData.inventory_qty_kg_total} disabled label="Total KGs" ></Numberbox>
                             <Numberbox required="false" noPlaceholder withoutMargin showLabel={false} className="col-md-1"  disabled  ></Numberbox>
                           <Numberbox noPlaceholder required="false" withoutMargin showLabel={false} className="col-md-1" modelName="inventory_amount_total" value={this.state.formData.inventory_amount_total} disabled label="Total Amounts" ></Numberbox>
                                </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddYarn_Invoice));