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

    getStyleSB = () => {
        getRequest('transactions/getStyleSB').then(data => {
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

    getProcessSB = (order_id = null) => {
        
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

    getCuttingProgramColorDetails = (order_id) => {
        getRequest('transactions/getCuttingProgramColorDetails?order_id=' +order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        jobwork_outward_inventory : data.data
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        jobwork_outward_inventory : this.state.formData.jobwork_outward_inventory
                    })
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
            getRequest("transactions/jobworkOutward?id=" + this.id).then(data => {
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
            putRequest('transactions/jobworkOutward?id=' + this.id, values).then(data => {
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
    }


    getMobileForLedgerId = (ledger_id) => {
        getRequest('masters/getMobileForLedgerID?ledger_id=' + ledger_id).then(data => {
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

    getUnitForProductId = (product_id, index) => {
        getRequest('masters/getUnitForProductID?product_id=' + product_id).then(data => {
            if(data.status === "info")
            {
                var jobwork_outward_product = this.state.formData.jobwork_outward_product;
                var currentItem = jobwork_outward_product[index];
                currentItem.unit_id = data.data;
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

    getSizesForOrderID = (order_id) => {
        getRequest('transactions/getSizesForOrderID?order_id=' + order_id).then(data => {
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_fabric_outward') } }>
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
                        <Selectbox modelName="order_id" autoFocus label="Order No" onChange={this.onOrderIDChange} className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>  
                        <Selectbox modelName="style_id" label="Style" className="col-md-6" options={this.state.style_data} value={this.state.formData.style_id}  ></Selectbox>
                   </div>
                   <div className="row">
                       <Selectbox modelName="from_process_id" label="From Process" className="col-md-6" options={this.state.process} value={this.state.formData.from_process_id}  ></Selectbox>
                       <Selectbox modelName="to_process_id" label="To Process" className="col-md-6" options={this.state.process} value={this.state.formData.to_process_id}  ></Selectbox>
                   </div>
                   <div className="row">
                       <Selectbox modelName="ledger_id"  label="Ledger Name" className="col-md-6" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getMobileForLedgerId}></Selectbox>
                       <Textbox modelName="mobile" label="Mobile" className="col-md-6" required="false"></Textbox>
                   </div>
                    
                   <div className="row">
                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-6"></Datebox>
                     <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>
                       
                   </div>

                   

                   {/* <div className="row">
                            <div className="col-md-12">
                            <Divider plain orientation="left" >Inventory</Divider>
                            <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row">
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Color" label="Color" required="false"></Textbox>

                                            { this.state.size_data_for_order.map((item) => 
                                                item !== "" && <Textbox width="40px"> <b> {item}</b></Textbox>
                                            ) } */}
                                            {/* <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size1" label="Size1" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size2" label="Size2" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size3" label="Size3" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size4" label="Size4" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size5" label="Size5" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size6" label="Size6" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size7" label="Size7" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size8" label="Size8" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size9" label="Size9" required="false"></Textbox> */}
                                            {/* <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty" label="Qty" required="false"></Textbox>
                                        </div>
                                         
                                    </div>
                                    <div className="col-md-1">
                                          <Button type="primary" onClick={this.addJobworkOutwardInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                   </div>
                                </div>
                             <Form.List name="jobwork_outward_inventory">
                                   { (fields, { add, remove } )=> (
                                       fields.map((field, index) => (
                                               <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                   <div className="col-md-11">
                                                       <div className="row">
                                                          
                                                           <Selectbox noPlaceholder required="false" withoutMargin className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox> */}
                                                          
                                                           {/* <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size1' ]}  modelName={[field.name, 'size1']} value={[field.name, 'size1']} label="Size1" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size2' ]}  modelName={[field.name, 'size2']} value={[field.name, 'size2']} label="Size2" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size3' ]}  modelName={[field.name, 'size3']} value={[field.name, 'size3']} label="Size3" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size4' ]}  modelName={[field.name, 'size4']} value={[field.name, 'size4']} label="Size4" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size5' ]}  modelName={[field.name, 'size5']} value={[field.name, 'size5']} label="Size5" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size6' ]}  modelName={[field.name, 'size6']} value={[field.name, 'size6']} label="Size6" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size7' ]}  modelName={[field.name, 'size7']} value={[field.name, 'size7']} label="Size7" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size8' ]}  modelName={[field.name, 'size8']} value={[field.name, 'size8']} label="Size8" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'size9' ]}  modelName={[field.name, 'size9']} value={[field.name, 'size9']} label="Size9" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox> */}
                                                           {/* <Numberbox noPlaceholder required="false" withoutMargin className="col-md-1"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']} label="Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                       </div>

                                                   </div>
                                                   <div className="col-md-1">
                                                       
                                                       { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobworkOutwardInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                   </div>
                                                   
                                                </div>
                                    )
                                           
                                    )
                                ) }
                               </Form.List>        
                          </div>
                          </div> */}

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
                                            <th width="150px"> <b> Color</b></th>
                                           
                                            { this.state.size_data_for_order.map((item) => 
                                                item !== "" && <th width="100px"> <b> {item}</b></th>
                                            ) }

                                            <th width="100px"> <b> Qty</b></th>
                                            <th width="30px">
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
                                                                
                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox>
                                                                </td>
                                                                
                                                                {
                                                                    this.state.size_data_for_order.map((item, index) => 
                                                                    item !== "" && <td>
                                                                        <Numberbox className="col-md-12" required="false" showLabel={false} label={item} min={0}  field={field} fieldKey={[ field.fieldKey, 'size' + Number(Number(index) + 1) ]} modelName={[field.name, 'size' + Number(Number(index) + 1)]} value={[field.name, 'size' + Number(Number(index) + 1)]} noPlaceholder withoutMargin onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                                    </td>
                                                                    )
                                                                }
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qty' ]}  modelName={[field.name, 'qty']} value={[field.name, 'qty']} label="Qty" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
 
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
                                            <td> <h6> Total</h6></td>


                                            { this.state.size_data_for_order.map((item, index) => 
                                                item !== "" && <td > <h6> {this.state.formData["size" + Number(Number(index) +1) + "_total"]}</h6></td>
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
                    {/* <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                        <div className="col-md-11">
                            <div className="row">
                                
                                    <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Total" label="Total" required="false"></Textbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size1_total' value={this.state.formData.total_size1} disabled label='Total Size1'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size2_total' value={this.state.formData.total_size2} disabled label='Total Size2'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size3_total' value={this.state.formData.total_size3} disabled label='Total Size3'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size4_total' value={this.state.formData.total_size4} disabled label='Total Size4'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size5_total' value={this.state.formData.total_size5} disabled label='Total Size5'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size6_total' value={this.state.formData.total_size6} disabled label='Total Size6'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size7_total' value={this.state.formData.total_size7} disabled label='Total Size7'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size8_total' value={this.state.formData.total_size8} disabled label='Total Size8'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='size9_total' value={this.state.formData.total_size9} disabled label='Total Size9'></Numberbox>
                                    <Numberbox withoutMargin showLabel={false} className="col-md-1" withoutMargin modelName='inventory_qty_total' value={this.state.formData.total_qty} disabled label='Total Qty'></Numberbox>
                                   
                                </div>

                            </div>
                            
                            
                        </div> 
                          

                    </div> */}
                       
                        <div className="row">
                             <div className="col-md-12">
                                <Divider plain orientation="left">Accessories</Divider>
                                <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row flex-nowrap">
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Product" label="Product" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty" label="Qty" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Unit" label="Unit" required="false"></Textbox>
                                            
                                            
                                        <div className="col-md-1">
                                          <Button type="primary"  onClick={this.addJobworkOutwardProduct} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                         </div>
                                        </div>
                                    </div>
                                   
                                </div>
                                
                                <Form.List name="jobwork_outward_product">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row flex-nowrap" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                   <div className='col-md-11'>
                                                       <div className="row ">
                                                       <Selectbox className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'product_id' ]} modelName={[field.name, 'product_id']}  label="Product" value={[field.name, 'product_id']} options={this.state.product_data} onChange={(product_id) => this.getUnitForProductId(product_id, index)} noPlaceholder withoutMargin  ></Selectbox>
                                                    <Numberbox className="col-md-2" required="false" showLabel={false} label="Qty" min={0} field={field} fieldKey={[ field.fieldKey, 'qty' ]} modelName={[field.name, 'qty']} value={[field.name, 'qty']} noPlaceholder withoutMargin ></Numberbox>
                                                    <Selectbox className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'unit_id' ]} modelName={[field.name, 'unit_id']}  label="Unit" value={[field.name, 'unit_id']} options={this.state.unit_data} noPlaceholder withoutMargin ></Selectbox>
                                                           
                                                  <div className="col-md-1">
                                                                { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobworkOutwardProduct(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                    </div>
                                                   
                                                  </div>
                                                 </div>
                                                </div>
                                            )
                                            
                                        )
                                    ) }
                                </Form.List>
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