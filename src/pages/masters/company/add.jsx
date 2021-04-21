import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';
import Datebox from '../../../components/Inputs/Datebox';

import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';
import Address_Template from '../../../components/Templates/Address_Template';


let interval;


class AddCompany extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                
            },
            companiesList : []
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

    getCompany = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("garments/company?id=" + this.id).then(data => {
                data.data.acc_start_date = moment(data.data.acc_start_date)
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
        this.getCompany();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Company',
            metaDescription: 'Add Company'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Company',
                metaDescription: 'Edit Company'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/company?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_company')
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

    


    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_company') } }>
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
                        <div className="col-md-6">
                        <Divider plain orientation="left" >COMPANY</Divider>

                            
                            <div className="row">
                                <Textbox label="Company" required="true" modelName="company" className="col-md-12"></Textbox>
                            </div>
                            
                            <div className="row">
                                <Textbox required="false" label="Currency"  modelName="currency_code" className="col-md-12"></Textbox>
                                {/* <Datebox label="Date Of Birth" value={this.state.formData.dob}  modelName="dob" className="col-md-6"></Datebox> */}
                            </div>
                            <div className="row">
                            <Textbox required="true" modelName="phone" label="Phone No." className="col-md-12"></Textbox>
                            </div>
                            <div className="row">

                            <Textbox required="false" modelName="apikey" label="API Key" className="col-md-12" options={this.state.shift} value={this.state.formData.shift_id} ></Textbox> 

                             </div>
                            <div className="row">
                                <Textbox label="E Mail" required="false" modelName="email" className="col-md-12"></Textbox>
                            </div>


                            <Divider plain orientation="left" >STATUARY INFO</Divider>


                            <div className="row">
                                <Textbox label="Tin" required="false" modelName="tin" className="col-md-12"></Textbox>
                            </div>
                            <div className="row">
                                <Datebox label="Acc Start Date" required="false" modelName="acc_start_date" value={this.state.formData.acc_start_date} className="col-md-12"></Datebox>
                            </div>
                            <div className="row">
                                <Textbox label="Inventory Decimal" required="false" modelName="inventory_decimal" className="col-md-12"></Textbox>
                            </div>
                            <div className="row">
                                <Textbox label="GST No" required="false" modelName="gstno" className="col-md-12" ></Textbox>
                            </div>
                            <div className="row">
                                <Textbox label="Week Start Day" required="false" modelName="week_start_day" className="col-md-12" ></Textbox>
                            </div>
                            <div className="row">
                                <Textbox label="CST" required="false" modelName="cst" className="col-md-12" ></Textbox>
                            </div>
                            <div className="row">
                                <Textbox label="Currency Decimal" required="false" modelName="currency_decimal" className="col-md-12"></Textbox>
                            </div>
                            </div>
                        <div className="col-md-6">


                            <Divider plain orientation="left" >COMMUNICATION</Divider>


                            <div className="row">
                                <Textbox label="Address" required="false" modelName="address" className="col-md-12"></Textbox>
                            </div>


                            <Divider plain orientation="left" >Bank Details</Divider>


                            <div className="row">
                            <Textbox required="false" className="col-md-12" label="Accounts Ledger" modelName="accounts_ledger"></Textbox>
                                
                            </div>
                            <div className="row">
                            <Textbox required="false" className="col-md-12" label="Account No" modelName="bankacno"></Textbox>
                                
                            </div>
                            <div className="row">
                            <Textbox required="false" className="col-md-12" label="Branch" modelName="bankbranch"></Textbox>
                                
                            </div>
                            <div className="row">
                            <Textbox required="false" className="col-md-12" label="Bank Name" modelName="bankname"></Textbox>
                                
                            </div>
                            <div className="row">
                            <Textbox required="false" className="col-md-12" label="IFSC Code" modelName="ifsc"></Textbox>
                                
                            </div>
                            


                            </div>
                        </div>
                    <br></br>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddCompany));