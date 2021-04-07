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


let interval;


class AddGarmentsReceiptNote extends PureComponent{
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
                garments_receipt_note_inventory : [
                    {  
                        color_id : null,
                        vou_id : null,
                        color : null,
                        size1_qty : 0,
                        size2_qty : 0,
                        size3_qty :0 ,
                        size4_qty : 0,
                        size5_qty : 0,
                        size6_qty : 0,
                        size7_qty : 0,
                        size8_qty : 0,
                        size9_qty : 0,
                        qty : 0,
                        unit: null
                      
                    }
               
                ],
               
            },
            
            user_data : [],
            unit_data : [],
            ledger_name : [],
            product_data: [],
            color_data: [],
            order_no : [],
           
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      getAllLedgerSB = () => {
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

    getProductSB = () => {

        getRequest('transactions/getProductSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product_data : data.data
                })
            }
        })
    }

    getColorSB = () => {
        
        getRequest('masters/getAllColorSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    color_data : data.data
                })
            }
        })
    }


    getUnitSB = () => {
        getRequest('masters/getUnitSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    unit_data : data.data
                })
            }
        })
    }

    getUnitForProductId = (product_id, index) => {
        getRequest('masters/getUnitForProductID?product_id=' + product_id).then(data => {
            if(data.status === "info")
            {
                var garments_receipt_note_inventory = this.state.formData.garments_receipt_note_inventory;
                var currentItem = garments_receipt_note_inventory[index];
                currentItem.unit_id = data.data;
                currentItem.product_id = product_id;
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        garments_receipt_note_inventory : garments_receipt_note_inventory
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        garments_receipt_note_inventory: this.state.formData.garments_receipt_note_inventory
                    })
                })
            }
        })
    }



    getMarketingUserSB = () => {

        getRequest('transactions/getMarketingUserSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    user_data : data.data
                })
            }
        })
    }



    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var garments_receipt_note_inventory = values.garments_receipt_note_inventory;
        var total_size1 = 0;
        var total_size2 = 0;
        var total_size3 = 0;
        var total_size4 = 0;
        var total_size5 = 0;
        var total_size6 = 0;
        var total_size7 = 0;
        var total_size8 = 0;
        var total_size9 = 0;
        var total_qty = 0;
        
        garments_receipt_note_inventory.map((item, index) => {
            // console.log(item);
        
                total_size1 += Number(item.size1_qty);
                total_size2 += Number(item.size2_qty);
                total_size3 += Number(item.size3_qty);
                total_size4 += Number(item.size4_qty);
                total_size5 += Number(item.size5_qty);
                total_size6 += Number(item.size6_qty);
                total_size7 += Number(item.size7_qty);
                total_size8 += Number(item.size8_qty);
                total_size9 += Number(item.size9_qty);
                total_qty += Number(item.size1_qty)+Number(item.size2_qty)+Number(item.size3_qty)+Number(item.size4_qty)+Number(item.size5_qty)+Number(item.size6_qty)+Number(item.size7_qty)+Number(item.size8_qty)+Number(item.size9_qty);
                item.qty = Number(item.size1_qty)+Number(item.size2_qty)+Number(item.size3_qty)+Number(item.size4_qty)+Number(item.size5_qty)+Number(item.size6_qty)+Number(item.size7_qty)+Number(item.size8_qty)+Number(item.size9_qty);
                
                if(index === garments_receipt_note_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            size1_qty_total : Number(total_size1),
                            size2_qty_total : Number(total_size2),
                            size3_qty_total : Number(total_size3),
                            size4_qty_total : Number(total_size4),
                            size5_qty_total : Number(total_size5),
                            size6_qty_total : Number(total_size6),
                            size7_qty_total : Number(total_size7),
                            size8_qty_total : Number(total_size8),
                            size9_qty_total : Number(total_size9),
                            inventory_qty_total : Number(total_qty),
                            
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            size1_qty_total : Number(total_size1),
                            size2_qty_total : Number(total_size2),
                            size3_qty_total : Number(total_size3),
                            size4_qty_total : Number(total_size4),
                            size5_qty_total : Number(total_size5),
                            size6_qty_total : Number(total_size6),
                            size7_qty_total : Number(total_size7),
                            size8_qty_total : Number(total_size8),
                            size9_qty_total : Number(total_size9),
                            inventory_qty_total : Number(total_qty),
                            
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

    

    getGarmentsReceiptNote = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/garmentsReceiptNote?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.getMobileForLedgerID(data.data.ledger_id)
                data.data.garments_receipt_note_inventory.map((item,index) => {
                    this.getUnitForProductId(item.product_id, index)
                })
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextGarmentsReceiptNoteVouNo = () => {
        getRequest('transactions/getNextGarmentsReceiptNoteVouNo').then(data => {
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
    
    getMobileForLedgerID = (ledger_id) => {
        getRequest('masters/getMobileForLedgerID?ledger_id=' + ledger_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        mobile : data.data
                    },
                },() => {
                    this.formRef.current.setFieldsValue({
                        mobile : this.state.formData.mobile
                    })
                })
            }
        })
    }

    

    componentDidMount() {
        this.getOrderSB();
        this.getAllLedgerSB();
        this.getMarketingUserSB();
        this.getProductSB();
        this.getColorSB();
        this.getUnitSB();
        this.getNextGarmentsReceiptNoteVouNo();
        this.setTOTAL();
        this.getGarmentsReceiptNote();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Garments Receipt Note',
            metaDescription: 'Add Garments Receipt Note'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Garments Receipt Note',
                metaDescription: 'Edit Garments Receipt Note'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('transactions/garmentsReceiptNote?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_garments_receipt_note')
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

   
    

    
   

   
    addGarmentsReceiptNoteInventory = () => {
        var newGarmentsReceiptNoteInventory = {
            color_id : null,
                        vou_id : null,
                        color : null,
                        size1_qty : 0,
                        size2_qty : 0,
                        size3_qty :0 ,
                        size4_qty : 0,
                        size5_qty : 0,
                        size6_qty : 0,
                        size7_qty : 0,
                        size8_qty : 0,
                        size9_qty : 0,
                        qty : 0,
                        unit: null
                      
            
            
        }

        var oldGarmentsReceiptNoteInventoryArray = this.state.formData.garments_receipt_note_inventory;

        oldGarmentsReceiptNoteInventoryArray.push(newGarmentsReceiptNoteInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                garments_receipt_note_inventory : oldGarmentsReceiptNoteInventoryArray

            }
        })
    }

   
    removeGarmentsReceiptNoteInventory = (index) => {
        var oldGarmentsReceiptNoteInventoryArray = this.state.formData.garments_receipt_note_inventory;

        oldGarmentsReeceiptNoteInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                garments_receipt_note_inventory : oldGarmentsReceiptNoteInventoryArray
            }
        })
        this.setTOTAL();
    }

    // checkAllItems = (ev) => {
    //     var checked = ev.target.checked;
    //     var formData = this.state.formData;
    //     var inventories = formData.garments_delivery_note_inventory;
    //     console.log(checked);
    //     inventories.map((item, index) => {
    //         item.selected = checked;
    //         if(index === inventories.length - 1)
    //         {
    //             console.log(formData);
    //             this.setState({
    //                 ...this.state,
    //                 formData : formData
    //             }, () => {
    //                 this.formRef.current.setFieldsValue(formData);
    //                 this.setTOTAL()
    //             })
    //         }
    //     })

    // }

   
  

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_garments_receipt_note') } }>
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
                     <Selectbox modelName="order_id" label="Order No"  className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>

                       <Selectbox modelName="ledger_id"  label="Ledger Name" className="col-md-6" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getMobileForLedgerID}></Selectbox>
                   </div>

                   <div className="row">
                      <Textbox label="Mobile" disabled modelName="mobile" required="false"  className="col-md-6"></Textbox>

                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-6"></Datebox>
                   </div>
                   <div className="row">
                   <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-6"></Textbox>
                   <Selectbox modelName="marketing_user_id"  label="Marketed By" className="col-md-6" options={this.state.user_data} value={this.state.formData.marketing_user_id} ></Selectbox>
                   </div>


                   
                    
                   <div className="row">
                     <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>
                       
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
                                            {/* <th width="30px"> <Checkbox onChange={this.checkAllItems} /></th> */}
                                        
                                            <th width="80px"> <b> Product</b></th>
                                            <th width="80px"> <b>Color</b></th>
                                            <th width="80px"> <b>Unit</b></th>
                                            <th width="80px"> <b> Description</b></th>
                                            <th width="40px"> <b> Size1</b></th>
                                            <th width="40px"> <b> Size2</b></th>
                                            <th width="40px"> <b> Size3</b></th>
                                            <th width="40px"> <b> Size4</b></th>
                                            <th width="40px"> <b> Size5</b></th>
                                            <th width="40px"> <b> Size6</b></th>
                                            <th width="40px"> <b> Size7</b></th>
                                            <th width="40px"> <b> Size8</b></th>
                                            <th width="40px"> <b> Size9</b></th>
                                        
                                            <th width="40px"> <b> Qty</b></th>
                                            
                                            <th width="30px">
                                                <Button type="primary"  onClick={this.addGarmentsDeliveryNoteInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="garments_receipt_note_inventory">
                                                        { (fields, { add, remove } )=> (
                                                            fields.map((field, index) => (
                                                                <tr key={index}>
                                                                {/* <Fragment> */}
                                                                
                                                                {/* <td  style={{ textAlign : 'center' }}>
                                                                    <Form.Item
                                                                    valuePropName="checked"
                                                                    name={[field.name, "selected"]}
                                                                    fieldKey={[field.fieldKey, "selected"]}
                                                                    // initialValue={false}
                                                                    >
                                                                        <Checkbox onChange={this.setTOTAL}></Checkbox>
                                                                    </Form.Item> */}


                                                                    {/* <Checkbox field={field} fieldKey={[ field.fieldKey, 'selected' ]} modelName={[field.name, 'selected']} checked={[field.name, 'selected']} value={[field.name, 'selected']} /> */}
                                                                {/* </td> */}
                                                                
                                                                <td>
                                                                <Selectbox  className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} field={field} fieldKey={[ field.fieldKey, 'product_id' ]} modelName={[field.name, 'product_id']}  label="Product" value={[field.name, 'product_id']} options={this.state.product_data}  onChange={(product_id) => this.getUnitForProductId(product_id,index)}  ></Selectbox>
                                                                </td>

                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]}  modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox>
                                                                </td>

                                                                <td>
                                                                <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'unit_id' ]} disabled modelName={[field.name, 'unit_id']}  label="Unit" value={[field.name, 'unit_id']} options={this.state.unit_data} noPlaceholder withoutMargin ></Selectbox>
                                                   
                                                                </td>

                                                                <td><Textbox className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} field={field} fieldKey={[ field.fieldKey, 'description' ]} modelName={[field.name, 'description']}  label="Description"></Textbox></td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size1_qty' ]}  modelName={[field.name, 'size1_qty']} value={[field.name, 'size1_qty']} label="Size1 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size2_qty' ]}  modelName={[field.name, 'size2_qty']} value={[field.name, 'size2_qty']} label="Size2 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size3_qty' ]}  modelName={[field.name, 'size3_qty']} value={[field.name, 'size3_qty']} label="Size3 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                                
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size4_qty' ]}  modelName={[field.name, 'size4_qty']} value={[field.name, 'size4_qty']} label="Size4 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                                
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size5_qty' ]}  modelName={[field.name, 'size5_qty']} value={[field.name, 'size5_qty']} label="Size5 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size6_qty' ]}  modelName={[field.name, 'size6_qty']} value={[field.name, 'size6_qty']} label="Size6 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size7_qty' ]}  modelName={[field.name, 'size7_qty']} value={[field.name, 'size7_qty']} label="Size7 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                                
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size8_qty' ]}  modelName={[field.name, 'size8_qty']} value={[field.name, 'size8_qty']} label="Size8 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size9_qty' ]}  modelName={[field.name, 'size9_qty']} value={[field.name, 'size9_qty']} label="Size9 Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>

                                                                </td>
                                                               
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']} label="Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
 
                                                                </td>   

                                                               
                                                                
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeGarmentsDeliveryNoteInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
                                                    <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={4}> <h6> Total</h6></td>
                                            <td > <h6> { this.state.formData.size1_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size2_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size3_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size4_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size5_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size6_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size7_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size8_qty_total }</h6></td>
                                            <td > <h6> { this.state.formData.size9_qty_total }</h6></td>
                                            
                                            <td > <h6> { this.state.formData.inventory_qty_total }</h6></td>
                                            

                                           

                                            
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
                               <Button type="primary" disabled={ this.state.buttonDisabled }  htmlType="button" onClick={this.onFinish} loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddGarmentsReceiptNote));