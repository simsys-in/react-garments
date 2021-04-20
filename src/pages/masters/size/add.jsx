import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';



let interval;



class AddSize extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                // status : 'active'
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

    getSize = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("garments/size?id=" + this.id).then(data => {
                // data.data[0].dob = moment(data.data[0].dob)
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
        this.getSize();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Size',
            metaDescription: 'Add Size'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Size',
                metaDescription: 'Edit Size'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/size?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_size')
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_size') } }>
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
                        <Textbox label="Size" autoFocus modelName="size" className="col-md-4"></Textbox>
                        <Textbox label="Size1"  modelName="size1" className="col-md-4"></Textbox>
                        <Textbox label="Size2" required="false" modelName="size2" className="col-md-4"></Textbox>
                    </div><br/>
                    <div className="row">
                        <Textbox label="Size3" required="false" modelName="size3" className="col-md-4"></Textbox>
                        <Textbox label="Size4" required="false" modelName="size4" className="col-md-4"></Textbox>
                        <Textbox label="Size5" required="false" modelName="size5" className="col-md-4"></Textbox>
                    </div><br/>
                    <div className="row">
                        <Textbox label="Size6" required="false" modelName="size6" className="col-md-4"></Textbox>
                        <Textbox label="Size7" required="false" modelName="size7" className="col-md-4"></Textbox>
                        <Textbox label="Size8" required="false" modelName="size8" className="col-md-4"></Textbox>
                    </div><br/>

                    <div className="row">
                    <Textbox label="Size9" required="false" modelName="size9" className="col-md-4"></Textbox>

                    </div>
                    <br />

                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary" disabled={ this.state.buttonDisabled } onClick={this.onFinish}  htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddSize));