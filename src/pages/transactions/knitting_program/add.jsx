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
import Checkbox from 'antd/lib/checkbox/Checkbox';
import _ from 'lodash';
import { issetNotEmpty } from '../../../helpers/formhelpers';



let interval;


class AddKnittingProgram extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                narration : "",
                order_id : null,
                vou_date : moment(),
                process_id : 11,
                knitting_program_inventory : [
                    {  
                        yarn_id : null,
                        fabric_id : null,
                        bag_per : 0,
                        bag : 0,
                        narration :null ,
                        gsm : 0,
                        dia : 0,
                        program_weight : 0,
                        gg : 0,
                        ll : 0,
                        yarn_weight : 0,
                        vou_id : null,
                       
                        
                      
                    }
               
                ],
              
            },

            yarn_data : [],
            ledger_name : [],
            order_no : [],
            fabric : [],
            process: [],
    
            
            
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


    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var knitting_program_inventory = values.knitting_program_inventory;
        var total_bag = 0;
        var total_yarn_weight = 0;
        var total_program_weight = 0;
       
        knitting_program_inventory.map((item, index) => {
            // console.log(item);
            if(item.selected){
                
                total_bag += Number(item.bag);
                total_program_weight += Number(item.program_weight);
                item.yarn_weight = item.bag_per*item.bag
                total_yarn_weight += Number(item.yarn_weight);
               
                if(index === knitting_program_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            inventory_bag_total : total_bag,
                            inventory_yarn_weight_total : total_yarn_weight,
                            inventory_program_weight_total : total_program_weight,
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            inventory_bag_total : total_bag,
                            inventory_yarn_weight_total : total_yarn_weight,
                            inventory_program_weight_total : total_program_weight,
                        })
                    })
                }
            }
            else{
                
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_bag_total : total_bag,
                        inventory_yarn_weight_total : total_yarn_weight,
                        inventory_program_weight_total : total_program_weight,                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_bag_total : total_bag,
                        inventory_yarn_weight_total : total_yarn_weight,
                        inventory_program_weight_total : total_program_weight,
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

    getKnittingProgram = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/knittingProgram?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            
               
            })

        }
        else{

            this.getNextKnittingProgramVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    
    

    componentDidMount() {
        this.getOrderSB();
        this.getAllLedgerSB();
        this.getFabricsSB();
        this.getProcessSB();
        this.getYarnSB();
        this.setTOTAL();
        this.getKnittingProgram();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }

    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Knitting Program',
            metaDescription: 'Add Knitting Program'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Knitting Program',
                metaDescription: 'Edit Knitting Program'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/knittingProgram?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_knitting_program')
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
  
   


   
    getLedgerForOrderAndProcessID = (order_id) => {
        // console.log(issetNotEmpty(order_id) ,issetNotEmpty(this.state.formData.process_id))
        if(issetNotEmpty(order_id) && issetNotEmpty(this.state.formData.process_id))
        {
            getRequest('garments/getLedgerForOrderAndProcessID?order_id=' + order_id + "&process_id=" + this.state.formData.process_id).then(data => {
                if(data.status === "info")
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            ledger_id : data.data && data.data.length ? data.data[0].ledger_id : null
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


   

  
    getNextKnittingProgramVouNo = () => {
        getRequest('garments/getNextKnittingProgramVouNo').then(data => {
            // console.log(data);
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


    addKnittingProgramInventory = () => {
        var newKnittingProgramInventory = {
            yarn_id : null,
            fabric_id : null,
            bag_per : 0,
            bag : 0,
            narration :null ,
            gsm : 0,
            dia : 0,
            program_weight : 0,
            gg : 0,
            ll : 0,
            yarn_weight : 0,
            vou_id : null,
            
            
            
            
        }

        var oldKnittingProgramInventoryArray = this.state.formData.knitting_program_inventory;

        oldKnittingProgramInventoryArray.push(newKnittingProgramInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                knitting_program_inventory : oldKnittingProgramInventoryArray

            }
        })
    }

   
    removeKnittingProgramInventory = (index) => {
        var oldKnittingProgramInventoryArray = this.state.formData.knitting_program_inventory;

        oldKnittingProgramInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                knitting_program_inventory : oldKnittingProgramInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.knitting_program_inventory;
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

        if(issetNotEmpty(FORMDATA.process_id) && issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno)  && issetNotEmpty(FORMDATA.order_id) )
        {
            var selectedItems = _.filter(FORMDATA.knitting_program_inventory, (item) => {
                // console.log(item)
                return item.selected && item.yarn_id && item.counts && item.bag && item.bag_per && item.yarn_weight &&item.fabric_id &&item.dia &&item.gsm &&item.gg &&item.ll &&item.program_weight  ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_knitting_program') } }>
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
                   <Selectbox modelName="order_id" autoFocus label="Order No" onChange={(order_id) => this.getLedgerForOrderAndProcessID(order_id)} className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>  
                   </div>


                  
                        

                   <div className="row">
                      <Selectbox modelName="process_id" label="Process" disabled className="col-md-4" options={this.state.process} value={this.state.formData.process_id} onChange={this.getLedgerForOrderAndProcessID} ></Selectbox>
                      
                       <Selectbox modelName="ledger_id"  label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>

                     <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>

                   </div>
                  
                    <br/>
                    <div className="row">

                        <div className="col-md-12 table-scroll">
                        <Divider orientation="left" plain> Products</Divider>

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
                                            <th> <b> Yarn</b></th>
                                            <th> <b> Counts</b></th>
                                            <th> <b> Bag Per</b></th>
                                            <th> <b> Bag</b></th>
                                            <th> <b> Yarn Weight</b></th>
                                            <th> <b> Fabric</b></th>
                                            <th> <b> Narration</b></th>
                                            <th> <b> Dia</b></th>
                                            <th> <b> GSM</b></th>
                                            <th> <b> gg</b></th>
                                            <th> <b> ll</b></th>
                                            <th> <b> Program Weight</b></th>
                                            <th width="10px">
                                                <Button type="primary"  onClick={this.addKnittingprogramInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="knitting_program_inventory">
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
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'yarn_id' ]}  modelName={[field.name, 'yarn_id']} value={[field.name, 'yarn_id']} options={this.state.yarn_data} label="Yarn"></Selectbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'counts' ]}  modelName={[field.name, 'counts']} value={[field.name, 'counts']}  label="Counts"></Numberbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'bag_per' ]}  modelName={[field.name, 'bag_per']} value={[field.name, 'bag_per']} onChange={(ev) => this.setTOTAL(ev,field.fieldKey)} label="Bag Per"></Numberbox>
                                                                </td>
                                                               
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'bag' ]}  modelName={[field.name, 'bag']} value={[field.name, 'bag']} label="Bag"  onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'yarn_weight' ]} disabled modelName={[field.name, 'yarn_weight']} value={[field.name, 'yarn_weight']} label="Yarn Weight"  onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                               
                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]}  modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} options={this.state.fabric} label="Fabric"></Selectbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Textbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'narration' ]}  modelName={[field.name, 'narration']} value={[field.name, 'narration']}  label="Narration"></Textbox>
                                                                </td>

                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]}  modelName={[field.name, 'dia']} value={[field.name, 'dia']}  label="Dia"></Numberbox>
                                                                </td>
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]}  modelName={[field.name, 'gsm']} value={[field.name, 'gsm']}  label="GSM"></Numberbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gg' ]}  modelName={[field.name, 'gg']} value={[field.name, 'gg']}  label="gg"></Numberbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'll' ]}  modelName={[field.name, 'll']} value={[field.name, 'll']}  label="ll"></Numberbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'program_weight' ]}  modelName={[field.name, 'program_weight']} value={[field.name, 'program_weight']} label="Program Weight"  onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox>
 
                                                                </td>
                                                                
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeKnittingProgramInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
                                                    <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={4}> <h6> Total</h6></td>

                                            <td > <h6> { this.state.formData.inventory_bag_total }</h6></td>
                                            <td > <h6> { this.state.formData.inventory_yarn_weight_total }</h6></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td > <h6> { this.state.formData.inventory_program_weight_total }</h6></td>

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
                               <Button type="primary" disabled={ this.checkButtonDisabled() } onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddKnittingProgram));




