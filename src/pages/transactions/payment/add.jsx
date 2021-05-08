import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider, message  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';
import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';
import Datebox from '../../../components/Inputs/Datebox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import Checkbox from 'antd/lib/checkbox/Checkbox';
import _ from 'lodash';
import { issetNotEmpty } from '../../../helpers/formhelpers';



let interval;


class AddPayment extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                narration : '',
                refno : '',
                vou_date : moment(),
                ledger_id : "",
                ledger2_id : '',
                accounts : [
                    {  
                        vou_id: null,
                        ledger_id: null,
                        narration : '',
                        percentage: "",
                        amount: "",

                        
                      
                    }
               
                ],
              
            },

    
            ledger_name : [],
           account_ledger: [] 
            
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      getAllLedgerSB = () => {
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

    getAccountLedgerSB = () => {
        getRequest('garments/getAccountLedgerSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    account_ledger : data.data
                })
            }
        })
    } 
    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var accounts = values.accounts;
        var total_amount = Number(values.amount);
        
        accounts.map((item, index) => {
                total_amount += Number(item.amount);
                               
                if(index === accounts.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            
                            inventory_amount_total : Number(total_amount),
                            
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            
                            inventory_amount_total : Number(total_amount),
                            
                        })
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

    getPayment = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/payment?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            
               
            })

        }
        else{

            this.getNextPaymentVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    
    

    componentDidMount() {

        this.getAllLedgerSB();
        this.getAccountLedgerSB();
        this.setTOTAL();
        this.getPayment();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }

    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Payment',
            metaDescription: 'Add Payment'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Payment',
                metaDescription: 'Edit Payment'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/payment?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_payment')
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

   

   
   
   

  
    getNextPaymentVouNo = () => {
        getRequest('garments/getNextPaymentVouNo').then(data => {
            // console.log(data);
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        vouno : data.data.max_vou_no
                    }
                },() => {
                    this.formRef.current.setFieldsValue({
                        vouno : this.state.formData.vouno
                    })
                })
            }
        })
    }


    addAccounts = () => {
        var newAccounts = {
            vou_id: null,
            ledger_id: null,
            narration:'',
            percentage: "",
            amount: "",
        }

        var oldAccountsArray = this.state.formData.accounts;

        oldAccountsArray.push(newAccounts);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                accounts : oldAccountsArray

            }
        })
    }

   
    removeAccounts = (index) => {
        var oldAccountsArray = this.state.formData.accounts;

        oldAccountsArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                accounts : oldAccountsArray
            }
        })
        this.setTOTAL();
    }

    
    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.ledger2_id) && issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date)  )
        {
            var selectedItems = _.filter(FORMDATA.accounts, (item) => {
                // console.log(item)
                return  item.ledger_id  && item.amount   ;
            });

            if(selectedItems.length > 0)
            {
                return false;
            }
            else{
                return true;
            }
        }
        else{
            return true;
        }
    }
   

    

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_payment') } }>
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
                        <Datebox label="Vou Date" autoFocus value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                        <Textbox label="Ref No" modelName="refno" required="false" className="col-md-4"></Textbox>
                        <Selectbox modelName="ledger_id"  label="Ledger Name" className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id}  ></Selectbox>
                   </div>


                  
                        

                   <div className="row">
                        <Selectbox modelName="ledger2_id" label="Accounts Ledger" className="col-md-4" options={this.state.account_ledger} value={this.state.formData.ledger2_id} required="false"  ></Selectbox>
                        <Numberbox modelName="amount"  label="Amount" className="col-md-4" onChange={this.setTOTAL} ></Numberbox>
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                   </div>
                      


                  
                   <div className="row">
                        {/* <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox> */}
                        <Textbox label="Track No" modelName="slno" required="false" className="col-md-4"></Textbox>
                     {/* <Textbox label="Track No" modelName="narration" required="false" className="col-md-4"></Textbox> */}
                   {/* </div> */}
                  

                    <br/>
                    <div className="row">

                        <div className="col-md-12 table-scroll">
                        <Divider orientation="left" plain> Details</Divider>

                            <table id="dynamic-table" className="table table-bordered table-scroll">
                                    {/* <thead>
                                        <tr>
                                            <th colSpan="1" className="primary-header" style={{ backgroundColor : 'lightblue' }} > <b> COLOR</b></th>
                                            <th colSpan={this.state.size_data_for_order.length} className="primary-header" style={{ backgroundColor : 'grey' }} > <b> </b></th>
                                        </tr>
                                    </thead> */}
                                    <thead>
                                        <tr>
                                            <th> <b> Accounts Ledger</b></th>
                                            <th> <b> Description</b></th>
                                            <th> <b> %</b></th>
                                            <th> <b> Amount</b></th>
                                            
                                            <th width="10px">
                                                <Button type="primary"  onClick={this.addAccounts} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="accounts">
                                                        { (fields, { add, remove } )=> (
                                                            fields.map((field, index) => (
                                                                <tr key={index}>
                                                                {/* <Fragment> */}
                                                                
                                                                                                                               
                                                                <td>
                                                                <Selectbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'ledger_id' ]}  modelName={[field.name, 'ledger_id']} value={[field.name, 'ledger_id']} options={this.state.account_ledger} label="Ledger"></Selectbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Textbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'narration' ]}  modelName={[field.name, 'narration']} value={[field.name, 'narration']}  label="Description"></Textbox>
                                                                </td>
                                                                
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'percentage' ]}  modelName={[field.name, 'percentage']} value={[field.name, 'percentage']}  label="Percentage"></Numberbox>
                                                                </td>
                                                               
                                                                <td>
                                                                <Numberbox noPlaceholder required="false" withoutMargin className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'amount' ]}  modelName={[field.name, 'amount']} value={[field.name, 'amount']} label="Amount"  onChange={(ev) => this.setTOTAL()}></Numberbox>
 
                                                                </td>
                                                                
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeAccounts(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
                                                    <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={3}> <h6> Total</h6></td>

                                            <td > <h6> { this.state.formData.inventory_amount_total }</h6></td>


                                        </tr>
                                           
                                            

                                            {/* ); */}
                                        {/* })} */}
                                    </tbody>
                                </table>
                        </div>
                        
                    </div>
                    <br/>
                   
                       
                      
                   <div className="row">
                       <div className="col-md-12">
                           <Form.Item>
                               <Button type="primary" disabled={ this.checkButtonDisabled() } onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddPayment));




