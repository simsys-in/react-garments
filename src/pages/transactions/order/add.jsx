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
                        process : '',
                        ledger : '',
                        rate : '',
                        waste : ''
                    }
                ]
            },
            companiesList : [],
            size_data : [],
            style_data : [],
            fabric_data : []
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
    

    componentDidMount() {
        this.getSizeSB();
        this.getStyleSB();
        this.getFabricSB();
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
            price_group : '',
            sales_rate : '',
            percentage : '',
            mrp : '',
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
                            <Datebox  className="col-md-6" label="Order Date" value={this.state.formData.orderDate} modelName="orderDate" ></Datebox>
                            <Textbox required="false" className="col-md-6" label="Order No" modelName="order_no" ></Textbox>
                            </div>

                            <div className="row">
                            <Datebox  className="col-md-6" label="Due Date" value={this.state.formData.due_date} modelName="due_date" ></Datebox>
                            <Selectbox modelName="status_id" label="Status" required="true" value={this.state.formData.status} statusSelect ></Selectbox>
                            </div>

                            <div className="row">
                            <Selectbox modelName="size_id" label="Size" className="col-md-6" options={this.state.size_data} value={this.state.formData.size_data}  ></Selectbox>
                            <Selectbox modelName="style_id" label="Style" className="col-md-6" options={this.state.style_data} value={this.state.formData.style_data}  ></Selectbox>
                            </div>
                        </div>  
                    </div>
                    <div className="row">
                    <div className="col-md-12">
                            <Divider plain orientation="left" >FABRIC DETAILS</Divider>
                            <div className="row">
                                <Selectbox modelName="fabric_id" label="Fabric" className="col-md-6" options={this.state.fabric_data} value={this.state.formData.fabric_data}  ></Selectbox>
                                <Textbox required="false" className="col-md-6" label="Dia" modelName="dia" ></Textbox>
                            </div>

                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="Gsm" modelName="gsm" ></Textbox>
                            </div>

                         </div>
                    </div>
                    <div className="row">
                             <div >
                                <Divider plain orientation="left">PROCESS</Divider>
                                
                                <Form.List name="order_process">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row">
                                                    <Textbox className="col-md-3" field={field} fieldKey={[ field.fieldKey, 'process_id' ]} modelName={[field.name, 'process_id']}  label="Process" value={field.process_id} ></Textbox>
                                                    <Textbox className="col-md-3" field={field} fieldKey={[ field.fieldKey, 'ledger_id' ]} modelName={[field.name, 'ledger_id']}  label="Ledger" value={field.ledger} ></Textbox>
                                                    <Numberbox className="col-md-2" label="Rate" min={0} field={field} fieldKey={[ field.fieldKey, 'rate' ]} modelName={[field.name, 'rate']} value={field.rate} ></Numberbox>
                                                    <Numberbox className="col-md-2" label="Waste" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'waste' ]} modelName={[field.name, 'waste']} value={field.waste} ></Numberbox>

                                                   <div className="col-md-1">
                                                        { index === 0  && <Button onClick={this.addOrderProcess} style={{ marginLeft : 10 }}>+</Button> }
                                                        { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeOrderProcess(index)} type="primary">-</Button>}
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