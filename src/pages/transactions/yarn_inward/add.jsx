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
import Checkbox from 'antd/lib/checkbox/Checkbox';
import _ from "lodash";
import { issetNotEmpty } from '../../../helpers/formhelpers';


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
                refno : "",
                narration : "",
                status : 'active',
                vou_date : moment(),
                order_id: 0,
                yarn_inward_inventory : [
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
            getRequest("garments/yarn_inward?id=" + this.id).then(data => {
                data.data.dob = moment(data.data.dob)
                data.data.vou_date = moment(data.data.vou_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
                this.getProcessSBForOrderID(data.data.order_id)
                this.setTotalKgs();
            })

        }
        else{
            this.getNextYarnInwardVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getNextYarnInwardVouNo = () => {
        getRequest('garments/getNextYarnInwardVouNo').then(data => {
            console.log(data);
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
            putRequest('garments/yarn_inward?id=' + this.id, this.state.formData).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_yarn_inward')
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

    getYarnOutwardInventoryDetails = (ledger_id) =>{
        if(!this.id){

            getRequest('garments/getYarnOutwardInventoryDetails?ledger_id=' +ledger_id).then(data => {
                if(data.status === "info")
                {
                    var newArr = data.data;
                    this.state.formData.yarn_inward_inventory.map((item) => {
                        newArr.map(obj => {
                            if(obj.yarn_id === item.yarn_id)
                            {
                                // item.selected = true;
                                obj = Object.assign({},  item);
                                obj.selected = true;
                            }
                        })
                    })
                    // newArr.map(item => {
                    //     item.selected = true;
                    // })
    
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            yarn_inward_inventory : newArr
                        },
                    },()=>{
                        this.formRef.current.setFieldsValue({
                            yarn_inward_inventory : this.state.formData.yarn_inward_inventory
                        })
                        this.setTotalKgs();
                    })
                }
            })
        }
    }

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
        // var fabric = values.yarn_inward_inventory;
        // var currentFabric = yarn_inward_inventory[index] ;
        var total_kg = 0;
        var total_bags = 0;
        var total_bags_per = 0
        // currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;
        // values.yarn_inward_inventory.splice(index, 1, currentFabric);
        
        yarn_inward_inventory.map((item, index) => {
            if(item.selected){
                
                total_bags += item.qty_bag;
                total_bags_per += item.qtybag_per;
                item.qty_kg = Number(item.qty_bag) * Number(item.qtybag_per);
                total_kg += item.qty_kg;
    
                if(index === yarn_inward_inventory.length - 1)
                {
                    this.setState({
                        ...this.state,
                        formData : {
                            ...this.state.formData,
                            inventory_qty_kg_total : total_kg,
                            inventory_qty_bag_total : total_bags,
                            inventory_qtybag_per_total : total_bags_per
    
                        }
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            inventory_qty_kg_total : total_kg,
                            inventory_qty_bag_total : total_bags,
                            inventory_qtybag_per_total : total_bags_per
    
    
                        })
                    })
                }
            }else{
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_kg_total : total_kg,
                        inventory_qty_bag_total : total_bags,
                        inventory_qtybag_per_total : total_bags_per

                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_kg_total : total_kg,
                        inventory_qty_bag_total : total_bags,
                        inventory_qtybag_per_total : total_bags_per


                    })
                })
            }

        })
    }

       

    // setQTYKG = (ev, index) => {
    //     var values = this.formRef.current.getFieldValue();
    //     var fabric = values.yarn_inward_inventory;
    //     var currentFabric = fabric[index] ;
    //     currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

    //     values.yarn_inward_inventory.splice(index, 1, currentFabric);

    //     this.setState({
    //         ...this.state,
    //         formData : {
    //             ...this.state.formData,
    //             yarn_inward_inventory : values.yarn_inward_inventory
    //         }
    //     }, () => {
    //         // var data = this.formRef.current.getFieldValue();
    //         // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
    //         this.formRef.current.setFieldsValue(values);
    //         this.setTotalKgs();
    //     })
    // }
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
        this.setTotalKgs();
    }


    checkAllItems = (ev) => {
        var checked = ev.target.checked;
        var formData = this.state.formData;
        var inventories = formData.yarn_inward_inventory;
        console.log(checked);
        inventories.map((item, index) => {
            item.selected = checked;
            if(index === inventories.length - 1)
            {
                console.log(formData);
                this.setState({
                    ...this.state,
                    formData : formData
                }, () => {
                    this.formRef.current.setFieldsValue(formData);
                    this.setTotalKgs();
                })
            }
        })

    }
    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.process_id) && issetNotEmpty(FORMDATA.ledger_id) && issetNotEmpty(FORMDATA.vou_date) && issetNotEmpty(FORMDATA.vouno) && issetNotEmpty(FORMDATA.refno)   )
        {
            var selectedItems = _.filter(FORMDATA.yarn_inward_inventory, (item) => {
                console.log(item)
                return item.selected && item.fabric_id && item.counts && item.qtybag_per && item.qty_bag && item.qty_kg   &&item.gsm   ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_yarn_inward') } }>
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
                       
                        <Selectbox modelName="ledger_id" label="Ledger Name" autoFocus className="col-md-4" options={this.state.ledger_name} value={this.state.formData.ledger_id} onChange={this.getYarnOutwardInventoryDetails}></Selectbox>
                        <Datebox label="Vou Date" value={this.state.formData.vou_date} modelName="vou_date" className="col-md-4"></Datebox>
                    <Textbox label="Vou No" modelName="vouno"  className="col-md-4"></Textbox>
                    </div>
                    <div className="row">

                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-4"></Textbox> */}
                        <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID} className="col-md-4" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        <Selectbox modelName="process_id" label="Process" className="col-md-4" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                        <Textbox label="Ref No" modelName="refno" required="false" className="col-md-4"></Textbox>

                    </div>
                   
                    <div className="row">
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>

                    </div>
                   
                    <div className="row">
                    <div className="col-md-12 table-scroll">
                             <Divider plain orientation="left" >Products</Divider>
                             <table id="dynamic-table" className="table table-bordered">
                             <thead >
                                    <tr>
                                        <th width="100px"> <Checkbox onChange={this.checkAllItems} /></th>
                                        <th width="200px">Fabric </th>
                                        <th>GSM</th>
                                        <th>Count</th>
                                        <th>Qty Per</th>
                                        <th>Qty Bags</th>
                                        <th>Qty KGs</th>
                                        <th>   <Button type="primary" onClick={this.addYarn_inward_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                <Form.List name="yarn_inward_inventory">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                            <tr key={index}>
                                            <td style={{ textAlign : 'center' }}>
                                                                        <Form.Item
                                                                        valuePropName="checked"
                                                                        name={[field.name, "selected"]}
                                                                        fieldKey={[field.fieldKey, "selected"]}
                                                                        // initialValue={false}
                                                                        >
                                                                            <Checkbox onChange={this.setTotalKgs}></Checkbox>
                                                                        </Form.Item>
    
    
                                                                        {/* <Checkbox field={field} fieldKey={[ field.fieldKey, 'selected' ]} modelName={[field.name, 'selected']} checked={[field.name, 'selected']} value={[field.name, 'selected']} /> */}
                                                                    </td>
                                        <td><Selectbox noPlaceholder withoutMargin className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]}   required="false" modelName={[field.name, 'fabric_id']} value={field.name,'fabric_id'} showLabel={false} options={this.state.fabric} label="Fabric"></Selectbox></td>
                                        <td> <Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} value={field.gsm} required="false" label="GSM"></Numberbox></td>
                                        <td> <Numberbox withoutMargin noPlaceholder showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'counts' ]} required="false" modelName={[field.name, 'counts']} value={field.counts} label="Counts"></Numberbox></td>
                                        <td> <Numberbox noPlaceholder withoutMargin className="col-md-12"    required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'qtybag_per' ]} onChange={ (ev) => this.setTotalKgs(ev, field.fieldKey) } modelName={[field.name, 'qtybag_per']} value={field.qtybag_per} label="Qty per"></Numberbox></td>
                                        <td><Numberbox noPlaceholder withoutMargin className="col-md-12" required="false" field={field} showLabel={false} fieldKey={[ field.fieldKey, 'qty_bag' ]} onChange={ (ev) => this.setTotalKgs(ev, field.fieldKey) } modelName={[field.name, 'qty_bag']} value={field.qty_bag} label="Qty Bags"></Numberbox></td>
                                        <td><Numberbox noPlaceholder withoutMargin showLabel={false} className="col-md-12" field={field} fieldKey={[ field.fieldKey, 'qty_kg' ]} onChange={ (ev) => this.setTotalKgs(ev, field.fieldKey) } disabled required="false" modelName={[field.name, 'qty_kg']} value={field.qty_kg} label="Qty Kg"></Numberbox></td>
                                        <td>  { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeYarn_inward_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}</td>
                                        </tr>
                                        )
                                            
                                        )
                                    ) }
                                   </Form.List>
                                   <tr>
                                   <td colSpan={5} style={{textAlign:'right'}}> <h6> Total</h6></td>
                                   <td><Numberbox noPlaceholder modelName="inventory_qty_bag_total" withoutMargin showLabel={false} className="col-md-12" disabled value={this.state.formData.inventory_qty_kg_total} label="Total BAG " required="false"></Numberbox></td>
                               
                                <td><Numberbox noPlaceholder modelName="inventory_qty_kg_total" withoutMargin showLabel={false} className="col-md-12" disabled value={this.state.formData.inventory_qty_kg_total} label="Total Qty KGs" required="false"></Numberbox></td>
                                
                                   </tr>
                                </tbody>
                               
                                </table>
                             </div>
                         </div>
                        <br></br>
                       
                       
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddYarn_Inward));