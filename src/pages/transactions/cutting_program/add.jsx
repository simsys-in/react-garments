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
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
// import TableEditablePage from '../../../components/EditableTable';

// import moment from 'moment'


let interval;


class AddCuttingProgram extends PureComponent{
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active',
                voudate : moment(),
                fabrics : [
                    {
                        fabric_id : null,
                        gsm : '',
                        dia : ''
                    
                    }
                ]
            },
            size_data_for_order : [],
            companiesList : [],
            size_data : [],
            style_data : [],
            fabric_data : [],
            ledger_name : [],
            color_data : [],
            process : [],
            order_no : [],
            employee_data : [],
        }
        this.id = this.props.match.params.id;
    }
    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

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

    getCuttingProgram = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/CuttingProgram?id=" + this.id).then(data => {
               
                data.data.orderDate = moment(data.data.orderDate)
                data.data.due_date = moment(data.data.due_date)
                console.log(data.data)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getSizeSB = () => {
        getRequest('transactions/getSizeSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    size_data : data.data
                })
            }
        })
    }

    getColorSB = () => {
        getRequest('masters/getAllColorSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    color_data : data.data
                })
            }
        })
    }

    getCuttingMasterSB = () => {
        getRequest('masters/getAllCuttingMasterSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    employee_data : data.data
                })
            }
        })
    }

    getLedgerNameSB = () => {
        getRequest('transactions/getLedgerNameSB').then(data => {
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
        
        getRequest('transactions/getProcessSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    process : data.data
                })
            }
        })
    }

    
    getStyleSB = () => {
        getRequest('transactions/getStyleSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    style_data : data.data
                })
            }
        })
    }
    
    getFabricSB = () => {
        getRequest('transactions/getfabricSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric_data : data.data
                })
            }
        })
    }

    getNextCuttingProgramLotNo = () => {
        getRequest('transactions/getNextCuttingProgLotNo').then(data => {
            
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        lot_no : data.data
                    }
                },() => {
                    this.formRef.current.setFieldsValue({
                        lot_no : this.state.formData.lot_no
                    })
                })
            }
        })
    }

    

    componentDidMount() {
        this.getSizeSB();
        this.getStyleSB();
        this.getFabricSB();
        this.getOrderSB();
        this.getColorSB();
        this.getCuttingMasterSB();
        this.getProcessSB();
        this.getNextCuttingProgramLotNo();
        this.getLedgerNameSB();
        this.getCuttingProgram();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Cutting Program',
            metaDescription: 'Add Cutting Program'
          });

          if(this.id)
          {
            seo({
                title: 'Edit Cutting Program',
                metaDescription: 'Edit Cutting Program'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('transactions/CuttingProgram?id=' + this.id, values).then(data => {
                console.log(values)
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_cuttingprogram')
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

    addFabric = () => {
        var newFabric = {
            fabric_id : null,
            dia : '',
            gsm : ''
        }

        var oldFabricArray = this.state.formData.fabrics;

        oldFabricArray.push(newFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                fabrics : oldFabricArray
            }
        })
    }


    removeFabrics = (index) => {
        var oldSFabricsArray = this.state.formData.fabrics;

        oldSFabricsArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                fabrics : oldSFabricsArray
            }
        })
    }

    

    addOrderFabrics = () => {
        var newOrderFabrics = {
            fabric_id : null,
            dia : '',
            gsm : ''
        }

        var oldOrderFabricsArray = this.state.formData.order_fabrics;

        oldOrderFabricsArray.push(newOrderFabrics);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_fabrics : oldOrderFabricsArray
            }
        })
    }


    removeOrderFabrics = (index) => {
        var oldOrderFabricsArray = this.state.formData.order_fabrics;

        oldOrderFabricsArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                order_fabrics : oldOrderFabricsArray
            }
        })
        this.setTOTAL();
    }


    getOrderSB = () => {
        getRequest('transactions/getOrderSB').then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    order_no : data.data
                })
            }
        })
    }

    getSizesForOrderID = (order_id) => {
        getRequest('transactions/getSizesForOrderID?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                var items = _.remove(data.data, (currentObject) => {
                    return currentObject !== "";
                });
                
                this.setState({
                    ...this.state,
                    size_data_for_order : items
                })
            }
        })
    }

    onOrderIDChange = (order_id) => {
        this.getProcessSBForOrderID(order_id);
        this.getStyleForOrderID(order_id);
        this.getSizesForOrderID(order_id);
    }

    getStyleForOrderID = (order_id) => {
        getRequest('transactions/getStyleForOrderId?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        style_id : Number(data.data)
                    }
                }, () => {
                    this.formRef.current.setFieldsValue(this.state.formData);
                })
            }
        })
    }

    
    getProcessSBForOrderID = (order_id) => {
        getRequest('masters/getProcessSBForOrderID?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    process : data.data
                })
            }
        })
    }

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_cuttingprogram') } }>
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
                        <div className="col-md-12">
                            <Divider plain orientation="left" >CUTTING PROGRAM</Divider>
                            <div className="row">
                                <Selectbox autoFocus modelName="order_id" label="Order No" className="col-md-6" onChange={this.onOrderIDChange} options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                                <Textbox className="col-md-6" label="Lot No" modelName="lot_no" ></Textbox>
                            </div>
                            <div className="row">
                                <Datebox  className="col-md-6" label="Vou. Date" value={this.state.formData.voudate} modelName="voudate" ></Datebox>
                                <Selectbox modelName="process_id" label="Process" className="col-md-6" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>
                            </div>
                            <div className="row">
                                <Selectbox modelName="style_id" label="Style" className="col-md-6" options={this.state.style_data} value={this.state.formData.style_id}  ></Selectbox>
                                <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>
                            </div>

                        </div>  
                    </div>
                    <Divider orientation="left" plain> PRODUCTS</Divider>
                    <br/>
                    <div className="row">
                        <div className="col-md-12 table-scroll">
                            <table id="dynamic-table" className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th colSpan="8" className="primary-header" style={{ backgroundColor : 'lightblue' }} > <b> FABRIC CONSUMPTION</b></th>
                                            <th colSpan={this.state.size_data_for_order.length} className="primary-header" style={{ backgroundColor : 'grey' }} > <b> SYLE CUT PCS</b></th>
                                            <th colSpan="4" className="primary-header" style={{ backgroundColor : 'yellow' }} > <b> LABOUR PAYROLL</b></th>
                                        </tr>
                                    </thead>
                                    <thead>
                                        <tr>
                                            <th width="100px"> <b> Fabric</b></th>
                                            <th width="40px"> <b> Dia</b></th>
                                            <th width="40px"> <b> GSM</b></th>
                                            <th width="50px"> <b> Color</b></th>
                                            <th width="50px"> <b> Roll Wgt</b></th>
                                            <th width="50px"> <b> Return Wgt</b></th>
                                            <th width="40px"> <b> Bundle Wgt</b></th>
                                            <th width="50px"> <b> Waste</b></th>

                                            { this.state.size_data_for_order.map((item) => 
                                                item !== "" && <th width="40px"> <b> {item}</b></th>
                                            ) }

                                            <th width="50px"> <b> Qty</b></th>
                                            <th width="50px"> <b> Cutting Master</b></th>
                                            <th width="50px"> <b> Rt </b></th>
                                            <th width="50px"> <b> Amount</b></th>
                                            <th width="30px">
                                                <Button type="primary"  onClick={this.addFabric} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {this.state.formData.fabrics.map((row, index) => {
                                            return ( */}
                                                <Form.List name="fabrics">
                                                        { (fields, { add, remove } )=> (
                                                            fields.map((field, index) => (
                                                                <tr key={index}>
                                                                {/* <Fragment> */}
                                                                <td>
                                                                    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']}  label="Fabric"  options={this.state.fabric_data} value={[field.name, 'fabric_id']} noPlaceholder withoutMargin ></Selectbox>
                                                                </td>
                                                                <td>
                                                                    <Textbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} modelName={[field.name, 'dia']}  noPlaceholder withoutMargin label="Dia"  ></Textbox>
                                                                </td>
                                                                <td>
                                                                    <Textbox  className="col-md-12" label="Gsm" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} noPlaceholder withoutMargin ></Textbox>
                                                                </td>
                                                                <td>
                                                                    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']}  label="Color"  options={this.state.color_data} value={[field.name, 'color_id']} noPlaceholder withoutMargin ></Selectbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Fabric Qty" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'fabric_qty' ]} modelName={[field.name, 'fabric_qty']} value={[field.name, 'fabric_qty']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Fabric Return Qty" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'fabric_return_qty' ]} modelName={[field.name, 'fabric_return_qty']} value={[field.name, 'fabric_return_qty']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Bundle Weight" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'qty_bundle' ]} modelName={[field.name, 'qty_bundle']} value={[field.name, 'qty_bundle']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Waste" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'fabric_wastage' ]} modelName={[field.name, 'fabric_wastage']} value={[field.name, 'fabric_wastage']} disabled noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                {
                                                                    this.state.size_data_for_order.map((item, index) => 
                                                                    item !== "" && <td>
                                                                        <Numberbox className="col-md-12" required="false" showLabel={false} label={item} min={0}  field={field} fieldKey={[ field.fieldKey, 'size' + Number(Number(index) + 1) ]} modelName={[field.name, 'size' + Number(Number(index) + 1)]} value={[field.name, 'size' + Number(Number(index) + 1)]} noPlaceholder withoutMargin ></Numberbox>
                                                                    </td>
                                                                    )
                                                                }
                                                                {/* <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="S" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size1' ]} modelName={[field.name, 'size1']} value={[field.name, 'size1']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="M" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size2' ]} modelName={[field.name, 'size2']} value={[field.name, 'size2']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="L" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size3' ]} modelName={[field.name, 'size3']} value={[field.name, 'size3']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="XL" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size4' ]} modelName={[field.name, 'size4']} value={[field.name, 'size4']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="2XL" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size5' ]} modelName={[field.name, 'size5']} value={[field.name, 'size5']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="3XL" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size6' ]} modelName={[field.name, 'size6']} value={[field.name, 'size6']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="4XL" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'size7' ]} modelName={[field.name, 'size7']} value={[field.name, 'size7']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td> */}
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Qty" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'qty' ]} modelName={[field.name, 'qty']} value={[field.name, 'qty']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'employee_id' ]} modelName={[field.name, 'employee_id']}  label="Color"  options={this.state.employee_data} value={[field.name, 'employee_id']} noPlaceholder withoutMargin ></Selectbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Rate" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'rate' ]} modelName={[field.name, 'rate']} value={[field.name, 'rate']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Amount" min={0} max={100} field={field} fieldKey={[ field.fieldKey, 'amount' ]} modelName={[field.name, 'amount']} value={[field.name, 'amount']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeFabrics(index)} type="primary"><FontAwesomeIcon  icon={faTimes} /></Button>}
                                                                </td>
                                                                {/* </Fragment> */}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </Form.List>
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
                                <Button type="primary" disabled={ this.state.buttonDisabled }  htmlType="submit" loading={this.state.buttonLoading}>
                                { this.id ? "Update" : 'Submit'}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                   
                </Form>
                
                <div className="row"> 
                    <div className="col-md-6">
                        <pre> { JSON.stringify(this.formRef, null, 2)  } </pre>
                    </div>
                    <div className="col-md-6">
                        <pre> { JSON.stringify(this.state.formData, null, 2)  } </pre>
                    </div>

                </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddCuttingProgram));