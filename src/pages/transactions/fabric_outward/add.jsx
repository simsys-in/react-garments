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
import { issetNotEmpty } from '../../../helpers/formhelpers';
import _ from 'lodash';


let interval;


class AddFabricOutward extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            

            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                vehicle_no : "",
                narration : "",
                
                vou_date : moment(),
                fabric_outward_inventory : [
                    {  
                        fabrics_id : '',
                        color_id : '',
                        gsm : '',
                        dia : '',
                        roll :'' ,
                        weight : ''
                    
                      
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

    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var fabric_outward_inventory = values.fabric_outward_inventory;
        var total_roll = 0;
        var total_weight = 0;
        fabric_outward_inventory.map((item, index) => {
            total_roll += Number(item.roll);
            total_weight += Number(item.weight);

            if(index === fabric_outward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_roll_total : total_roll,
                        inventory_weight_total : total_weight
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_roll_total : total_roll,
                        inventory_weight_total : total_weight
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

    getFabricOutward = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/fabricOutward?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            
            this.getNextFabricOutwardVouNo();
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

    getNextFabricOutwardVouNo = () => {
        getRequest('garments/getNextFabricOutwardVouNo').then(data => {
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

    componentDidMount() {
        this.getOrderSB();
        this.getAllLedgerSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.setTOTAL();
        this.getFabricOutward();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Fabric Outward',
            metaDescription: 'Add Fabric Outward'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Fabric Outward',
                metaDescription: 'Edit Fabric Outward'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/fabricOutward?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_fabric_outward')
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

    addFabricOutwardInventory = () => {
        var newFabricOutwardInventory = {
            fabrics_id : '',
            color_id : '',
            gsm : '',
            dia : '',
            roll :'' ,
            weight : ''
        }

        var oldFabricOutwardInventoryArray = this.state.formData.fabric_outward_inventory;

        oldFabricOutwardInventoryArray.push(newFabricOutwardInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                fabric_outward_inventory : oldFabricOutwardInventoryArray

            }
        })
    }

   
    removeFabricOutwardInventory = (index) => {
        var oldFabricOutwardInventoryArray = this.state.formData.fabric_outward_inventory;

        oldFabricOutwardInventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                fabric_outward_inventory : oldFabricOutwardInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno)  && issetNotEmpty(FORMDATA.from_process_id) && issetNotEmpty(FORMDATA.to_process_id))
        {
            var selectedItems = _.filter(FORMDATA.fabric_outward_inventory, (item) => {
                // console.log(item)
                return  item.fabric_id && item.color_id && item.gsm && item.dia && item.roll &&item.weight  ;
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
                    // onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    >
                        
                    <div className="row">
                       
                       <Selectbox modelName="ledger_id" autoFocus label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                        <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox>
                   </div>
                    
                   <div className="row">
                        <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID} className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>  
                       <Selectbox modelName="from_process_id" label="From Process" className="col-md-4" options={this.state.process} value={this.state.formData.from_process_id}  ></Selectbox>
                       <Selectbox modelName="to_process_id" label="To Process" className="col-md-4" options={this.state.process} value={this.state.formData.to_process_id}  ></Selectbox>
                   </div>

                  
                   <div className="row">
                        <Textbox label="Vehicle No" required="false" modelName="vehicle_no"  className="col-md-4"></Textbox>
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                   </div>

                   <div className="row">
                   <div className="col-md-12 table-scroll">
                            <Divider plain orientation="left" >Products</Divider>
                            <table id="dynamic-table" className="table table-bordered">
                             <thead >
                                    <tr>
                                        <th width="200px">Fabric </th>
                                        <th width="200px">Color</th>
                                        <th>GSM</th>
                                        <th>Dia</th>
                                        <th>Roll</th>
                                        <th>Weight</th>
                                        <th> <Button type="primary" onClick={this.addFabricOutwardInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="fabric_outward_inventory">
                                   { (fields, { add, remove } )=> (
                                       fields.map((field, index) => (
                                           <tr>
                                               <td> <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} options={this.state.fabric} label="Fabric"></Selectbox></td>
                                               <td><Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox></td>

                                               <td><Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={[field.name, 'gsm']} label="Gsm"></Numberbox></td>

                                               <td> <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} required = 'false' modelName={[field.name, 'dia']} value={[field.name, 'dia']} label="Dia"></Numberbox></td>

                                               <td> <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'roll' ]}  modelName={[field.name, 'roll']} value={[field.name, 'roll']} label="Roll" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                               <td> <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'weight' ]}  modelName={[field.name, 'weight']} value={[field.name, 'weight']} label="Weight" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>
                                               <td>{ index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeFabricOutwardInventory(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}</td>
                                           </tr>
                                              )
                                           
                                              )
                                          ) }
                                         </Form.List> 
                                         <tr>
                                         <td colSpan={4} style={{textAlign:'right'}}> <h6> Total</h6></td>
                                    <td><Numberbox withoutMargin className='col-md-12' showLabel={false} align="right" modelName='inventory_roll_total' value={this.state.formData.inventory_roll_total} disabled label='Total Roll'></Numberbox></td>
                                    <td><Numberbox withoutMargin className='col-md-12' showLabel={false} align="right" modelName='inventory_weight_total' value={this.state.formData.inventory_weight_total} disabled label='Total Weight'></Numberbox></td>
                                         </tr>
                                </tbody>
                                
                                </table>
                          
                                        
                          </div>
                        
                        </div>
                       <br />
                       
                   

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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddFabricOutward));