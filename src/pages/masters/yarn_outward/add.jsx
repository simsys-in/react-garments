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


let interval;


class AddYarn_Outward extends PureComponent{
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
                yarn_outward_inventory : [
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

    getYarn_Outward = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("masters/yarn_outward?id=" + this.id).then(data => {
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

    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getYarn_Outward();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Yarn Outward',
            metaDescription: 'Add Yarn Outward'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Yarn Outward',
                metaDescription: 'Edit Yarn Outward'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('masters/yarn_outward?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/masters/list_yarn_outward')
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

    addYarn_outward_inventory = () => {
        var newYarn_outward_inventory = {
            fabrics : '',
            gsm : '',
          counts : '',
          qtybag_per :'' ,
          qty_bag : '',
          qty_kg : '',
           
        }

        var oldYarn_outward_inventoryArray = this.state.formData.yarn_outward_inventory;

        oldYarn_outward_inventoryArray.push(newYarn_outward_inventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_outward_inventory : oldYarn_outward_inventoryArray
            }
        })
    }

    setTotalKgs = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_outward_inventory = values.yarn_outward_inventory;
        var total_kg = 0;
        yarn_outward_inventory.map((item, index) => {
            total_kg += item.qty_kg;

            if(index === yarn_outward_inventory.length - 1)
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
        var fabric = values.yarn_outward_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

        values.yarn_outward_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_outward_inventory : values.yarn_outward_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            this.setTotalKgs();
        })
    }
    removeYarn_outward_inventory = (index) => {
        var oldYarn_outward_inventoryArray = this.state.formData.yarn_outward_inventory;

        oldYarn_outward_inventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_outward_inventory : oldYarn_outward_inventoryArray
            }
        })
    }

    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/masters/list_yarn_outward') } }>
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
                    <Textbox label="Vou No" modelName="vouno"  className="col-md-4"></Textbox>

                    <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                    <Selectbox modelName="from_process_id" label=" From Process" className="col-md-4" options={this.state.process} value={this.state.formData.from_process_id}  ></Selectbox>

                   
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-6"></Textbox> */}

                    </div>
                    <div className="row">
                    <Selectbox modelName="to_process_id" label=" To Process" className="col-md-4" options={this.state.process} value={this.state.formData.to_process_id}  ></Selectbox>
                    <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
                    {/* <Selectbox modelName="order_id" label="Order No" className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox> */}
                    <Selectbox modelName="order_id" label="Order No" className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>

                    </div>
                    <div className="row">
                                    <Textbox label="Ref No" modelName="refno"  className="col-md-4"></Textbox>

                    </div>
                    <div className="row">
                             <div className="col-md-12">
                             <Divider plain orientation="left" >Products</Divider>                                <Form.List name="yarn_outward_inventory">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row">
                                                    <div className="col-md-11">
                                                        <div className="row">
                                                            <Selectbox showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={field.name,'fabric_id'} options={this.state.fabric} label="Fabric"></Selectbox>
                                                            <Textbox showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={field.gsm} label="Gsm"></Textbox>

                                                            <Textbox showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'counts' ]} required = 'false' modelName={[field.name, 'counts']} value={field.counts} label="Counts"></Textbox>

                                                            <Numberbox showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'qtybag_per' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } modelName={[field.name, 'qtybag_per']} value={field.qtybag_per} label="Qty per"></Numberbox>
                                                            <Numberbox showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'qty_bag' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } modelName={[field.name, 'qty_bag']} value={field.qty_bag} label="Qty Bags"></Numberbox>

                                                            <Numberbox showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'qty_kg' ]} disabled modelName={[field.name, 'qty_kg']} value={field.qty_kg} label="Qty Kg"></Numberbox>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-1">
                                                        { index === 0  && <Button onClick={this.addYarn_outward_inventory} style={{ marginLeft : 10 }}>+</Button> }
                                                        { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarn_outward_inventory(index)} type="primary">-</Button>}
                                                    </div>
                                                 </div>
                                     )
                                            
                                     )
                                 ) }
                                </Form.List>        
                           </div>
                         </div>

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
                            <div className="col-md-12" align="right">
                                <Numberbox modelName="inventory_qty_kg_total" value={this.state.formData.inventory_qty_kg_total} disabled label="Total KGs" ></Numberbox>
                            </div>
                        </div>

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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddYarn_Outward));