import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { getStandardDate } from '../../../helpers/timer';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';
import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';
import Datebox from '../../../components/Inputs/Datebox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import Checkbox from 'antd/lib/checkbox/Checkbox';


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
                refno : "",
                narration : "",
                status : 'active',
                vou_date : moment(),
                order_id : 0,
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
    getColorSB = () => {
        
        getRequest('garments/getAllColorSB').then(data => {
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
            getRequest("garments/yarn_invoice?id=" + this.id).then(data => {
                data.data.date = moment(data.data.date)
                console.log(data.data)
                data.data.vou_date = moment(data.data.vou_date)
                this.formRef.current.setFieldsValue(data.data);
                this.getYarnInwardInventoryDetails(data.data.ledger_id)
                this.setTotal();

            })

        }
        else{
            this.getNextYarnInvoiceVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextYarnInvoiceVouNo = () => {
        getRequest('garments/getNextYarnInvoiceVouNo').then(data => {
            console.log(data);
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

    getYarnInwardInventoryDetails = (ledger_id) =>{
        if(!this.id){

            getRequest('garments/getYarnInwardInventoryDetails?ledger_id=' +ledger_id).then(data => {
                if(data.status === "info")
                {
                    var newArr = data.data;
                    this.state.formData.yarn_invoice_inventory.map((item) => {
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
                            yarn_invoice_inventory : newArr
                        },
                    },()=>{
                        this.formRef.current.setFieldsValue({
                            yarn_invoice_inventory : this.state.formData.yarn_invoice_inventory
                        })
                        this.setTotal()
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
            putRequest('garments/yarn_invoice?id=' + this.id, this.state.formData).then(data => {
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

    // setTotalKgs = () =>{
    //     var values = this.formRef.current.getFieldValue();
    //     var yarn_invoice_inventory = values.yarn_invoice_inventory;
    //     var total_kg = 0;
    //     yarn_invoice_inventory.map((item, index) => {
    //         total_kg += item.qty_kg;

    //         if(index === yarn_invoice_inventory.length - 1)
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 formData : {
    //                     ...this.state.formData,
    //                     inventory_qty_kg_total : total_kg
    //                 }
    //             }, () => {
    //                 this.formRef.current.setFieldsValue({
    //                     inventory_qty_kg_total : total_kg
    //                 })
    //             })
    //         }

    //     })
    // }
    // // setTotalAmounts = () =>{
    //     var values = this.formRef.current.getFieldValue();
    //     var yarn_invoice_inventory = values.yarn_invoice_inventory;
    //     var total_amount = 0;
    //     yarn_invoice_inventory.map((item, index) => {
    //         total_amount += Number(item.amount);

    //         if(index === yarn_invoice_inventory.length - 1)
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 formData : {
    //                     ...this.state.formData,
    //                     inventory_amount_total : total_amount
    //                 }
    //             }, () => {
    //                 this.formRef.current.setFieldsValue({
    //                     inventory_amount_total : total_amount
    //                 })
    //             })
    //         }

    //     })
    // }

    //total of bags answer+answer+answer
    setTotal = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_invoice_inventory = values.yarn_invoice_inventory;
    
        var total_kg = 0;
        var total_bags = 0;
        var total_bags_per = 0;
        var total_amount = 0;
       
        yarn_invoice_inventory.map((item, index) => {
            if(item.selected){
                total_bags += item.qty_bag;
                total_bags_per += item.qtybag_per;
                item.qty_kg = Number(item.qty_bag) * Number(item.qtybag_per);
                total_kg += item.qty_kg;
                item.amount = Number(item.rate) * Number(item.qty_kg);
                total_amount += Number(item.amount);
        

    
                if(index === yarn_invoice_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            inventory_qty_bag_total : total_bags,
                            inventory_qty_kg_total : total_kg,
                            inventory_amount_total : total_amount,
                            inventory_qtybag_per_total : total_bags_per
    
    
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            inventory_qty_bag_total : total_bags,
                            inventory_qty_kg_total : total_kg,
                            inventory_amount_total : total_amount,
                            inventory_qtybag_per_total : total_bags_per
                        })
                    })
                }
            }else{
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_bag_total : total_bags,
                        inventory_qty_kg_total : total_kg,
                        inventory_amount_total : total_amount,
                        inventory_qtybag_per_total : total_bags_per


                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_bag_total : total_bags,
                        inventory_qty_kg_total : total_kg,
                        inventory_amount_total : total_amount,
                        inventory_qtybag_per_total : total_bags_per
                    })
                })
            }

        })
    
    }

    //total of multiplication example 20*4=80

    // setQTYKG = (ev, index) => {
    //     var values = this.formRef.current.getFieldValue();
    //     var fabric = values.yarn_invoice_inventory;
    //     var currentFabric = fabric[index] ;
    //     currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

    //     values.yarn_invoice_inventory.splice(index, 1, currentFabric);

    //     this.setState({
    //         ...this.state,
    //         formData : {
    //             ...this.state.formData,
    //             yarn_invoice_inventory : values.yarn_invoice_inventory
    //         }
    //     }, () => {
    //         // var data = this.formRef.current.getFieldValue();
    //         // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
    //         this.formRef.current.setFieldsValue(values);
    //         // this.setTotalKgs();
    //         // this.setTotalBags();
    //         // this.setTotalAmounts();

    //     })
    // }

    // //multiplication function example var * var = answer
    // setAMOUNT = (ev, index) => {
    //     var values = this.formRef.current.getFieldValue();
    //     var fabric = values.yarn_invoice_inventory;
    //     var currentFabric = fabric[index] ;
    //     currentFabric.amount = currentFabric.qty_kg * currentFabric.rate;

    //     values.yarn_invoice_inventory.splice(index, 1, currentFabric);

    //     this.setState({
    //         ...this.state,
    //         formData : {
    //             ...this.state.formData,
    //             yarn_invoice_inventory : values.yarn_invoice_inventory
    //         }
    //     }, () => {
    //         // var data = this.formRef.current.getFieldValue();
    //         // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
    //         this.formRef.current.setFieldsValue(values);
    //         this.setTotalKgs();
    //         this.setTotalBags();
    //         this.setTotalAmounts();

    //     })
    // }
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
        this.setTotal();
    }

    // getOrderNos = (ledger_id)


    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.yarn_invoice_inventory;
        console.log(checked);
        inventories.map((item, index) => {
            item.selected = checked;
            if(index === inventories.length - 1)
            {
                console.log(formData);
                this.setState({
                    ...this.state,
                    formData : formData
                }, () => {
                    this.formRef.current.setFieldsValue(formData);
                    this.setTotal()
                })
            }
        })

    }


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
                    // onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    >
                        
                    <div className="row">
                       
                        <Selectbox modelName="ledger_id" label="Ledger Name" autoFocus required="true" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getYarnInwardInventoryDetails} ></Selectbox>
                        <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                    <Textbox label="Vou No" modelName="vouno"  className="col-md-4"></Textbox>

                    </div>
                    <div className="row">
                        <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID}  className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-4"></Textbox> */}
                        <Selectbox modelName="process_id" label="Process" required="true" className="col-md-4" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                        <Textbox label="Ref No" modelName="refno" required="false" className="col-md-4"></Textbox>

                    </div>
                    
                    <div className="row">
                       
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                      


                    </div>
                    <div>
                    <div className="row">
                    <div className="col-md-12 table-scroll">
                             <Divider plain orientation="left" >Products</Divider>  
                             <table id="dynamic-table" className="table table-bordered" width="100%">
                                <thead >
                                    <tr>

                                        <th width="100px"> <Checkbox onChange={this.checkAllItems} /></th>
                                        <th width="200px">Fabric </th>
                                        <th>GSM</th>
                                        <th>Count</th>
                                        <th>Qty Per</th>
                                        <th>Qty Bags</th>
                                        <th>Qty KGs</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th> <Button type="primary" onClick={this.addYarn_invoice_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="yarn_invoice_inventory">
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
                                                                            <Checkbox onChange={this.setTotal}></Checkbox>
                                                                        </Form.Item>
    
    
                                                                        {/* <Checkbox field={field} fieldKey={[ field.fieldKey, 'selected' ]} modelName={[field.name, 'selected']} checked={[field.name, 'selected']} value={[field.name, 'selected']} /> */}
                                                                    </td>
                                           
                                        <td> <Selectbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={field.name,'fabric_id'} required="false" options={this.state.fabric} label="Fabric"></Selectbox></td>

                                        <td> <Numberbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={field.gsm} label="Gsm"></Numberbox></td>

                                        <td> <Numberbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'counts' ]} required = 'false' modelName={[field.name, 'counts']} value={field.counts} label="Counts"></Numberbox></td>

                                        <td> <Numberbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qtybag_per' ]} onChange={ (ev) => this.setTotal(ev, field.fieldKey) } modelName={[field.name, 'qtybag_per']} value={field.qtybag_per} label="Qty per"></Numberbox></td>


                                        <td><Numberbox required='false' noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qty_bag' ]} onChange={ (ev) => this.setTotal(ev, field.fieldKey) } modelName={[field.name, 'qty_bag']} value={field.qty_bag} label="Qty Bags"></Numberbox></td>

                                        <td> <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qty_kg' ]} disabled required = 'false' onChange={(ev)=> this.setTotal(ev,field.fieldKey)}modelName={[field.name, 'qty_kg']} value={field.qty_kg} label="Qty Kg"></Numberbox></td>


                                        <td>  <Numberbox required="false" noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'rate' ]} onChange={(ev)=> this.setTotal(ev,field.fieldKey)} modelName={[field.name, 'rate']} value={field.rate} label="Rate"></Numberbox></td>


                                        <td><Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'amount' ]} disabled required = 'false' modelName={[field.name, 'amount']} onChange={(ev)=> this.setTotal(ev,field.fieldKey)} value={field.amount} label="Amount"></Numberbox></td>

                                        
                                        <td>  { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarn_invoice_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}</td>
                                    </tr>
                                       )
                                            
                                       )
                                   ) }
                                  </Form.List>
                                  <tr>
                                  <td colSpan={5} style={{textAlign:'right'}}> <h6> Total</h6></td>   

                                        <td><Numberbox noPlaceholder required="false" withoutMargin showLabel={false} className="col-md-12" modelName="inventory_qty_bag_total" value={this.state.formData.inventory_qty_bag_total} disabled label="Total Bags" ></Numberbox></td>

                                        <td><Numberbox noPlaceholder required="false" withoutMargin showLabel={false} className="col-md-12" modelName="inventory_qty_kg_total" value={this.state.formData.inventory_qty_kg_total} disabled label="Total KGs" ></Numberbox></td>
                                        <td></td>

                                        <td><Numberbox noPlaceholder required="false" withoutMargin showLabel={false} className="col-md-12" modelName="inventory_amount_total" value={this.state.formData.inventory_amount_total} disabled label="Total Amounts" ></Numberbox></td>
                                  </tr>
                                </tbody>
                              
                                </table>
                                      
                           </div>
                         </div>
                      </div>       
                           
                    <br></br>
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary" disabled={ this.state.buttonDisabled } onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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