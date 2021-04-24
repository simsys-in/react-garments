import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider, message  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';
import { issetNotEmpty } from '../../../helpers/formhelpers';



let interval;


class AddProductDetails extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active',
                size_details : [],
                size1_total : 0,
                size2_total : 0,
                size3_total : 0,
                size4_total : 0,
                size5_total : 0,
                size6_total : 0,
                size7_total : 0,
                size8_total : 0,
                size9_total : 0,
                size1_rate : 0,
                size2_rate : 0,
                size3_rate : 0,
                size4_rate : 0,
                size5_rate : 0,
                size6_rate : 0,
                size7_rate : 0,
                size8_rate : 0,
                size9_rate : 0,
            },
            size_data_for_order : [],
            unit_data : [],
            ledger_name : [],
            product_data: [],
            process : [],
            order_no : [],
            fabric : [],
            color_data : [],
            size_data : [],
            size_details: []
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

     

    getProductSB = () => {

        getRequest('garments/getAllProductSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    product_data : data.data
                })
            }
        })
    }

    getSizeSB = () => {

        getRequest('garments/getAllSizeSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    size_data : data.data
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

    getProductDetails = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/productDetails?id=" + this.id).then(data => {
                this.setState({
                    ...this.state,
                    formData : data.data[0]
                }, () => {
                    this.formRef.current.setFieldsValue(data.data[0]);
                    if(issetNotEmpty(this.state.formData.size_id))
                    {
                        this.onSizeChange(this.state.formData.size_id)
                    }
                })
   
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

   
    

    componentDidMount() {
       
        this.getProductSB();
        this.getSizeSB();
        this.getProductDetails();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Product Details',
            metaDescription: 'Add Product Details'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Product Details',
                metaDescription: 'Edit Product Details'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/productDetails?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_product_details')
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

   
   
    
    onSizeChange = (size_id) => {
        getRequest('garments/getSizeDetails?size_id=' + size_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size_details : data.data
                    },
                },()=>{
                    this.formRef.current.setFieldsValue({
                        size_details : this.state.formData.size_details
                    })
                
                })
            }
        })
    }

    onRateChange = (ev, index) => {
        var formData = this.state.formData;
        var size_details = formData.size_details;
        var currentItem = size_details[index];

        currentItem['size' + Number(Number(index) + 1) + "_rate"] = ev.target.value;

        this.setState({
            ...this.state,
            formData : formData
        }, () => {
            this.formRef.current.setFieldsValue(this.state.formData)
        })

    }

    onProductChange =(product_id) => {
        getRequest('garments/getPrefilledProductDetails?product_id=' + product_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : data.data
                }, () => {
                    this.id = this.state.formData.id;
                    this.formRef.current.setFieldsValue(this.state.formData);
                    this.onSizeChange(this.state.formData.size_id)
                })
            }
        })
    }
    
    
    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_product_details') } }>
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
                       <Selectbox modelName="product_id" required='true' label="Product" className="col-md-6" autoFocus options={this.state.product_data} onChange={this.onProductChange} value={this.state.formData.product_id}  ></Selectbox>

                       <Selectbox modelName="size_id" label="Size" className="col-md-6" required='true' options={this.state.size_data} value={this.state.formData.size_id} onChange={this.onSizeChange} ></Selectbox>

                    
                   </div>
                        

                   
                    <br/>
                    { this.state.formData.size_details.length > 0 &&
                    <div className="row">

                        <div className="col-md-12 table-scroll">
                        <Divider orientation="left" plain> Inventory</Divider>

                            <table id="dynamic-table" className="table table-bordered table-scroll">
                                    {/* <thead>
                                        <tr>
                                            <th colSpan="1" className="primary-header" style={{ backgroundColor : 'lightblue' }} > <b> COLOR</b></th>
                                            <th colSpan={this.state.size_data_for_order.length} className="primary-header" style={{ backgroundColor : 'grey' }} > <b> </b></th>
                                        </tr>
                                    </thead> */}
                                    <thead>
                                        <tr>
                                        
                                            <th width="100"> <b> Size</b></th>
                                           
                                            { this.state.formData.size_details.map((item, index) => 
                                                item !== "" && <th key={index} width="100px"> <b> {item}</b></th>
                                            ) }

                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        
                                        <td> <b> Open Stock</b></td>
                                        {
                                            this.state.formData.size_details.map((size, index) => (
                                                size !== "" &&
                                                <td key={index} width="100px">
                                                    <Numberbox className="col-md-12" required="false" showLabel={false} min={0} modelName={'size' + Number(Number(index) + 1) + "_total"} value={this.state.formData['size' + Number(Number(index) + 1) + "_total"]} noPlaceholder  withoutMargin ></Numberbox>    
                                                </td>))
                                        }
                                        
                                    </tr>
                                    <tr>
                                        
                                        <td> <b> Rate</b></td>
                                        {
                                            this.state.formData.size_details.map((size, index) => (
                                                size !== "" &&
                                                <td key={index} width="100px">
                                                    <Numberbox className="col-md-12" required="false" showLabel={false} min={0}  modelName={'size' + Number(Number(index) + 1) + "_rate"} value={this.state.formData['size' + Number(Number(index) + 1) + "_rate"]} noPlaceholder  withoutMargin ></Numberbox>    
                                                </td>))
                                            }
                                        
                                    </tr>
                                            
                                    </tbody>
                                </table>
                        </div>
                        
                    </div>
                }
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddProductDetails));




