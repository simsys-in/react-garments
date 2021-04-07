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
import _ from 'lodash';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { issetNotEmpty } from '../../../helpers/formhelpers';



let interval;


class AddJobwork_Inward  extends PureComponent{
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
                jobwork_inward_inventory : [
                    {  
                       color : '',
                       size1 : '',
                        size2 : '',
                        size3 :'' ,
                        size4 :'' ,
                        size5 :'' ,
                        size6 :'' ,
                        size7 :'' ,
                        size8 :'' ,
                        size9 :'' ,
                        qty :'' 
                        
                      
                    }
                ]
            },
            size_data_for_order : [],
            companiesList : [],
            ledger_name : [],
            process : [],
            order_no : [],
            fabric : [],
            color : [],
            product : []
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

    // getProcessSB = () => {
    // getProcessSB = (order_id = null) => {
        
    //     getRequest('masters/getProcessSB').then(data => {
    //         if(data.status === "info")
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 process : data.data
    //             })
    //         }
    //     })
    // }


    getFabricsSB = () => {
        
        getRequest('masters/getFabricsSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric : data.data
                })
            }
        })
    }

    getProductSB = (order_id = null) => {
        
        getRequest('masters/getAllProductSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product : data.data
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
    getJobworkOutwardColorDetails = (order_id) => {
        getRequest('transactions/getJobworkOutwardColorDetails?order_id=' +order_id).then(data => {
            if(data.status === "info")
            {
                var newArr = data.data;
                this.state.formData.jobwork_inward_inventory.map((item) => {
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
                        jobwork_inward_inventory : newArr
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        jobwork_inward_inventory : this.state.formData.jobwork_inward_inventory
                    })
                    this.setTOTAL()
                })
            }
        })
    }
    getColorSB = () => {
        
        getRequest('transactions/getAllColorSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    color : data.data
                })
            }
        })
    }

    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
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
        jobwork_inward_inventory.map((item, index) => {
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
                if(index === jobwork_inward_inventory.length - 1)
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

    getJobwork_Inward  = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/jobwork_inward?id=" + this.id).then(data => {
                data.data.dob = moment(data.data.dob)
                console.log(data.data)
                data.data.vou_date = moment(data.data.vou_date)
                this.formRef.current.setFieldsValue(data.data);
                this.formRef.current.setFieldsValue(data.data);
                this.onOrderIDChange(data.data.order_id)
                this.getMobileForLedgerID(data.data.ledger_id)
            })

        }
        else{
            // this.getNextYarnReturnVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    // getNextYarnReturnVouNo = () => {
    //     getRequest('transactions/getNextYarnReturnVouNo').then(data => {
    //         console.log(data);
    //         if(data.status === "info")
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 formData : {
    //                     ...this.state.formData,
    //                     vouno : data.data.max_vou_no
    //                 }
    //             },() => {
    //                 this.formRef.current.setFieldsValue({
    //                     vouno : this.state.formData.vouno
    //                 })
    //             })
    //         }
    //     })
    // }

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

    onOrderIDChange = (order_id) => {
        this.getProcessSBForOrderID(order_id);
        this.getSizesForOrderID(order_id);
        this.getJobworkOutwardColorDetails(order_id);
        
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

    getLedgerForOrderAndProcessID = (order_id,process_id) => {
        if(issetNotEmpty(this.state.formData.order_id) && issetNotEmpty(this.state.formData.process_id))
        {
            getRequest('transactions/getLedgerForOrderAndProcessID?order_id=' + this.state.formData.order_id + "&process_id=" + this.state.formData.process_id).then(data => {
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


    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        // this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.getProductSB();
        
        this.getJobwork_Inward();
        this.setTOTAL();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Jobwork inward ',
            metaDescription: 'Add Jobwork inward '
          });

          if(this.id)
          {
            seo({
                title: 'Edit Jobwork inward ',
                metaDescription: 'Edit Jobwork inward '
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('transactions/jobwork_inward?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_jobwork_inward')
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

    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.jobwork_inward_inventory;
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
    addJobwork_inward_inventory = () => {
        var newJobwork_inward_inventory = {
            color : '',
            size1 : '',
             size2 : '',
             size3 :'' ,
             size4 :'' ,
             size5 :'' ,
             size6 :'' ,
             size7 :'' ,
             size8 :'' ,
             size9 :'' ,
             qty :'' 
        }

        var oldJobwork_inward_inventoryArray = this.state.formData.jobwork_inward_inventory;

        oldJobwork_inward_inventoryArray.push(newJobwork_inward_inventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_inward_inventory : oldJobwork_inward_inventoryArray
            }
        })
    }

    
    removeJobwork_inward_inventory = (index) => {
        var oldJobwork_inward_inventoryArray = this.state.formData.jobwork_inward_inventory;

        oldJobwork_inward_inventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_inward_inventory : oldJobwork_inward_inventoryArray
            }
        })
        this.setTOTAL();
    }

    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_jobwork_inward') } }>
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
                       
                       
                       <Selectbox modelName="order_id" label="Order No" onChange={this.onOrderIDChange} className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        <Selectbox modelName="process_id" label="Process" className="col-md-6" options={this.state.process} value={this.state.formData.process_id} onChange={this.getLedgerForOrderAndProcessID} ></Selectbox>

                    </div>
                    <div className="row">
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-6"></Textbox> */}
                        <Selectbox modelName="ledger_id" label="Ledger Name" onChange={this.getMobileForLedgerID} className="col-md-6" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                        <Textbox label="Mobile" disabled modelName="mobile" required="false"  className="col-md-6"></Textbox>



                    </div>
                    <div className="row">
                        <Datebox label="Vou Date" value={this.state.formData.vou_date}  modelName="vou_date" className="col-md-6"></Datebox>
                   
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>


                    </div>
                    <div className="row">
                   
                        <Selectbox label="Product" modelName="product_id" required="false" className="col-md-6"  options={this.state.product} value={ this.state.formData.product}  ></Selectbox>  

                       <Textbox label="Adas" modelName="adas" required="false"  className="col-md-6"></Textbox>


                    </div>

                    <Divider plain orientation="left" >Products</Divider> 

                         <div className="row">
                             <div className="col-md-12 table-scroll">
                             <table id="dynamic-table" className="table table-bordered">
                           
                                    <thead>
                                        <tr>
                                        <th width="150px"> <Checkbox onChange={this.checkAllItems} /></th>

                                        <th width="150px"> <b> Color</b></th>
                                           
                                           { this.state.size_data_for_order.map((item) => 
                                               item !== "" && <th width="100px"> <b> {item}</b></th>
                                           ) }

                                           <th width="100px"> <b> Qty</b></th>
                                            
                                            <th width="30px">
                                            <Button type="primary" onClick={this.addJobwork_inward_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <Form.List name="jobwork_inward_inventory">
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
                                                <td>
                                                <Selectbox noPlaceholder withoutMargin showLabel={false} required="false" className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={field.color_id} options={this.state.color} label="Color"></Selectbox>
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
                                                { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobwork_inward_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}
                                                    </td> 
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
                                                 </tbody>
                            </table>
                                

                             
                                          
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddJobwork_Inward ));