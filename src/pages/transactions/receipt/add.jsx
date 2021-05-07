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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';
import { issetNotEmpty } from '../../../helpers/formhelpers';


let interval;


class AddReceipt extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                refno : "",
                narration : "",

                status : 'active',
                vou_date : moment(),
                refno : "",
                accounts : [
                    {  
                        ledger : '',
                        narration : '',
                        percentage : '',
                        amount :'' ,
                     
                      
                    }
                ]
            },
            companiesList : [],
            ledger_group : [],
            ledger_name : [],
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

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
    getLedgerGroupSB = () => {
        
        getRequest('garments/getLedgerGroupSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    ledger_group : data.data
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

    getReceipt = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/receipt?id=" + this.id).then(data => {
                data.data.dob = moment(data.data.dob)
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.getNextReceiptVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

   
    getNextReceiptVouNo = () => {
        getRequest('garments/getNextReceiptVouNo').then(data => {
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

    componentDidMount() {
        this.getLedgerNameSB();
        this.setTotalAmount();
        this.getLedgerGroupSB();
        this.getReceipt();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Receipt',
            metaDescription: 'Add Receipt'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Receipt',
                metaDescription: 'Edit Receipt'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/receipt?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_receipt')
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

    addAccounts = () => {
        var newAccounts = {
            ledger : '',
            narration : '',
            percentage : '',
            amount :'' ,
           
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

    setTotalAmount = () =>{
        var values = this.formRef.current.getFieldValue();
        var accounts = values.accounts;
        var total_amount = 0;
        accounts.map((item, index) => {
            total_amount += Number(item.amount);

            if(index === accounts.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_amount_total : total_amount
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_amount_total : total_amount
                    })
                })
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
        this.setTotalAmount();
    }
    
    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_receipt') } }>
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
                       
                    <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                    <Textbox label="Vou No" required="false" modelName="vouno"  className="col-md-4"></Textbox>
                    <Textbox label="Ref No" required="false" modelName="refno"  className="col-md-4"></Textbox>

                    </div>
                  
                  
                    <div className="row">
                        <Selectbox modelName="ledger_id" label="Ledger Name" autoFocus className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                    <Selectbox modelName="ledger2_id" label="Accounts Ledger" className="col-md-4" options={this.state.ledger_group} value={this.state.formData.ledger2_id} required="false" onChange={this.getLedgerForLedgerGroup} ></Selectbox>

                    <Textbox label="Amount" required="false" modelName="amount"  className="col-md-4"></Textbox>
                    {/* <Selectbox modelName="order_id" label="Order No" className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox> */}

                    </div>
                    <div className="row">

                    <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                    <Textbox label="Track No" required="false" modelName="slno"  className="col-md-4"></Textbox>
                    </div>
                   
                    <div className="row">
                    <div className="col-md-12 table-scroll">
                             <Divider plain orientation="left" >Products</Divider>  
                             <table id="dynamic-table" className="table table-bordered">
                             <thead >
                                    <tr>
                                        <th width="200px">Accounts Ledger </th>
                                        <th>Description</th>
                                        <th>%</th>
                                        <th>Amount</th>
                                       
                                        <th> <Button type="primary" onClick={this.addAccounts} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="accounts">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <tr>
                                                <td><Selectbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'ledger_id' ]} modelName={[field.name, 'ledger_id']} value={field.name,'ledger_id'} required="false" options={this.state.ledger_group} label="Accounts Ledger"></Selectbox></td>

                                                <td><Textbox noPlaceholder withoutMargin required="false" showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'narration' ]} modelName={[field.name, 'narration']} value={field.narration} label="Narration"></Textbox></td>

                                                <td> <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'percentage' ]} required='false' modelName={[field.name, 'percentage']} value={field.percentage} label="Percentage"></Numberbox></td>

                                                

                                               
                                                <td><Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'amount' ]} required='false'
                                                  modelName={[field.name, 'amount']} value={field.amount} label="Amount"  onChange={(ev) => this.setTotalAmount(ev,field.fieldKey)}></Numberbox></td>

                                                <td>  { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeAccounts(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}</td>
                                            </tr>
                                               )
                                            
                                               )
                                           ) }
                                          </Form.List> 
                                          <tr>
                                          <td colSpan={3} style={{textAlign:'right'}}> <h6> Total</h6></td> 

                                <td><Numberbox noPlaceholder modelName="inventory_amount_total" withoutMargin showLabel={false} className="col-md-12" disabled value={Number(this.state.formData.inventory_amount_total).toFixed(2)} label="Total Amount" required="false"></Numberbox></td>  
                                  
                               
                                          </tr>
                                </tbody>
                               
                             </table>
                           </div>
                         </div>

<br></br>
                    
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary"  onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddReceipt));