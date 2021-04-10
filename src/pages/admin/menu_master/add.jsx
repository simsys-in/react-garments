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
import Address_Template from '../../../components/Templates/Address_Template';


let interval;

const status = [
    {
        name : "Active",
        value : 1
    },
    {
        name : "Inactive",
        value : 0

    }

]


class AddMenu_Master extends PureComponent{
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

    getMenu_Master = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("user/menu_master?id=" + this.id).then(data => {
                data.data[0].dob = moment(data.data[0].dob)
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
        this.getMenu_Master();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Menu Master',
            metaDescription: 'Add Menu Master'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Menu Master',
                metaDescription: 'Edit Menu Master'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('user/menu_master?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/user/list_menu_master')
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/user/list_menu_master') } }>
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
                        
                    <Textbox label="Menu" autoFocus modelName="menu" className="col-md-4"></Textbox>
                    <Textbox label="Menu Route"  modelName="menu_route" className="col-md-4"></Textbox>
                    <Numberbox label="Sort Order"  modelName="sort_order" className="col-md-4"></Numberbox>


                    </div>
                    {/* <br /> */}
                    <div className="row">
                        
                    <Textbox label="Method" required="false" modelName="method" className="col-md-4"></Textbox>
                    <Textbox label="Icon"  modelName="icon" className="col-md-4"></Textbox>

                    <Selectbox label="Status"  modelName="sts" options={status} value={this.state.formData.status} className="col-md-4"></Selectbox>

                    </div>

                    <div className="row">
                    <Textbox label="Addon" required="false" modelName="addon" className="col-md-4"></Textbox>

                        </div>
<br />
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddMenu_Master));