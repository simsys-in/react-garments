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


class AddJobworkOutward extends PureComponent{
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
                jobwork_outward_inventory : [
                    {  
                        color_id : null,
                        size1 : 0,
                        size2 : 0,
                        size3 :0 ,
                        size4 : 0,
                        size5 : 0,
                        size6 : 0,
                        size7 : 0,
                        size8 : 0,
                        size9 : 0,
                        order_id : null,
                        qty : 0,
                        
                        
                      
                    }
               
                ],
                jobwork_outward_product : [
                    {
                        product_id : '',
                        qty : '',
                        unit_id : ''
                    }
                ]
            },
            size_data_for_order : [],
            unit_data : [],
            ledger_name : [],
            product_data: [],
            process : [],
            order_no : [],
            fabric : [],
            color_data : [],
            style_data : [],
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

    getStyleSB = () => {
        getRequest('garments/getStyleSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    style_data : data.data
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

    getCuttingProgramColorDetails = (order_id) => {
        if(!this.id)
        {
                getRequest('garments/getCuttingProgramColorDetails?order_id=' +order_id).then(data => {
                    if(data.status === "info")
                    {
                        var newArr = data.data;
                        this.state.formData.jobwork_outward_inventory.map((item) => {
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
                                jobwork_outward_inventory : newArr
                            },
                        },()=>{
                            this.formRef.current.setFieldsValue({
                                jobwork_outward_inventory : this.state.formData.jobwork_outward_inventory
                            })
                            this.setTOTAL()
                        })
                    }
                })
            }
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

    getProductSB = () => {

        getRequest('garments/getAllProductAccessoriesSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product_data : data.data
                })
            }
        })
    }


    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var jobwork_outward_inventory = values.jobwork_outward_inventory;
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
        jobwork_outward_inventory.map((item, index) => {
            // console.log(item);
            if(item.selected){
                total_size1 += Number(item.size1);
                total_size2 += Number(item.size2);
                total_size3 += Number(item.size3);
                total_size4 += Number(item.size4);
                total_size5 += Number(item.size5);
                total_size6 += Number(item.size6);
                total_size7 += Number(item.size7);
                total_size8 += Number(item.size8);
                total_size9 += Number(item.size9);
                total_qty += Number(item.size1)+Number(item.size2)+Number(item.size3)+Number(item.size4)+Number(item.size5)+Number(item.size6)+Number(item.size7)+Number(item.size8)+Number(item.size9);
                item.qty = Number(item.size1)+Number(item.size2)+Number(item.size3)+Number(item.size4)+Number(item.size5)+Number(item.size6)+Number(item.size7)+Number(item.size8)+Number(item.size9);
                if(index === jobwork_outward_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            size1_total : total_size1,
                            size2_total : total_size2,
                            size3_total : total_size3,
                            size4_total : total_size4,
                            size5_total : total_size5,
                            size6_total : total_size6,
                            size7_total : total_size7,
                            size8_total : total_size8,
                            size9_total : total_size9,
                            inventory_qty_total : total_qty,
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            size1_total : total_size1,
                            size2_total : total_size2,
                            size3_total : total_size3,
                            size4_total : total_size4,
                            size5_total : total_size5,
                            size6_total : total_size6,
                            size7_total : total_size7,
                            size8_total : total_size8,
                            size9_total : total_size9,
                            inventory_qty_total : total_qty,
                        })
                    })
                }
            }
            else{
                
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size1_total : total_size1,
                        size2_total : total_size2,
                        size3_total : total_size3,
                        size4_total : total_size4,
                        size5_total : total_size5,
                        size6_total : total_size6,
                        size7_total : total_size7,
                        size8_total : total_size8,
                        size9_total : total_size9,
                        inventory_qty_total : total_qty,
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size1_total : total_size1,
                        size2_total : total_size2,
                        size3_total : total_size3,
                        size4_total : total_size4,
                        size5_total : total_size5,
                        size6_total : total_size6,
                        size7_total : total_size7,
                        size8_total : total_size8,
                        size9_total : total_size9,
                        inventory_qty_total : total_qty,
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

    getJobworkOutward = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("garments/jobworkOutward?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.onOrderIDChange(data.data.order_id)
                this.getMobileForLedgerId(data.data.ledger_id)
                data.data.jobwork_outward_product.map((item,index) => {
                    this.getUnitForProductId(item.product_id, index)
                })
            })

        }
        else{

            this.getNextJobworkOutwardVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
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

    

    componentDidMount() {
        this.getOrderSB();
        this.getAllLedgerSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getStyleSB();
        this.getUnitSB();
        this.getProductSB();
        this.getColorSB();
        this.setTOTAL();
        this.getJobworkOutward();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Job Work Outward',
            metaDescription: 'Add Job Work Outward'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Job Work Outward',
                metaDescription: 'Edit Job Work Outward'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/jobworkOutward?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_jobwork_outward')
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

    checkProcesses = (process) => {
        var values = this.formRef.current.getFieldValue();

        if(values.from_process_id === values.to_process_id)
        {
            message.error("From process and To Process cannot be same!")
            this.setState({
                ...this.state,
                formData : {
                    ...this.state.formData,
                    to_process_id : null
                }
            }, () => {
                this.formRef.current.setFieldsValue({
                    to_process_id : null
                })
            })
        }
    }

    

    onOrderIDChange = (order_id) => {
        this.getProcessSBForOrderID(order_id);
        this.getSizesForOrderID(order_id);
        this.getCuttingProgramColorDetails(order_id);
        this.getStyleForOrderID(order_id);
        this.getLedgerForOrderAndProcessID(this.state.formData.process_id)
    }
    
    getStyleForOrderID = (order_id) => {
        getRequest('garments/getStyleForOrderId?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        style_id : Number(data.data)
                    }
                }, () => {
                    this.formRef.current.setFieldsValue(this.state.formData);
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

    getLedgerForOrderAndProcessID = (process_id) => {
        console.log(issetNotEmpty(this.state.formData.order_id) && issetNotEmpty(process_id), this.state.formData.order_id ,process_id)
        if(issetNotEmpty(this.state.formData.order_id) && issetNotEmpty(process_id))
        {
            getRequest('garments/getLedgerForOrderAndProcessID?order_id=' + this.state.formData.order_id + "&process_id=" + process_id).then(data => {
                if(data.status === "info")
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            ledger_id : data.data[0].ledger_id
                                            },
                    },() => {
                        this.formRef.current.setFieldsValue({
                            ledger_id : this.state.formData.ledger_id
                        })
                    })
                }
            })
        }
    }


    getUnitForProductId = (product_id, index) => {
        getRequest('garments/getUnitForProductID?product_id=' + product_id).then(data => {
            if(data.status === "info")
            {
                var jobwork_outward_product = this.state.formData.jobwork_outward_product;
                var currentItem = jobwork_outward_product[index];
                currentItem.unit_id = data.data;
                currentItem.product_id = product_id;
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        jobwork_outward_product : jobwork_outward_product
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        jobwork_outward_product : this.state.formData.jobwork_outward_product
                    })
                })
            }
        })
    }

    getNextJobworkOutwardVouNo = () => {
        getRequest('garments/getNextJobworkOutwardVouNo').then(data => {
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


    addJobworkOutwardInventory = () => {
        var newJobworkOutwardInventory = {
            color_id : null,
            size1 : 0,
            size2 : 0,
            size3 :0 ,
            size4 : 0,
            size5 : 0,
            size6 : 0,
            size7 : 0,
            size8 : 0,
            size9 : 0,
            order_id : null,
            qty : 0,
            
            
            
        }

        var oldJobworkOutwardInventoryArray = this.state.formData.jobwork_outward_inventory;

        oldJobworkOutwardInventoryArray.push(newJobworkOutwardInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_outward_inventory : oldJobworkOutwardInventoryArray

            }
        })
    }

   
    removeJobworkOutwardInventory = (index) => {
        var oldJobworkOutwardInventoryArray = this.state.formData.jobwork_outward_inventory;

        oldJobworkOutwardInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_outward_inventory : oldJobworkOutwardInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.jobwork_outward_inventory;
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
                    this.setTOTAL()
                })
            }
        })

    }

    getSizesForOrderID = (order_id) => {
        getRequest('garments/getSizesForOrderID?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                var items = _.remove(data.data, (currentObject) => {
                    return currentObject !== "";
                });
                
                this.setState({
                    ...this.state,
                    size_data_for_order : items
                })
            }
        })
    }

    addJobworkOutwardProduct = () => {
        var newJobworkOutwardProduct = {
           product_id : '',
           qty : '',
           unit_id : ''
            
        }

        var oldJobworkOutwardProductArray = this.state.formData.jobwork_outward_product;

        oldJobworkOutwardProductArray.push(newJobworkOutwardProduct);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_outward_product : oldJobworkOutwardProductArray

            }
        })
    }

   
    removeJobworkOutwardProduct = (index) => {
        var oldJobworkOutwardProductArray = this.state.formData.jobwork_outward_product;

        oldJobworkOutwardProductArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_outward_product : oldJobworkOutwardProductArray
            }
        })
        this.setTOTAL();
    }


    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_jobwork_outward') } }>
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

                    <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                    <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox>
                   <Selectbox modelName="order_id" autoFocus label="Order No" onChange={this.onOrderIDChange} className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>  
                   </div>


                   <div className="row">
                       <Selectbox modelName="from_process_id" label="From Process" className="col-md-4" options={this.state.process} value={this.state.formData.from_process_id}  ></Selectbox>

                       <Selectbox modelName="to_process_id" label="To Process" className="col-md-4" options={this.state.process} value={this.state.formData.to_process_id} onChange={this.getLedgerForOrderAndProcessID} ></Selectbox>
                       
                    <Selectbox disabled modelName="style_id" label="Style" required="false" className="col-md-4" options={this.state.style_data} value={this.state.formData.style_id}  ></Selectbox>
                   </div>
                        

                   <div className="row">
                       <Selectbox modelName="ledger_id"  label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getMobileForLedgerId}></Selectbox>
                    <Textbox modelName="mobile" disabled label="Mobile" className="col-md-4" required="false"></Textbox>

                     <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>

                   </div>
                   <div className="row">
                     
                   <Textbox label="Vehicle No" required="false" modelName="vehicle_no"  className="col-md-4"></Textbox>
                       
                   </div>
                    <br/>
                    <div className="row">

                        <div className="col-md-12 table-scroll">
                        <Divider orientation="left" plain> Inventory</Divider>

                            <table id="dynamic-table" className="table table-bordered table-scroll">
                                    {/* <thead>
                                        <tr>
                                            <th colSpan="1" className="primary-header" style={{ backgroundColor : 'lightblue' }} > <b> COLOR</b></th>
                                            <th colSpan={this.state.size_data_for_order.length} className="primary-header" style={{ backgroundColor : 'grey' }} > <b> </b></th>
                                        </tr>
                                    </thead> */}
                                    <thead>
                                        <tr>
                                            <th > <Checkbox onChange={this.checkAllItems} /></th>
                                            <th> <b> Color</b></th>
                                           
                                            { this.state.size_data_for_order.map((item, index) => 
                                                item !== "" && <th key={index} width="100px"> <b> {item}</b></th>
                                            ) }

                                            <th> <b> Qty</b></th>
                                            <th width="10px">
                                                <Button type="primary"  onClick={this.addJobworkOutwardInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="jobwork_outward_inventory">
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
                                                                
                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} disabled modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox>
                                                                </td>
                                                                
                                                                {
                                                                    this.state.size_data_for_order.map((item, ind) => 
                                                                    item !== "" && <td key={ind}>
                                                                        <Numberbox className="col-md-12" required="false" showLabel={false} label={item} min={0}  field={field} fieldKey={[ field.fieldKey, 'size' + Number(Number(index) + 1) ]} modelName={[field.name, 'size' + Number(Number(ind) + 1)]} value={[field.name, 'size' + Number(Number(ind) + 1)]} noPlaceholder max={[field.name, 'size' + Number(Number(index) + 1) ]} withoutMargin onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                                    </td>
                                                                    )
                                                                }
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']} label="Qty" disabled onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                                
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobworkOutwardInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
                                                    <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={2}> <h6> Total</h6></td>


                                            { this.state.size_data_for_order.map((item, index) => 
                                                item !== "" && <td key={index}> <h6> {this.state.formData["size" + Number(Number(index) +1) + "_total"]}</h6></td>
                                            ) }

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
                        <div className="col-md-6">
                                <Divider plain orientation="left">Accessories</Divider>
                                <table id="dynamic-table" className="table table-bordered" width="100%">
                                <thead >
                                    <tr>
                                        <th>Accessories</th>
                                        <th width="170px">Qty</th>
                                        <th>Unit</th>
                                        
                                        <th width="10px"><Button type="primary"  onClick={this.addJobworkOutwardProduct} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="jobwork_outward_product">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <tr>
                                                <td> <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'product_id' ]} modelName={[field.name, 'product_id']}  label="Accessories" value={[field.name, 'product_id']} options={this.state.product_data} onChange={(product_id) => this.getUnitForProductId(product_id, index)} onBlur={(product_id) => this.getUnitForProductId(product_id, index)} noPlaceholder withoutMargin  ></Selectbox></td>

                                                <td> <Numberbox className="col-md-12" required="false" showLabel={false} label="Qty" min={0} field={field} fieldKey={[ field.fieldKey, 'qty' ]} modelName={[field.name, 'qty']} value={[field.name, 'qty']} noPlaceholder withoutMargin ></Numberbox></td>

                                                <td><Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'unit_id' ]} disabled modelName={[field.name, 'unit_id']}  label="Unit" value={[field.name, 'unit_id']} options={this.state.unit_data} noPlaceholder withoutMargin ></Selectbox></td>

                                                <td>  { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobworkOutwardProduct(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}</td>

                                            </tr>
                                             )
                                            
                                             )
                                         ) }
                                     </Form.List>
                                    
                                </tbody>
                                </table>
                                </div>
                         </div>
                         <br/>

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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddJobworkOutward));




