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
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import { issetNotEmpty } from '../../../helpers/formhelpers';



let interval;


class AddDyeingProgram extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
           
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                narration : "",
                status : 'active',
                vou_date : moment(),
                dyeing_program_inventory : [
                    {  
                        fabrics_id : '',
                        color_id : '',
                        narration : '',
                        gsm : '',
                        dia : '',
                        rolls :'' ,
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

    getFabricsForOrderID = (order_id) => {
        getRequest('garments/getFabricsForOrderID?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        order_id : order_id,
                        dyeing_program_inventory : data.data
                    }
                }, () => {
                    this.formRef.current.setFieldsValue(this.state.formData)
                })
                // this.setTOTAL()
            }
        })
    }

    getNextDyeingProgramVouNo = () => {
        getRequest('garments/getNextDyeingProgramVouNo').then(data => {
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
        var dyeing_program_inventory = values.dyeing_program_inventory;
        var total_rolls = 0;
        var total_weight = 0;
        dyeing_program_inventory.map((item, index) => {
            if(item.selected)
            {
                total_rolls += Number(item.rolls);
                total_weight += Number(item.weight);
            }
            if(index === dyeing_program_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_rolls_total : total_rolls,
                        inventory_weight_total : total_weight
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_rolls_total : total_rolls,
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

    getDyeingProgram = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("garments/DyeingProgram?id=" + this.id).then(data => {
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
        this.getAllLedgerSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.getNextDyeingProgramVouNo();
        
        this.getDyeingProgram();
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
            title: 'Add Dyeing Program',
            metaDescription: 'Add Dyeing Program'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Dyeing Program',
                metaDescription: 'Edit Dyeing Program'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/DyeingProgram?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_dyeing_program')
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
        var inventories = formData.dyeing_program_inventory;
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

   

    addDyeingProgramInventory = () => {
        var newDyeingProgramInventory = {
            fabrics_id : '',
            color_id : '',
            narration : '',
            gsm : '',
            dia : '',
            rolls :'' ,
            weight : ''
        }

        var oldDyeingProgramInventoryArray = this.state.formData.dyeing_program_inventory;

        oldDyeingProgramInventoryArray.push(newDyeingProgramInventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                dyeing_program_inventory : oldDyeingProgramInventoryArray

            }
        })
    }

   
    removeDyeingProgramInventory = (index) => {
        var oldDyeingProgramInventoryArray = this.state.formData.dyeing_program_inventory;

        oldDyeingProgramInventoryArray.splice(index, 1);
        
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                dyeing_program_inventory : oldDyeingProgramInventoryArray
            }
        })
        this.setTOTAL();
    }

    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno) && issetNotEmpty(FORMDATA.order_id))
        {
            var selectedItems = _.filter(FORMDATA.dyeing_program_inventory, (item) => {
                console.log(item)
                return item.selected && item.fabric_id && item.color_id && item.gsm && item.dia && item.rolls &&item.weight ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_dyeing_program') } }>
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
                       
                        <Selectbox modelName="ledger_id" label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                        <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>

                       <Textbox label="Vou No" modelName="vouno"  className="col-md-4"></Textbox>
                    
                    </div>
                    <div className="row">
                        <Selectbox modelName="order_id" label="Order No" className="col-md-4" onChange={this.getFabricsForOrderID} options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        {/* <Selectbox modelName="process_id" label="Process" className="col-md-4" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                        <Textbox label="Ref No" modelName="refno"  className="col-md-4"></Textbox> */}
                    </div>
                    
                    
                    <div className="row">
                       
                        {/* <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox> */}

                    </div>
                    <div className="row">
                    <div className="col-md-12 table-scroll">
                             <Divider plain orientation="left" >Products</Divider>
                             <table id="dynamic-table" className="table table-bordered">
                             <thead >
                                    <tr>
                                    <th width="50px"> <Checkbox onChange={this.checkAllItems} /></th>
                                     <th width="200px">Fabric </th>
                                        <th width="200px">Color</th>
                                        <th width="200px">Narraion</th>
                                        <th>GSM</th>
                                        <th>Dia</th>
                                        <th>Roll</th>
                                        <th>Weight</th>
                                        
                                        <th>   <Button type="primary" onClick={this.addDyeingProgramInventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>  <Form.List name="dyeing_program_inventory">
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

                                        <td>   <Selectbox noPlaceholder withoutMargin required="false" className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} options={this.state.fabric} label="Fabric"></Selectbox></td>

                                        <td> <Selectbox noPlaceholder withoutMargin required="false" className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={[field.name, 'color_id']} options={this.state.color_data} label="Color"></Selectbox></td>

                                        <td> <Textbox noPlaceholder withoutMargin required="false" className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'narration' ]} modelName={[field.name, 'narration']} value={[field.name, 'narration']} label="Narration"></Textbox></td>

                                        <td> <Numberbox noPlaceholder withoutMargin required="false" className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={[field.name, 'gsm']} label="Gsm"></Numberbox></td>

                                        <td>  <Numberbox noPlaceholder withoutMargin required="false" className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} required = 'false' modelName={[field.name, 'dia']} value={[field.name, 'dia']} label="Dia"></Numberbox></td>

                                        <td> <Numberbox noPlaceholder withoutMargin required="false" className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'rolls' ]}  modelName={[field.name, 'rolls']} value={[field.name, 'rolls']} label="Roll" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                        <td><Numberbox noPlaceholder withoutMargin required="false" className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'weight' ]}  modelName={[field.name, 'weight']} value={[field.name, 'weight']} label="Weight" onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                        <td> { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeDyeingProgramInventory(index)} type="primary"> <FontAwesomeIcon  icon={faTimes} /> </Button>}</td>
                                        
                                    </tr>
                                    )
                                            
                                    )
                                ) }
                               </Form.List>
                               <tr>
                               <td colSpan={6} style={{textAlign:'right'}}> <h6> Total</h6></td>
                                <td> <Numberbox withoutMargin showLabel={false} className="col-md-12"  modelName='inventory_rolls_total' value={this.state.formData.total_rolls} disabled label='Total Roll'></Numberbox></td>
                                <td> <Numberbox withoutMargin showLabel={false} className="col-md-12" modelName='inventory_weight_total' value={this.state.formData.total_weight} disabled label='Total Weight'></Numberbox></td>
                               </tr>
                                </tbody>
                               
                                </table>
                              </div>
                         </div>
                        
                        
                         
                        <br/>
                        
                    

                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary" disabled={  this.checkButtonDisabled() } onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddDyeingProgram));