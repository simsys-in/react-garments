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
import { faPlus, faTimes, faTintSlash } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { issetNotEmpty } from '../../../helpers/formhelpers';



let interval;


class AddGarmentsDeliveryNote extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                marketing_user_id : "",
                narration :"",
                mobile :"",
                vehicle_no : "",
                status : 'active',
                vou_date : moment(),
                size_details : [],
                garments_delivery_note_inventory : [
                    {  
                        color_id : null,
                        vou_id : null,
                        color : null,
                        size_details : [],
                        size1_qty : '',
                        size2_qty : '',
                        size3_qty :'' ,
                        size4_qty : '',
                        size5_qty : '',
                        size6_qty : '',
                        size7_qty : '',
                        size8_qty : '',
                        size9_qty : '',
                        qty : '',
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

    getProductSB = () => {

        getRequest('garments/getProductSB').then(data => {
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

    getUnitForProductId = (product_id, index) => {
        getRequest('garments/getUnitForProductID?product_id=' + product_id).then(data => {
            if(data.status === "info")
            {
                var garments_delivery_note_inventory = this.state.formData.garments_delivery_note_inventory;
                var currentItem = garments_delivery_note_inventory[index];
                currentItem.unit_id = data.data;
                currentItem.product_id = product_id;
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        garments_delivery_note_inventory : garments_delivery_note_inventory
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        garments_delivery_note_inventory: this.state.formData.garments_delivery_note_inventory
                    })
                })
            }
        })
    }



    getMarketingUserSB = () => {

        getRequest('garments/getMarketingUserSB').then(data => {
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
        var garments_delivery_note_inventory = values.garments_delivery_note_inventory;
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
        
        garments_delivery_note_inventory.map((item, index) => {
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
                
                if(index === garments_delivery_note_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            size1_total : Number(total_size1),
                            size2_total : Number(total_size2),
                            size3_total : Number(total_size3),
                            size4_total : Number(total_size4),
                            size5_total : Number(total_size5),
                            size6_total : Number(total_size6),
                            size7_total : Number(total_size7),
                            size8_total : Number(total_size8),
                            size9_total : Number(total_size9),
                            inventory_qty_total : Number(total_qty),
                            
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            size1_total : Number(total_size1),
                            size2_total : Number(total_size2),
                            size3_total : Number(total_size3),
                            size4_total : Number(total_size4),
                            size5_total : Number(total_size5),
                            size6_total : Number(total_size6),
                            size7_total : Number(total_size7),
                            size8_total : Number(total_size8),
                            size9_total : Number(total_size9),
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

    

    getGarmentsDeliveryNote = () => {
        if(this.id)
        {
            getRequest("garments/garmentsDeliveryNote?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                this.setState({
                    ...this.state,
                    formData : data.data
                })
                this.formRef.current.setFieldsValue(data.data);
                this.getMobileForLedgerID(data.data.ledger_id)
                data.data.garments_delivery_note_inventory.map((item,index) => {
                    this.onProductIdChange(item.product_id, index);
                
                })
            })

        }
        else{

            this.getNextGarmentsDeliveryNoteVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextGarmentsDeliveryNoteVouNo = () => {
        getRequest('garments/getNextGarmentsDeliveryNoteVouNo').then(data => {
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

    getSizeForProductId = (product_id,index) => {
        getRequest('garments/getSizeForProductID?product_id=' + product_id).then(data => {
            if(data.status === "info")
            {
                var formData = JSON.parse(JSON.stringify(this.state.formData));
                var  garments_delivery_note_inventory = formData.garments_delivery_note_inventory;
                var currentItem = garments_delivery_note_inventory[index];
                currentItem.product_id = product_id;
                currentItem.size_details = data.data;
                
                this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            garments_delivery_note_inventory : garments_delivery_note_inventory
                        }
                },()=>{
                    this.formRef.current.setFieldsValue(this.state.formData)
                })
            }
        })
    }


    onProductIdChange = (product_id, index) => {
        this.getSizeForProductId(product_id, index);
        this.getUnitForProductId(product_id, index);
    }
    
    getMobileForLedgerID = (ledger_id) => {
        getRequest('garments/getMobileForLedgerID?ledger_id=' + ledger_id).then(data => {
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
        this.setTOTAL();
        this.getGarmentsDeliveryNote();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Garments Delivery Note',
            metaDescription: 'Add Garments Delivery Note'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Garments Delivery Note',
                metaDescription: 'Edit Garments Delivery Note'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/garmentsDeliveryNote?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_garments_delivery_note')
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

   
    

    
   

   
    addGarmentsDeliveryNoteInventory = () => {
        var newGarmentsDeliveryNoteInventory = {
            color_id : null,
                        vou_id : null,
                        color : null,
                        size1_qty : '',
                        size2_qty : '',
                        size_details : [],
                        size3_qty :'' ,
                        size4_qty : '',
                        size5_qty : '',
                        size6_qty : '',
                        size7_qty : '',
                        size8_qty : '',
                        size9_qty : '',
                        qty : '',
                        unit: null
                      
            
            
        }

        var oldGarmentsDeliveryNoteInventoryArray = this.state.formData.garments_delivery_note_inventory;

        oldGarmentsDeliveryNoteInventoryArray.push(newGarmentsDeliveryNoteInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                garments_delivery_note_inventory : oldGarmentsDeliveryNoteInventoryArray

            }
        })
    }

   
    removeGarmentsDeliveryNoteInventory = (index) => {
        var oldGarmentsDeliveryNoteInventoryArray = this.state.formData.garments_delivery_note_inventory;

        oldGarmentsDeliveryNoteInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                garments_delivery_note_inventory : oldGarmentsDeliveryNoteInventoryArray
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

    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno)  && issetNotEmpty(FORMDATA.marketing_user_id)) 
        {
            var selectedItems = _.filter(FORMDATA.garments_delivery_note_inventory, (item) => {
                console.log(item)
                return  item.product_id && item.color_id &&  item.unit_id &&( item.size1_qty ||item.size2_qty ||item.size3_qty ||item.size4_qty ||item.size5_qty ||item.size6_qty || item.size7_qty ||item.size8_qty ||item.size9_qty )  && item.qty  ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_garments_delivery_note') } }>
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

                       <Selectbox modelName="ledger_id"  label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getMobileForLedgerID}></Selectbox>
                      <Textbox label="Mobile" disabled modelName="mobile" required="false"  className="col-md-4"></Textbox>
                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                   </div>

                   <div className="row">
                   <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox>
                     <Selectbox modelName="order_id" label="Order No"  className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                   <Selectbox modelName="marketing_user_id"  label="Marketed By" className="col-md-4" options={this.state.user_data} value={this.state.formData.marketing_user_id} ></Selectbox>

                   </div>
                   <div className="row">
                   <Textbox label="Vehicle No" modelName="vehicle_no" required="false"  className="col-md-4"></Textbox>
                     <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                       
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
                                                <Form.List name="garments_delivery_note_inventory">
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
                                                                <Selectbox  className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} field={field} fieldKey={[ field.fieldKey, 'product_id' ]} modelName={[field.name, 'product_id']}  label="Product" value={[field.name, 'product_id']} options={this.state.product_data}  onChange={(product_id) => this.onProductIdChange(product_id,index)}  ></Selectbox>
                                                                </td>

                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]}  modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox>
                                                                </td>

                                                                <td>
                                                                <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'unit_id' ]} disabled modelName={[field.name, 'unit_id']}  label="Unit" value={[field.name, 'unit_id']} options={this.state.unit_data} noPlaceholder withoutMargin ></Selectbox>
                                                   
                                                                </td>

                                                                <td><Textbox className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} field={field} fieldKey={[ field.fieldKey, 'description' ]} modelName={[field.name, 'description']}  label="Description"></Textbox></td>
                                                                
                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[0]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[0]}  label="Size1 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size1_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[0] === ""} modelName={[field.name, 'size1_qty']} value={[field.name, 'size1_qty']} label="Size1 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[1]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[1]}  label="Size2 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size2_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[1] === ""} modelName={[field.name, 'size2_qty']} value={[field.name, 'size2_qty']} label="Size2 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[2]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[2]}  label="Size3 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size3_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[2] === ""} modelName={[field.name, 'size3_qty']} value={[field.name, 'size3_qty']} label="Size3 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                                
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[3]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[3]}  label="Size4 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size4_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[3] === ""} modelName={[field.name, 'size4_qty']} value={[field.name, 'size4_qty']} label="Size4 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                                
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[4]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[4]}  label="Size5 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size5_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[4] === ""}  modelName={[field.name, 'size5_qty']} value={[field.name, 'size5_qty']} label="Size5 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[5]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[5]}  label="Size6 Name"></Textbox>
  
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size6_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[5] === ""} modelName={[field.name, 'size6_qty']} value={[field.name, 'size6_qty']} label="Size6 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[6]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[6]}  label="Size7 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size7_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[6] === ""} modelName={[field.name, 'size7_qty']} value={[field.name, 'size7_qty']} label="Size7 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                                
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[7]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[7]}  label="Size8 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size8_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[7] === ""} modelName={[field.name, 'size8_qty']} value={[field.name, 'size8_qty']} label="Size8 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                               
                                                                </td>

                                                                <td>
                                                                <Textbox key={this.state.formData.garments_delivery_note_inventory[index].size_details[8]} className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} disabled defaultValue={this.state.formData.garments_delivery_note_inventory[index].size_details[8]}  label="Size9 Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size9_qty' ]}  disabled={this.state.formData.garments_delivery_note_inventory[index].size_details[8] === ""} modelName={[field.name, 'size9_qty']} value={[field.name, 'size9_qty']} label="Size9 Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>

                                                                </td>
                                                               
                                                                
                                                                <td>
                                                                <Textbox className="col-md-12" noPlaceholder required="false" withoutMargin showLabel={false} field={field} disabled fieldKey={[ field.fieldKey, 'qty_name' ]} modelName={[field.name, 'qty_name']}  label=" Name"></Textbox>

                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']} disabled label="Qty" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
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
                                            <td > <h6> { this.state.formData.size1_total }</h6></td>
                                            <td > <h6> { this.state.formData.size2_total }</h6></td>
                                            <td > <h6> { this.state.formData.size3_total }</h6></td>
                                            <td > <h6> { this.state.formData.size4_total }</h6></td>
                                            <td > <h6> { this.state.formData.size5_total }</h6></td>
                                            <td > <h6> { this.state.formData.size6_total }</h6></td>
                                            <td > <h6> { this.state.formData.size7_total }</h6></td>
                                            <td > <h6> { this.state.formData.size8_total }</h6></td>
                                            <td > <h6> { this.state.formData.size9_total }</h6></td>
                                            
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
                               <Button type="primary" disabled={ this.checkButtonDisabled()}  htmlType="button" onClick={this.onFinish} loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddGarmentsDeliveryNote));