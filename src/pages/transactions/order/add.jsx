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
            ledger_name : []
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
            getRequest("garments/order_program?id=" + this.id).then(data => {
               
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
        getRequest('garments/getSizeSB').then(data => {
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
    
    getFabricSB = () => {
        getRequest('garments/getFabricsSB').then(data => {
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
        getRequest('garments/getNextOrderNo').then(data => {
            
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
            putRequest('garments/order_program?id=' + this.id, this.state.formData).then(data => {
                console.log(values)
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_order_program')
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
        // this.setTOTAL();
    }


    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_order_program') } }>
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
                        <div className="col-md-12">
                            <Divider plain orientation="left" >ORDER PROGRAM</Divider>
                            <div className="row">
                            <Datebox autoFocus className="col-md-4" label="Order Date" value={this.state.formData.orderDate} modelName="orderDate" ></Datebox>
                            <Selectbox modelName="ledger_id" label="Ladger Name" required="false" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id}  ></Selectbox>
                            <Textbox required="false" className="col-md-4" label="Order No" modelName="order_no" ></Textbox>
                            </div>

                            <div className="row">
                            <Datebox  className="col-md-4" label="Due Date" value={this.state.formData.due_date} modelName="due_date" ></Datebox>
                            <Selectbox modelName="status_id" className="col-md-4" label="Status" required="true" value={this.state.formData.status} statusSelect ></Selectbox>
                            <Selectbox modelName="size_id" label="Size" className="col-md-4" options={this.state.size_data} value={this.state.formData.size_id}  ></Selectbox>
                            </div>
                            <div className="row">
                            <Selectbox modelName="style_id" label="Style" className="col-md-4" options={this.state.style_data} value={this.state.formData.style_id}  ></Selectbox>

                            </div>
                        </div>  
                    </div>
                    <div className="row ">
                    <div className="col-md-12 table-scroll">
                            <Divider plain orientation="left" >FABRIC DETAILS</Divider>
                            <table id="dynamic-table" className="table table-bordered" width="100%">
                                <thead >
                                    <tr>
                                        <th>Fabric </th>
                                        <th>Dia</th>
                                        <th>GSM</th>
                                       
                                        <th width="10px" >   <Button type="primary" onClick={this.addOrderFabrics} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="order_fabrics">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <tr>
                                                <td>    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']}  label="Fabric"  options={this.state.fabric_data} value={this.state.formData.fabric_id} noPlaceholder withoutMargin ></Selectbox></td>

                                                <td><Textbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} modelName={[field.name, 'dia']}  noPlaceholder withoutMargin label="Dia"  ></Textbox></td>

                                                <td>  <Textbox  className="col-md-12" label="Gsm" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} noPlaceholder withoutMargin ></Textbox></td>

                                                <td>  { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeOrderFabrics(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}</td>
                                            </tr>
                                             )
                                            
                                             )
                                         ) }
                                     </Form.List>
                                </tbody>
                                </table>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-md-12 table-scroll">
                        
                                <Divider plain orientation="left">PROCESS</Divider>
                                <table id="dynamic-table" className="table table-bordered" width="100%">
                                <thead >
                                    <tr>
                                        <th>Process</th>
                                        <th>Ledger</th>
                                        <th>Rate</th>
                                        <th>Waste</th>
                                       
                                        <th width="10px"> <Button type="primary"  onClick={this.addOrderProcess} style={{ marginLeft : 10}}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="order_process">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <tr>
                                                <td>    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'process_id' ]} modelName={[field.name, 'process_id']}  label="Process" value={field.name, 'process_id'} options={this.state.process} noPlaceholder withoutMargin ></Selectbox></td>

                                                <td> <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'ledger_id' ]} modelName={[field.name, 'ledger_id']}  label="Ledger" value={field.name, 'ledger'} options={this.state.ledger_name} noPlaceholder withoutMargin ></Selectbox></td>

                                                <td> <Numberbox className="col-md-12" required="false" showLabel={false} label="Rate" min={0} field={field} fieldKey={[ field.fieldKey, 'rate' ]} modelName={[field.name, 'rate']} value={field.name, 'rate'} noPlaceholder withoutMargin ></Numberbox></td>

                                                <td> <Numberbox className="col-md-12" required="false" showLabel={false} label="Waste" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'waste' ]} modelName={[field.name, 'waste']} value={field.name, 'waste'} noPlaceholder withoutMargin ></Numberbox></td>

                                                <td>  { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeOrderProcess(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}</td>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddOrderProgram));