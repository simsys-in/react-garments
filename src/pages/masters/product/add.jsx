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
class AddProduct extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active',
              
            },
            unit_data : [],
            product_group_data : [],
            product_category_data : [],
            companiesList : []
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    getUnitSB = () => {
        getRequest('masters/getUnitSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    unit_data : data.data
                })
            }
        })
    }
    
    getProductGroupSB =() => {
        getRequest('masters/getProductGroupSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product_group_data : data.data
                })
            }
        })
    }

    getProductCategorySB = () => {
        getRequest('masters/getProductCategorySB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product_category_data : data.data
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

    getProduct = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("masters/product?id=" + this.id).then(data => {
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
        this.getUnitSB();
        this.getProductGroupSB();
        this.getProductCategorySB();
        this.getProduct();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Product',
            metaDescription: 'Add Product'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Product',
                metaDescription: 'Edit Product'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('masters/product?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_product')
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

    

    
    setGST = (ev) => {
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                gst : Number(this.state.formData.cgst) + Number(this.state.formData.sgst)
            }
        }, () => {
            var data = this.formRef.current.getFieldValue();
            var gst = Number(data.cgst) + Number(data.sgst)
            this.formRef.current.setFieldsValue({
                gst : gst
            });
        })
    }


    

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_product') } }>
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
                        <Textbox label="Product" autoFocus modelName="product" className="col-md-4"></Textbox>
                        <Selectbox modelName="product_group_id" label="Product Group" className="col-md-4" options={this.state.product_group_data} value={this.state.formData.product_group_id}  ></Selectbox>
                        <Selectbox modelName="product_category_id" label="Product Category" className="col-md-4" options={this.state.product_category_data} value={this.state.formData.product_category_id}  ></Selectbox>
                    </div>

                    <div className="row">
                        <Textbox label="QR Code" modelName="qrcode" required="false" className="col-md-4"></Textbox>
                        <Selectbox modelName="status_id" label="Status" className="col-md-4" value={this.state.formData.status} statusSelect ></Selectbox>

                    </div>

                   

                   
                     
                    <div className="row">
                    <div className="col-md-12">
                            <Divider plain orientation="left" >Statury Info</Divider>
                            {/* <div className="row">
                            <Numberbox label="CGST %" className="col-md-6" max={ 100 } min={0} onChange={ this.setGST } modelName="cgst"></Numberbox>
                            <Numberbox label="SGST %" className="col-md-6" max={ 100} min={0} onChange={ this.setGST } modelName="sgst"></Numberbox>
                            
                            </div>
 */}
                            <div className="row">
                                {/* <Numberbox label="GST %" className="col-md-6" max={100} disabled min={0} modelName="gst"></Numberbox> */}
                                <Textbox required="false" className="col-md-6" label="HSN/SAC" modelName="hsnsac" ></Textbox>
                            </div>

                         </div>
                       
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <Divider plain orientation="left" >Price Details</Divider>
                            <div className="row">
                                <Textbox label="Pur Amount" modelName="purchase_amount" required="false" className="col-md-6"></Textbox>
                                <Textbox label="Sales Amount" modelName="sales_amount" required="false" className="col-md-6"></Textbox>
                            </div>

                            
                        </div>
                    </div>
                    <div className="row">    
                    <div className="col-md-12">
                            <Divider plain orientation="left" >Unit</Divider>
                            <div className="row">
                            <Selectbox modelName="unit_id" label="Unit" className="col-md-4" options={this.state.unit_data} value={this.state.formData.unit_id}  ></Selectbox>
                            <Selectbox modelName="unit2_id" label="Unit2" required="false" className="col-md-4" options={this.state.unit_data} value={this.state.formData.unit2_id}  ></Selectbox>
                            <Textbox modelName="unit2_convert" label="1" required="false" className="col-md-4"></Textbox>
                            </div>

                            
                        </div>

                         
                    </div>

                    
                    
                         
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddProduct));