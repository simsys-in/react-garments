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
import Address_Template from '../../../components/Templates/Address_Template';
import { addDays, getCurrentDate } from '../../../helpers/timer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

// import moment from 'moment'


let interval;


class AddOrderProgram extends PureComponent{
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active',
                orderDate : moment(),
                due_date : addDays(getCurrentDate(),7,'days'),
                order_process : [
                    {
                        process_id : '',
                        ledger_id : '',
                        rate : '',
                        waste : ''
                    }
                ],
                order_fabrics : [
                    {
                        fabric_id : '',
                        gsm : '',
                        dia : ''
                    
                    }
                ]
            },
            companiesList : [],
            size_data : [],
            style_data : [],
            fabric_data : [],
            ledger_name : [],
            process : [],
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

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

    getOrderProgram = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/orderProgram?id=" + this.id).then(data => {
               
                data.data.orderDate = moment(data.data.orderDate)
                data.data.due_date = moment(data.data.due_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getSizeSB = () => {
        getRequest('transactions/getSizeSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    size_data : data.data
                })
            }
        })
    }

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
    
    getFabricSB = () => {
        getRequest('transactions/getfabricSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric_data : data.data
                })
            }
        })
    }

    getNextOrderNo = () => {
        getRequest('transactions/getNextOrderNo').then(data => {
            
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        order_no : data.data.max_order_no
                    }
                },() => {
                    this.formRef.current.setFieldsValue({
                        order_no : this.state.formData.order_no
                    })
                })
            }
        })
    }

    

    componentDidMount() {
        this.getSizeSB();
        this.getStyleSB();
        this.getFabricSB();
        this.getProcessSB();
        this.getLedgerNameSB();
        this.getNextOrderNo();
        this.getOrderProgram();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Order Program',
            metaDescription: 'Add Order Program'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Order Program',
                metaDescription: 'Edit Order Program'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('transactions/orderProgram?id=' + this.id, values).then(data => {
                console.log(values)
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_orderprogram')
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

    addOrderProcess = () => {
        var newOrderProcess = {
            process_id : '',
            ledger_id : '',
            rate : '',
            waste : '',
        }

        var oldOrderProcessArray = this.state.formData.order_process;

        oldOrderProcessArray.push(newOrderProcess);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_process : oldOrderProcessArray
            }
        })
    }


    removeOrderProcess = (index) => {
        var oldSOrderProcessArray = this.state.formData.order_process;

        oldSOrderProcessArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_process : oldSOrderProcessArray
            }
        })
    }

    

    addOrderFabrics = () => {
        var newOrderFabrics = {
            fabric_id : '',
            dia : '',
            gsm : ''
        }

        var oldOrderFabricsArray = this.state.formData.order_fabrics;

        oldOrderFabricsArray.push(newOrderFabrics);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_fabrics : oldOrderFabricsArray
            }
        })
    }


    removeOrderFabrics = (index) => {
        var oldOrderFabricsArray = this.state.formData.order_fabrics;

        oldOrderFabricsArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_fabrics : oldOrderFabricsArray
            }
        })
        this.setTOTAL();
    }


    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_orderprogram') } }>
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
                        <div className="col-md-12">
                            <Divider plain orientation="left" >ORDER PROGRAM</Divider>
                            <div className="row">
                            <Datebox autoFocus className="col-md-6" label="Order Date" value={this.state.formData.orderDate} modelName="orderDate" ></Datebox>
                            <Textbox required="false" className="col-md-6" label="Order No" modelName="order_no" ></Textbox>
                            </div>

                            <div className="row">
                            <Datebox  className="col-md-6" label="Due Date" value={this.state.formData.due_date} modelName="due_date" ></Datebox>
                            <Selectbox modelName="status_id" label="Status" required="true" value={this.state.formData.status} statusSelect ></Selectbox>
                            </div>

                            <div className="row">
                            <Selectbox modelName="size_id" label="Size" className="col-md-6" options={this.state.size_data} value={this.state.formData.size_id}  ></Selectbox>
                            <Selectbox modelName="style_id" label="Style" className="col-md-6" options={this.state.style_data} value={this.state.formData.style_id}  ></Selectbox>
                            </div>
                        </div>  
                    </div>
                    <div className="row ">
                    <div className="col-md-12">
                            <Divider plain orientation="left" >FABRIC DETAILS</Divider>
                            <div className="row flex-nowrap"  style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row ">
                                            
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Fabric" label="Fabric" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Dia" label="Dia" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Gsm" label="Gsm" required="false"></Textbox>
                                          
                                        <div className="col-md-1">
                                           <Button type="primary" onClick={this.addOrderFabrics} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            
                                        </div>
                                        </div>
                                        </div>
                                    {/* </div> */}
                                   
                                </div>
                                
                                <Form.List name="order_fabrics">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row "  style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                    <div className="col-md-11">
                                                        <div className="row flex-nowrap">
                                                        <Selectbox className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']}  label="Fabric"  options={this.state.fabric_data} value={this.state.formData.fabric_id} noPlaceholder withoutMargin ></Selectbox>
                                                         <Textbox className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} modelName={[field.name, 'dia']}  noPlaceholder withoutMargin label="Dia"  ></Textbox>
                                                        <Textbox  className="col-md-2" label="Gsm" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} noPlaceholder withoutMargin ></Textbox>
                                                       
                                                     <div className="col-md-1">
                                                        { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeOrderFabrics(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
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
                                <Divider plain orientation="left">PROCESS</Divider>
                                <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row flex-nowrap">
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Process" label="Process" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Ledger" label="Ledger" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Rate" label="Rate" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Waste" label="Waste" required="false"></Textbox>
                                            
                                        <div className="col-md-1">
                                          <Button type="primary"  onClick={this.addOrderProcess} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                         </div>
                                        </div>
                                    </div>
                                   
                                </div>
                                
                                <Form.List name="order_process">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row flex-nowrap" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                   <div className='col-md-11'>
                                                       <div className="row ">
                                                       <Selectbox className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'process_id' ]} modelName={[field.name, 'process_id']}  label="Process" value={field.name, 'process_id'} options={this.state.process} noPlaceholder withoutMargin ></Selectbox>
                                                    <Selectbox className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'ledger_id' ]} modelName={[field.name, 'ledger_id']}  label="Ledger" value={field.name, 'ledger'} options={this.state.ledger_name} noPlaceholder withoutMargin ></Selectbox>
                                                    <Numberbox className="col-md-2" required="false" showLabel={false} label="Rate" min={0} field={field} fieldKey={[ field.fieldKey, 'rate' ]} modelName={[field.name, 'rate']} value={field.name, 'rate'} noPlaceholder withoutMargin ></Numberbox>
                                                    <Numberbox className="col-md-2" required="false" showLabel={false} label="Waste" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'waste' ]} modelName={[field.name, 'waste']} value={field.name, 'waste'} noPlaceholder withoutMargin ></Numberbox>
                                                           
                                                  <div className="col-md-1">
                                                                { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeOrderProcess(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddOrderProgram));