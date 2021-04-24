import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';
import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';


let interval;
class AddShortcut extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                shortcut : "",
                icon : "",
                url : "",
               
              
            },
           
            // shortcut_category_data : [],
            companiesList : []
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

  
    
   

    // getShortcutCategorySB = () => {
    //     getRequest('garments/getShortcutCategorySB').then(data => {
    //         if(data.status === "info")
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 shortcut_category_data : data.data
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

    getShortcut = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/shortcut?id=" + this.id).then(data => {
                // data.data[0].dob = moment(data.data[0].dob)
                // console.log(data.data[0])
                this.formRef.current.setFieldsValue(data.data[0]);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    componentDidMount() {
       
        // this.getShortcutCategorySB();
        this.getShortcut();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Shortcut',
            metaDescription: 'Add Shortcut'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Shortcut',
                metaDescription: 'Edit Shortcut'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/shortcut?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_shortcut')
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

    

    
    // setGST = (ev) => {
    //     this.setState({
    //         ...this.state,
    //         formData : {
    //             ...this.state.formData,
    //             gst : Number(this.state.formData.cgst) + Number(this.state.formData.sgst)
    //         }
    //     }, () => {
    //         var data = this.formRef.current.getFieldValue();
    //         var gst = Number(data.cgst) + Number(data.sgst)
    //         this.formRef.current.setFieldsValue({
    //             gst : gst
    //         });
    //     })
    // }


    

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_shortcut') } }>
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
                        <Textbox label="Shortcut" autoFocus modelName="shortcut" className="col-md-4"></Textbox>
                        <Textbox label="Icon" modelName="icon" required="false" className="col-md-4"></Textbox>
                        <Textbox label="Url" modelName="url" required="false" className="col-md-4"></Textbox>

                    </div>

                    <div className="row">
                       
                        {/* <Selectbox modelName="user_id" label="User" required="false" className="col-md-4" value={this.state.formData.user} statusSelect ></Selectbox> */}

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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddShortcut));