import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Divider,Input  } from 'antd';
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


let interval;

const OnOffStatus = [
    {
        name : "On",
        value : '1'
    },
    {
        name : "Off",
        value : '0'
    },
]


class AddVoucher extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                voutype : "",
                vou_route : "",
                tbl	 : "",
                parent_id : "",
                template_route : "",
                print_route : "",
                smstemplate : "",
                smsstatus : "",
                status : "",
                vou_prefix : "",
                vou_suffix : "",
                vouno_start : "",
                ledger2_id : "",
                print_title : "",
                terms_condition : "",

            
                vou_date : moment(),
                narration : "",
                route_accounts : [
                    {  
                        ledger_id : '',
                        description: '',
                        percentage : '',	
                         amount : ''
                      
                    }
                ]
            },
            companiesList : [],
            ledger_group : [],
            ledger : []
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

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

    getLedgerForLedgerGroup = (ledger_group_id) => {
        getRequest('garments/getLedgerForLedgerGroup?ledger_group_id=' + ledger_group_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    ledger : data.data
                })
            }
        })
    }

    setTOTAL =() => {
        var values =  this.formRef.current.getFieldValue();
        var route_accounts = values.route_accounts;
        
        var total_amount = 0;
        route_accounts.map((item, index) => {
           
            total_amount += Number(item.amount);

            if(index === route_accounts.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                       amount_total : total_amount
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                       amount_total : total_amount
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

    getVoucher = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/voucher?id=" + this.id).then(data => {
                data.data.vou_date = moment(data.data.vou_date)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.getLedgerForLedgerGroup(data.data.ledger2_id)
                this.setTOTAL();
            })

        }
        else{

            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }


   
    componentDidMount() {
        this.getLedgerGroupSB();
        this.setTOTAL();
        this.getVoucher();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Voucher',
            metaDescription: 'Add Voucher'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Voucher',
                metaDescription: 'Edit Voucher'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/voucher?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_voucher')
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

    addRouteAccounts = () => {
        var newRouteAccounts = {
           ledger_id : '',
           description: '',
           percentage : '',	
            amount : ''
        }

        var oldRouteAccountsArray = this.state.formData.route_accounts;

        oldRouteAccountsArray.push(newRouteAccounts);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                route_accounts : oldRouteAccountsArray

            }
        })
    }

   
    removeRouteAccounts = (index) => {
        var oldRouteAccountsArray = this.state.formData.route_accounts;

        oldRouteAccountsArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                route_accounts : oldRouteAccountsArray
            }
        })
        this.setTOTAL();
    }

    

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_voucher') } }>
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
                            <Divider plain orientation="left" >VOUCHER</Divider>
                                    <div className="row">
                                        <Textbox label="Voucher" autoFocus modelName="voutype"  className="col-md-4"></Textbox>
                                        <Textbox label="Route" modelName="vou_route"  className="col-md-4"></Textbox>
                                        <Textbox label="Table"required="false" modelName="tbl"  className="col-md-4"></Textbox>
                                   </div>
                                   <br/>

                                    <div className="row">
                                        <Selectbox modelName="parent_id" required="false" label="Parent Voucher" className="col-md-4" options={OnOffStatus} value={this.state.formData.parent_id}  ></Selectbox>
                                        <Selectbox modelName="template_route" required="false" label="Template" className="col-md-4" options={OnOffStatus} value={this.state.formData.template_route}  ></Selectbox>
                                        <Selectbox modelName="print_route"  required="false" label="Print Format" className="col-md-4" options={OnOffStatus} value={this.state.formData.print_route}  ></Selectbox>
                                    </div>
                                            
                                    <div className="row">
                                        <Textbox label="SMS Template"  required="false" modelName="smstemplate" required="false" className="col-md-4"></Textbox>
                                        <Selectbox modelName="smsstatus" required="false" label="SMS" className="col-md-4" options={OnOffStatus} value={this.state.formData.smsstatus}  ></Selectbox>
                                        <Textbox modelName="icon" required="false" label="Icon" className="col-md-4"   ></Textbox>


                                    </div>

                                    <div className="row">
                                        <Selectbox modelName="status" required="false" label="Status" className="col-md-4" options={OnOffStatus} value={this.state.formData.status}  ></Selectbox>
                                    </div>


                                    
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-md-12">
                            <Divider plain orientation="left" >VOUCHER NO</Divider>
                                   <div className="row">
                                        <Textbox label="Prefix" modelName="vou_prefix" required="false"  className="col-md-4"></Textbox>
                                        <Textbox label="Suffix" modelName="vou_suffix" required="false" className="col-md-4"></Textbox>
                                        <Textbox label="Vou No Start" modelName="vouno_start" required="false" className="col-md-4"></Textbox>
                                   </div>

                        </div>
                        </div>
                  
                        <div className="row">
                        <div className="col-md-12">
                            <Divider plain orientation="left" >DETAILS</Divider>
                                   <div className="row">
                                        <Selectbox modelName="ledger2_id" label="Accounts Ledger" className="col-md-6" options={this.state.ledger_group} value={this.state.formData.ledger2_id} required="false" onChange={this.getLedgerForLedgerGroup} ></Selectbox>
                                        <Textbox label="Print Title" modelName="print_title" required="false" className="col-md-6"></Textbox>
                                        {/* <Textbox label="Terms Of Conditions" modelName="terms_condition" required="false" className="col-md-4"></Textbox> */}
                                        <Form.Item name={'terms_condition'} label="Terms And Conditions" className="col-md-8">
                                            <Input.TextArea addonBefore="Terms and Conditions"  />
                                        </Form.Item>
                                   </div>


                        </div>
                        </div>
                  

                  

                   
                   <div className="row">
                            <div className="col-md-12 table-scroll">
                            <Divider plain orientation="left" >Tables</Divider>
                            <table id="dynamic-table" className="table table-bordered">
                             <thead >
                                    <tr>
                                        <th width="200px">Accounts Ledger </th>
                                        <th width="200px">Description</th>
                                        <th>%</th>
                                        <th>Amount</th>
                                        <th><Button type="primary"  onClick={this.addRouteAccounts} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="route_accounts">
                                   { (fields, { add, remove } )=> (
                                       fields.map((field, index) => (
                                           <tr>
                                               <td>  <Selectbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'ledger_id' ]} modelName={[field.name, 'ledger_id']} value={[field.name, 'ledger']} options={this.state.ledger} label="Accounts Ledger"></Selectbox></td>

                                               <td> <Textbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'description' ]} modelName={[field.name, 'description']} value={[field.name, 'description']} label="Description"></Textbox></td>

                                               <td>   <Numberbox withoutMargin required="false" noPlaceholder className="col-md-12" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'percentage' ]} modelName={[field.name, 'percentage']} value={[field.name, 'percentage']} label="%"></Numberbox></td>

                                              <td>  <Numberbox withoutMargin required="false" noPlaceholder className="col-md-12"  showLabel={false} field={field} fieldKey={[ field.fieldKey, 'amount' ]}  modelName={[field.name, 'amount']} value={[field.name, 'amount']} label="Amount"  onChange={(ev) => this.setTOTAL(ev,field.fieldKey)}></Numberbox></td>

                                               <td> { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeRouteAccounts(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}</td>
                                           </tr>
                                            )
                                           
                                            )
                                        ) }
                                       </Form.List> 
                                       <tr>
                                            <td colSpan={3} style={{textAlign:'right'}}> <h6> Total</h6></td>

                                           
                                            <td > <Numberbox withoutMargin showLabel={false} className="col-md-12" modelName='amount_total' value={this.state.formData.total_weight} disabled label='Total Amount'></Numberbox></td>

                                       </tr>
                                </tbody>
                                {/* <tfoot> */}

                                {/* </tfoot> */}
                                </table>
                             </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddVoucher));