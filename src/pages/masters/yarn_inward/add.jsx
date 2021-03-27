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


let interval;


class AddYarn_Inward extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active',
                vou_date : moment(),
                yarn_inward_inventory : [
                    {  
                        fabrics : '',
                        gsm : '',
                        counts : '',
                        qtybag_per :'' ,
                        qty_bag : '',
                        qty_kg : '0',
                      
                    }
                ]
            },
            companiesList : [],
            ledger_name : [],
            process : [],
            order_no : [],
            fabric : [],
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      getLedgerNameSB = () => {
        getRequest('masters/getLedgerNameSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    ledger_name : data.data
                })
            }
        })
    }

    getProcessSB = () => {
        
        getRequest('masters/getProcessSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    process : data.data
                })
            }
        })
    }

    getFabricsSB = () => {
        
        getRequest('masters/getFabricsSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric : data.data
                })
            }
        })
    }

    getOrderSB = () => {

        getRequest('masters/getOrderSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    order_no : data.data
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

    getYarn_Inward = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("masters/yarn_inward?id=" + this.id).then(data => {
                data.data.dob = moment(data.data.dob)
                data.data.vou_date = moment(data.data.vou_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextFabricInwardVouNo = () => {
        getRequest('transactions/getNextFabricInwardVouNo').then(data => {
            console.log(data);
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        vouno : data.max_vou_no
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
        this.getOrderSB();
        this.getNextFabricInwardVouNo();
        this.getLedgerNameSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getYarn_Inward();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Yarn Inward',
            metaDescription: 'Add Yarn Inward'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Yarn Inward',
                metaDescription: 'Edit Yarn Inward'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('masters/yarn_inward?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_yarn_inward')
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

    addYarn_inward_inventory = () => {
        var newYarn_inward_inventory = {
         fabrics : '',
            gsm : '',
          counts : '',
          qtybag_per :'' ,
          qty_bag : '',
          qty_kg : '',
           
        }


        var oldYarn_inward_inventoryArray = this.state.formData.yarn_inward_inventory;

        oldYarn_inward_inventoryArray.push(newYarn_inward_inventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_inward_inventory : oldYarn_inward_inventoryArray
            }
        })
    }

    setTotalKgs = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_inward_inventory = values.yarn_inward_inventory;
        var total_kg = 0;
        yarn_inward_inventory.map((item, index) => {
            total_kg += item.qty_kg;

            if(index === yarn_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_kg_total : total_kg
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_kg_total : total_kg
                    })
                })
            }

        })
    }

    setQTYKG = (ev, index) => {
        var values = this.formRef.current.getFieldValue();
        var fabric = values.yarn_inward_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

        values.yarn_inward_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_inward_inventory : values.yarn_inward_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            this.setTotalKgs();
        })
    }
    removeYarn_inward_inventory = (index) => {
        var oldYarn_inward_inventoryArray = this.state.formData.yarn_inward_inventory;

        oldYarn_inward_inventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_inward_inventory : oldYarn_inward_inventoryArray
            }
        })
    }

    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_yarn_inward') } }>
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
                       
                        <Selectbox modelName="ledger_id" label="Ledger Name" className="col-md-12" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                    </div>
                    <div className="row">
                    <Textbox label="Vou No" modelName="vouno" required="false" className="col-md-4"></Textbox>

                        <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-4"></Textbox> */}
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>

                    </div>
                    <div className="row">
                        <Selectbox modelName="process_id" label="Process" className="col-md-4" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                        <Selectbox modelName="order_id" label="Order No" className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        <Textbox label="Ref No" modelName="refno"  className="col-md-4"></Textbox>

                    </div>
                   
                    <div className="row">
                             <div className="col-md-12">
                             <Divider plain orientation="left" >Products</Divider>
                                <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row">
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Fabric" label="Fabric" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="GSM" label="GSM" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Count" label="Count" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty Per" label="Qty Per" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty Bags" label="Qty Bags" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty KGs" label="Qty KGs" required="false"></Textbox>
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <Button type="primary" onClick={this.addYarn_inward_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                    </div>
                                </div>
                                <Form.List name="yarn_inward_inventory">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                    <div className="col-md-11">
                                                        <div className="row">
                                                            <Selectbox noPlaceholder withoutMargin className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]}  required="false" modelName={[field.name, 'fabric_id']} value={field.name,'fabric_id'} showLabel={false} options={this.state.fabric} label="Fabric"></Selectbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={field.gsm} required="false" label="GSM"></Textbox>

                                                            <Textbox withoutMargin noPlaceholder showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'counts' ]} required="false" modelName={[field.name, 'counts']} value={field.counts} label="Counts"></Textbox>

                                                            <Numberbox noPlaceholder withoutMargin className="col-md-2" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qtybag_per' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } modelName={[field.name, 'qtybag_per']} value={field.qtybag_per} label="Qty per"></Numberbox>


                                                            <Numberbox noPlaceholder withoutMargin className="col-md-2" required="false" field={field} showLabel={false} fieldKey={[ field.fieldKey, 'qty_bag' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } modelName={[field.name, 'qty_bag']} value={field.qty_bag} label="Qty Bags"></Numberbox>

                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'qty_kg' ]} disabled required="false"modelName={[field.name, 'qty_kg']} value={field.qty_kg} label="Qty Kg"></Numberbox>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarn_inward_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}
                                                    </div>
                                                 </div>
                                     )
                                            
                                     )
                                 ) }
                                </Form.List>
                           </div>
                         </div>
                         <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                            <div className="col-md-11">
                                <div className="row">
                                    <div className="col-md-6"></div>
                                    <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Total" label="Total" required="false"></Textbox>
                                    <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty Bags" label="Qty Bags" required="false"></Textbox>
                                    <Textbox modelName="inventory_qty_kg_total" withoutMargin showLabel={false} className="col-md-2" disabled value={this.state.formData.inventory_qty_kg_total} label="Total Qty KGs" required="false"></Textbox>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-md-12" align="right">
                                <Numberbox modelName="inventory_qty_kg_total" value={this.state.formData.inventory_qty_kg_total} disabled label="Total KGs" ></Numberbox>
                            </div>
                        </div> */}
                     {/* <div className="row">
                        <div className="col-md-12">
                            <Divider plain orientation="left" >Products</Divider>
                            <div className="row">
                            <Selectbox modelName="fabric_id" label="Fabric" className="col-md-6" options={this.state.fabric} value={this.state.fabric_id}  ></Selectbox>
                                <Textbox label="Gsm" modelName="gsm"  className="col-md-4"></Textbox>
                                <Textbox label="Counts" modelName="counts"  className="col-md-4"></Textbox>
                            </div>

                            <div className="row">
                            <Numberbox label="Qty per" className="col-md-4" max={100}  min={0} modelName="qtybag_per"></Numberbox>
                            <Numberbox label="Qty Bags" className="col-md-4" max={100}  min={0} modelName="qty_bag"></Numberbox>
                            <Numberbox label="Qty Kgs" className="col-md-4" max={100} disabled min={0} modelName="qty_kg"></Numberbox>

                            </div>
                        </div>
                    </div> */}

                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary" disabled={ this.state.buttonDisabled }  htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddYarn_Inward));