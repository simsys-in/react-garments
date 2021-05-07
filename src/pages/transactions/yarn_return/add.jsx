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


class AddYarn_Return  extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                refno : "",
                order_id : "",
                narration : "",
                status : 'active',
                vou_date : moment(),
                yarn_return_inventory : [
                    {  
                        fabrics : '',
                        gsm : '',
                        counts : '',
                        qtybag_per :'' ,
                        qty_bag : '',
                        qty_kg : '',
                      
                    }
                ]
            },
            companiesList : [],
            ledger_name : [],
            process : [],
            order_no : [],
            fabric : [],
            color : [],
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

    getProcessSB = () => {
        
        getRequest('garments/getAllProcessSB').then(data => {
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
        
        getRequest('garments/getFabricsSB').then(data => {
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

        getRequest('garments/getOrderSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    order_no : data.data
                })
            }
        })
    }
    getColorSB = () => {
        
        getRequest('garments/getAllColorSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    color : data.data
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

    getYarn_Return  = () => {
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/yarn_return?id=" + this.id).then(data => {
                data.data.dob = moment(data.data.dob)
                // console.log(data.data)
                data.data.vou_date = moment(data.data.vou_date)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.getNextYarnReturnVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextYarnReturnVouNo = () => {
        getRequest('garments/getNextYarnReturnVouNo').then(data => {
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

    getProcessSBForOrderID = (order_id) => {
        getRequest('garments/getProcessSBForOrderID?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    process : data.data
                })
            }
        })
    }

    componentDidMount() {
        this.getOrderSB();
        this.getLedgerNameSB();
        this.getProcessSB();
        this.getFabricsSB();
        this.getColorSB();
        this.getYarn_Return ();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Yarn Return ',
            metaDescription: 'Add Yarn Return '
          });

          if(this.id)
          {
            seo({
                title: 'Edit Yarn Return ',
                metaDescription: 'Edit Yarn Return '
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('garments/yarn_return?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_yarn_return')
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

    addYarn_return_inventory = () => {
        var newYarn_return_inventory = {
            fabrics : '',
            gsm : '',
            counts : '',
            qtybag_per :'' ,
            qty_bag : '',
            qty_kg : '',
        }

        var oldYarn_return_inventoryArray = this.state.formData.yarn_return_inventory;

        oldYarn_return_inventoryArray.push(newYarn_return_inventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_return_inventory : oldYarn_return_inventoryArray
            }
        })
    }

    setTotalKgs = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_return_inventory = values.yarn_return_inventory;
        var total_kg = 0;
        yarn_return_inventory.map((item, index) => {
            total_kg += item.qty_kg;

            if(index === yarn_return_inventory.length - 1)
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
    setTotalBags = () =>{
        var values = this.formRef.current.getFieldValue();
        var yarn_return_inventory = values.yarn_return_inventory;
        var total_bag = 0;
        yarn_return_inventory.map((item, index) => {
            total_bag += Number(item.qty_bag);

            if(index === yarn_return_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_bag_total : total_bag
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_bag_total : total_bag
                    })
                })
            }

        })
    }


    setQTYKG = (ev, index) => {
        var values = this.formRef.current.getFieldValue();
        var fabric = values.yarn_return_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

        values.yarn_return_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_return_inventory : values.yarn_return_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            this.setTotalKgs();
            this.setTotalBags();

        })
    }
    removeYarn_return_inventory = (index) => {
        var oldYarn_return_inventoryArray = this.state.formData.yarn_return_inventory;

        oldYarn_return_inventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                yarn_return_inventory : oldYarn_return_inventoryArray
            }
        })
        this.setTotalBags();
        this.setTotalKgs();
    }
    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.process_id) && issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno) )
        {
            var selectedItems = _.filter(FORMDATA.yarn_return_inventory, (item) => {
                // console.log(item)
                return  item.fabric_id && item.counts && item.qtybag_per && item.qty_bag && item.qty_kg   &&item.gsm   ;
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
   

    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_yarn_return') } }>
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
                       
                       
                        <Selectbox modelName="ledger_id" label="Ledger Name" autoFocus className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                        <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                        {/* <Textbox label="Vou No" modelName="vouno"  className="col-md-4"></Textbox> */}
                       <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID} className="col-md-4" required= "false" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>

                    </div>
                    <div className="row">
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-4"></Textbox> */}
                        {/* <Textbox label="Vou No" modelName="vou" required="false" className="col-md-4"></Textbox> */}

                        <Selectbox modelName="process_id" label="Process" className="col-md-4" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                       <Textbox label="Ref No" modelName="refno" required="false"  className="col-md-4"></Textbox>
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>


                    </div>
                    {/* <div className="row">
                    */}

                    {/* </div> */}
                    
                                       <div className="row">
                                       <div className="col-md-12 table-scroll">
                             <Divider plain orientation="left" >Products</Divider>  

                            <table id="dynamic-table" className="table table-bordered">
                                <thead >
                                    <tr>
                                        <th width="200px">Fabric </th>
                                        <th>GSM</th>
                                        <th>Count</th>
                                        <th>Qty Per</th>
                                        <th>Qty Bags</th>
                                        <th>Qty KGs</th>
                                        <th><Button type="primary" onClick={this.addYarn_return_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                <Form.List name="yarn_return_inventory">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <tr>
                                                <td>
                                                    <Selectbox noPlaceholder withoutMargin className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']} value={[field.name, 'fabric_id']} showLabel={false} options={this.state.fabric} required="false" label="Fabric"></Selectbox>
                                                </td>
                                                <td>
                                                    <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'gsm' ]} required="false" modelName={[field.name, 'gsm']} value={field.gsm} label="Gsm"></Numberbox>
                                                </td>
                                                <td>

                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'counts' ]} required = 'false' modelName={[field.name, 'counts']} value={field.counts} label="Counts"></Numberbox>

                                                </td>
                                                <td>
                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qtybag_per' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } required="false" modelName={[field.name, 'qtybag_per']} value={field.qtybag_per} label="Qty per"></Numberbox>
                                                            
                                                </td>
                                                <td>
                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qty_bag' ]} onChange={ (ev) => this.setQTYKG(ev, field.fieldKey) } required = "false"  textAlign={'right'} modelName={[field.name, 'qty_bag']} value={field.qty_bag} label="Qty Bags"></Numberbox>
                                                
                                                            </td>
                                                <td>
                                                            <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qty_kg' ]} disabled required ='false' modelName={[field.name, 'qty_kg']} value={field.qty_kg} label="Qty Kg"></Numberbox>

                                                            </td>
                                                            <td>
                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarn_return_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}
                                                </td>
                                            </tr>
                                     )
                                            
                                     )
                                 ) }
                                </Form.List>
                                <tr>
                                <td colSpan={4} style={{textAlign:'right'}}> <h6> Total</h6></td>   
                                    <td>   <Numberbox noPlaceholder modelName="inventory_qty_bag_total" withoutMargin showLabel={false} className="col-md-12" disabled value={this.state.formData.inventory_qty_bag_total} 
                                     label="Total Qty Bags" required="false"></Numberbox></td>
                                    <td>   <Numberbox noPlaceholder modelName="inventory_qty_kg_total" withoutMargin showLabel={false} className="col-md-12" disabled value={this.state.formData.inventory_qty_kg_total} label="Total Qty KGs" required="false"></Numberbox></td>
                               
                                </tr>
                                </tbody>
                               
                            </table>
                           </div>
                      
               
<br></br>
                         </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddYarn_Return ));