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
                status : 'active',
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
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/fabricOutward?id=" + this.id).then(data => {
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

    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
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
            putRequest('transactions/fabricOutward?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_fabric_outward')
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
                       
                       <Selectbox modelName="ledger_id" label="Ledger Name" className="col-md-6" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                       <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-6"></Datebox>
                   </div>
                   
                   <div className="row">
                       <Selectbox modelName="from_process_id" label="From Process" className="col-md-6" options={this.state.process} value={this.state.formData.from_process_id}  ></Selectbox>
                       <Selectbox modelName="to_process_id" label="To Process" className="col-md-6" options={this.state.process} value={this.state.formData.to_process_id}  ></Selectbox>
                   </div>
                   <div className="row">
                      
                   <Selectbox modelName="order_id" label="Order No" className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>  
                   <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>
                   <Numberbox label="Vou No" modelName="vouno" required="false" className="col-md-6"></Textbox>
                   </div>
                   <div className="row">
                            <div className="col-md-12">
                            <Divider plain orientation="left" >Products</Divider>
                             <Form.List name="fabric_outward_inventory">
                                   { (fields, { add, remove } )=> (
                                       fields.map((field, index) => (
                                               <div className="row">
                                                   <div className="col-md-11">
                                                       <div className="row">
                                                           <Selectbox className="col-md-2" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} options={this.state.fabric} label="Fabric"></Selectbox>
                                                           <Selectbox className="col-md-2" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox>
                                                           <Textbox className="col-md-2" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={[field.name, 'gsm']} label="Gsm"></Textbox>
                                                           <Textbox className="col-md-2"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} required = 'false' modelName={[field.name, 'dia']} value={[field.name, 'dia']} label="Dia"></Textbox>
                                                           <Numberbox className="col-md-2" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'roll' ]}  modelName={[field.name, 'roll']} value={[field.name, 'roll']} label="Roll" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                           <Numberbox className="col-md-2"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'weight' ]}  modelName={[field.name, 'weight']} value={[field.name, 'weight']} label="Weight" onChange={(ev) => this.setTOTAL (ev,field.fieldKey)}></Numberbox>
                                                       </div>
                                                   </div>
                                                   <div className="col-md-1">
                                                       { index === 0  && <Button onClick={this.addFabricOutwardInventory} style={{ marginLeft : 10 }}>+</Button> }
                                                       { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeFabricOutwardInventory(index)} type="primary">-</Button>}
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


                   <div className='row'>
                       
                           <Numberbox className='col-md-3' align="right" modelName='inventory_roll_total' value={this.state.formData.inventory_roll_total} disabled label='Total Roll'></Numberbox>
                           <Numberbox className='col-md-3' align="right" modelName='inventory_weight_total' value={this.state.formData.inventory_weight_total} disabled label='Total Weight'></Numberbox>

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