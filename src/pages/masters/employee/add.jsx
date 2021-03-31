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

const calculateTypes = [
    {
        name : "Flat Amount",
        value : 'flat'
    },
    {
        name : "Percentage",
        value : 'percent'
    },
]

const types = [
    {
        name : "Add",
        value : 'add'
    },
    {
        name : "Less",
        value : 'less'
    },
]

const status = [
    {
        name : "Active",
        value : 'active'
    },
    {
        name : "Suspend",
        value : 'suspend'
    },
    {
        name : "Resign",
        value : 'resign'
    },
    {
        name : "Terminate",
        value : 'terminate'
    }
]

class AddEmployee extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active'
            },
            companiesList : [],
            employee_category : [],
            shift : [],
            designation : [],
            department : [],
            branch : [],
            bank : [],
            // employee_group :[],
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      getEmployeeCategorySB = () => {
        getRequest('masters/getEmployeeCategorySB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    employee_category : data.data
                })
            }
        })
    }
      getShiftSB = () => {
        getRequest('masters/getShiftSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    shift : data.data
                })
            }
        })
    }
      getDesignationSB = () => {
        getRequest('masters/getDesignationSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    designation : data.data
                })
            }
        })
    }
      getDepartmentSB = () => {
        getRequest('masters/getDepartmentSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    department : data.data
                })
            }
        })
    }
      getBranchSB = () => {
        getRequest('masters/getBranchSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    branch : data.data
                })
            }
        })
    }
      getBankSB = () => {
        getRequest('masters/getBankSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    bank : data.data
                })
            }
        })
    }

    // getEmployeeGroupSB = () => {
        
    //     getRequest('masters/getEmployeeGroupSB').then(data => {
    //         if(data.status === "info")
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 employee_group : data.data
    //             })
    //         }
    //     })
    // }

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

    getEmployee = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("masters/employee?id=" + this.id).then(data => {
                data.data[0].dob = moment(data.data[0].dob)
                data.data[0].joined = moment(data.data[0].joined)
                data.data[0].resign_date = moment(data.data[0].resign_date)
                console.log(data.data[0])
                this.formRef.current.setFieldsValue(data.data[0]);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    componentDidMount() {
        this.getEmployee();
        this.getEmployeeCategorySB();
        // this.getEmployeeGroupSB();
        this.getShiftSB();
        this.getDesignationSB();
        this.getDepartmentSB();
        this.getBranchSB();
        this.getBankSB();

        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Employee',
            metaDescription: 'Add Employee'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Employee',
                metaDescription: 'Edit Employee'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('masters/employee?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_employee')
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_employee') } }>
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
                        <div className="col-md-6">
                        <Divider plain orientation="left" >Employee</Divider>

                            
                            <div className="row">
                                <Textbox label="Employee" required="true" modelName="employee" className="col-md-12"></Textbox>
                            </div>
                            <div className="row">
                                <Textbox required="true" label="Employee Code"  modelName="employee_code" className="col-md-6"></Textbox>
                                <Datebox label="Date Of Birth" value={this.state.formData.dob}  modelName="dob" className="col-md-6"></Datebox>
                            </div>
                            <div className="row">
                            <Selectbox required="true" modelName="employee_category_id" label="Employee Category" className="col-md-12" options={this.state.employee_category} value={this.state.formData.employee_category_id} ></Selectbox>
                            </div>
                            <div className="row">

                            <Selectbox required="true" modelName="shift_id" label="Shift" className="col-md-12" options={this.state.shift} value={this.state.formData.shift_id} ></Selectbox> 

                             </div>
                            <div className="row">
                                <Selectbox label="Department" required="true" modelName="department_id" className="col-md-12" options={this.state.department} value={this.state.formData.department_id}></Selectbox>
                            </div>
                            <div className="row">
                                <Selectbox label="Designation" required="true" modelName="designation_id" className="col-md-12" options={this.state.designation} value={this.state.formData.designation_id}></Selectbox>
                            </div>
                            <div className="row">
                                <Selectbox label="Branch" required="true" modelName="branch_id" className="col-md-12" options={this.state.branch} value={this.state.formData.branch_id}></Selectbox>
                            </div>
                            <div className="row">
                                <Textbox label="O.Bal" modelName="opn_bal" className="col-md-8"></Textbox>
                                <Selectbox modelName="emp_status"  required="false"  label="Status" options={status} value={this.state.formData.status}  ></Selectbox>

                                
                                <Textbox label="Admin Notes" modelName="alias" className="col-md-8"></Textbox>
                            </div>
                            <Divider plain orientation="left" >Communication</Divider>
                            <div className="row">
                                <Textbox  label="Adress" modelName="address" className="col-md-12"></Textbox>
                                <Textbox  label="Mail" modelName="email" type="email" className="col-md-12"></Textbox>
                                <Numberbox required="false" label="Phone" modelName="phone" className="col-md-6"></Numberbox>
                                <Numberbox required="false" label="Mobile" modelName="mobile" className="col-md-6"></Numberbox>
                            </div>
                            <Divider plain orientation="left" >Others</Divider>
                            <div className="row">
                            {/* <Textbox required="false" label="User" modelName="" className="col-md-6"></Textbox> */}
                            <Datebox label="Join Date" value={this.state.formData.joined}  modelName="joined" className="col-md-6"></Datebox>
                            <Datebox label="Resign Date" value={this.state.formData.resign_date}  modelName="resign_date" className="col-md-6"></Datebox>

                                {/* <Selectbox modelName="state_id"  required="false"  label="State" options={formulae} value={this.state.formData.state_id}  ></Selectbox> */}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Divider plain orientation="left" >Compliance</Divider>
                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="ESI No" modelName="esino"></Textbox>
                                <Textbox required="false" className="col-md-6" label="PF No" modelName="pfno"></Textbox>
                            </div>
                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="PAN No" modelName="panno"></Textbox>
                                <Numberbox required="false" className="col-md-6" label="Adhar No" modelName="adharno"></Numberbox>
                            </div>
                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="Salary" modelName="amount"></Textbox>
                                <Textbox required="false" className="col-md-6" label="Basic" modelName="basic"></Textbox>
                            </div>
                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="OT" modelName="ot"></Textbox>
                                <Textbox required="false" className="col-md-6" label="Compliance shift" modelName="shift_id_compliance"></Textbox>
                            </div>
                            <Divider plain orientation="left" >Bank Details</Divider>
                            <div className="row">
                                <Selectbox required="false" className="col-md-12" label="Bank" modelName="bank_id" options={this.state.bank} value={this.state.formData.bank_id}></Selectbox>
                                
                            </div>
                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="Account Name" modelName="bankacname"></Textbox>
                                <Textbox required="false" className="col-md-6" label="Account Number" modelName="bankacno"></Textbox>
                            </div>
                            <div className="row">
                                <Textbox required="false" className="col-md-6" label="IFSC Code" modelName="ifsc_code"></Textbox>
                                <Textbox required="false" className="col-md-6" label="Bank Branch" modelName="bank_branch"></Textbox>
                            </div>


                            </div>
                        </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary"  disabled={ this.state.buttonDisabled }  htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddEmployee));