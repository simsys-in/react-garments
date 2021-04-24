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
import { issetNotEmpty } from '../../../helpers/formhelpers';
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
                style_id :"",
                narration : "",
            
                voudate : moment(),
                fabrics : [
                    {
                        fabric_id : null,
                        gsm : '',
                        dia : '',
                        qty_bundle : 0,
                        fabric_qty : 0,
                        fabric_return_qty : 0,
                        fabric_wastage : 0,
                        size1 : 0,
                        size2 : 0,
                        size3 : 0,
                        size4 : 0,
                        size5 : 0,
                        size6 : 0,
                        size7 : 0,
                        size8 : 0,
                        size9 : 0,
                        qty : 0,
                        rate : 0
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
        // console.log(this.id)
        if(this.id)
        {
            getRequest("garments/cuttingProgram?id=" + this.id).then(data => {
               
                data.data[0].voudate = moment(data.data[0].voudate)
                // console.log(data.data)
                this.formRef.current.setFieldsValue(data.data[0]);
                this.onOrderIDChange(data.data[0].order_id);
                this.calculateQty()
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    getSizeSB = () => {
        getRequest('garments/getSizeSB').then(data => {
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
        getRequest('garments/getAllColorSB').then(data => {
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
        getRequest('garments/getAllCuttingMasterSB').then(data => {
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

    
    getStyleSB = () => {
        getRequest('garments/getStyleSB').then(data => {
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
        getRequest('garments/getFabricsSB').then(data => {
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
        if(!issetNotEmpty(this.state.formData.lotno))
        {
            getRequest('garments/getNextCuttingProgLotNo').then(data => {
                
                if(data.status === "info")
                {
                    if(!issetNotEmpty(this.state.formData.lotno))
                    {
                        this.setState({
                            ...this.state,
                            formData : {
                                ...this.state.formData,
                                lotno : data.data
                            }
                        },() => {
                            this.formRef.current.setFieldsValue({
                                lotno : this.state.formData.lotno
                            })
                        })
                    }
                }
            })
        }
    }

    

    componentDidMount() {
        this.getSizeSB();
        this.getStyleSB();
        this.getFabricSB();
        this.getOrderSB();
        this.getNextCuttingProgramLotNo();
        this.getColorSB();
        this.getCuttingMasterSB();
        this.getProcessSB();
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
            putRequest('garments/cuttingProgram?id=' + this.id, this.state.formData).then(data => {
                // console.log(values)
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_cutting_program')
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

    addFabric = () => {
        var newFabric = {
            fabric_id : null,
            gsm : '',
            dia : '',
            qty_bundle : 0,
            fabric_qty : 0,
            fabric_return_qty : 0,
            fabric_wastage : 0,
            size1 : 0,
            size2 : 0,
            size3 : 0,
            size4 : 0,
            size5 : 0,
            size6 : 0,
            size7 : 0,
            size8 : 0,
            size9 : 0,
            qty : 0,
            rate : 0
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

    getSizesForOrderID = (order_id) => {
        getRequest('garments/getSizesForOrderID?order_id=' + order_id).then(data => {
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

    getFabricsForOrderID = (order_id) => {
        getRequest('garments/getFabricsForOrderIDForCuttingProgram?order_id=' + order_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    fabric_data : data.data
                })
            }
        })
    }

    onOrderIDChange = (order_id) => {
        this.getProcessSBForOrderID(order_id);
        this.getStyleForOrderID(order_id);
        this.getSizesForOrderID(order_id);
        this.getFabricsForOrderID(order_id);
    }

    getStyleForOrderID = (order_id) => {
        getRequest('garments/getStyleForOrderId?order_id=' + order_id).then(data => {
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

    calculateQty = () => {
        var formData = this.formRef.current.getFieldValue();
        var fabrics = formData.fabrics;

        var total_fabric_qty = 0;
        var total_fabric_return_qty = 0;
        var total_fabric_bundle_qty = 0;
        var total_fabric_wastage = 0;
        var total_size1_qty = 0;
        var total_size2_qty = 0;
        var total_size3_qty = 0;
        var total_size4_qty = 0;
        var total_size5_qty = 0;
        var total_size6_qty = 0;
        var total_size7_qty = 0;
        var total_size8_qty = 0;
        var total_size9_qty = 0;
        var total_qty = 0;
        var total_amount = 0;

        fabrics.map((fabric,ind) => {
            fabric.fabric_wastage = Number(fabric.fabric_qty) - Number(Number(fabric.fabric_return_qty) + Number(fabric.qty_bundle));
            fabric.qty = Number(fabric.size1) + Number(fabric.size2) + Number(fabric.size3) + Number(fabric.size4) + Number(fabric.size5) + Number(fabric.size6) + Number(fabric.size7) + Number(fabric.size8) + Number(fabric.size9);

            fabric.amount = Number(fabric.qty) * Number(fabric.rate);
            total_size1_qty += Number(fabric.size1);
            total_size2_qty += Number(fabric.size2);
            total_size3_qty += Number(fabric.size3);
            total_size4_qty += Number(fabric.size4);
            total_size5_qty += Number(fabric.size5);
            total_size6_qty += Number(fabric.size6);
            total_size7_qty += Number(fabric.size7);
            total_size8_qty += Number(fabric.size8);
            total_size9_qty += Number(fabric.size9);

            total_qty += Number(fabric.qty);
            total_amount += Number(fabric.amount);

            total_fabric_qty += Number(fabric.fabric_qty);
            total_fabric_return_qty += Number(fabric.fabric_return_qty);
            total_fabric_bundle_qty += Number(fabric.qty_bundle);
            total_fabric_wastage += Number(fabric.fabric_wastage);
            if(ind === fabrics.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        fabrics : fabrics,
                        total_fabric_bundle_qty,
                        total_fabric_qty,
                        total_fabric_return_qty,
                        total_fabric_wastage,
                        total_size1_qty,
                        total_size2_qty,
                        total_size3_qty,
                        total_size4_qty,
                        total_size5_qty,
                        total_size6_qty,
                        total_size7_qty,
                        total_size8_qty,
                        total_size9_qty,
                        total_qty,
                        total_amount
                    }
                }, () => {
                    this.formRef.current.setFieldsValue(this.state.formData);
                })
            }
        })


        // var currentItem = fabrics[index];
    }

    buttonDisabled = () => {
        if(this.formRef && this.formRef.current)
        {
            const FORM_DATA = this.formRef.current.getFieldValue();
            if(issetNotEmpty(FORM_DATA.order_id) && issetNotEmpty(FORM_DATA.lotno) && issetNotEmpty(FORM_DATA.voudate) && issetNotEmpty(FORM_DATA.process_id) && issetNotEmpty(FORM_DATA.style_id))
            {
                var f = 'f';

                var valid_entries = _.filter(FORM_DATA.fabrics, (fabric) => {
                    return issetNotEmpty(fabric.fabric_id) && issetNotEmpty(fabric.color_id) && issetNotEmpty(fabric.fabric_qty) && issetNotEmpty(fabric.qty_bundle) && issetNotEmpty(fabric.fabric_return_qty) && issetNotEmpty(fabric.fabric_wastage) && issetNotEmpty(fabric.employee_id) && issetNotEmpty(fabric.rate) && issetNotEmpty(fabric.amount) && issetNotEmpty(fabric.qty)
                }).length;
                // console.log(valid_entries);

                if(valid_entries > 0)
                {
                    f = 't';
                }
                if(f === 't')
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
        else{
            return true;
        }
    }

    onFabricChange = (fabric_id, index) => {
        var formData = this.formRef.current.getFieldValue();
        var fabrics = formData.fabrics;
        var currentItem = fabrics[index];

        getRequest('garments/getFabricDetailForOrder?order_id=' + formData.order_id + "&fabric_id=" + fabric_id).then(data => {
            if(data.status === "info")
            {
                currentItem.dia = data.data[0].dia;
                currentItem.gsm = data.data[0].gsm;
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        fabrics : fabrics
                    }
                }, () => {
                    this.formRef.current.setFieldsValue(this.state.formData)
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


    checkButtonDisabled = () => {
        const FORMDATA = this.state.formData;

        if(issetNotEmpty(FORMDATA.order_id) && issetNotEmpty(FORMDATA.voudate) && issetNotEmpty(FORMDATA.lotno) && issetNotEmpty(FORMDATA.process_id) && issetNotEmpty(FORMDATA.style_id)) 
        {
            var selectedItems = _.filter(FORMDATA.fabrics, (item) => {
                // console.log(item)
                return  item.fabric_id && item.color_id && ( item.size1 ||item.size2 ||item.size3 ||item.size4 ||item.size5 ||item.size6 || item.size7 ||item.size8 ||item.size9 )  &&item.fabric_qty && item.fabric_return_qty && item.qty_bundle && item.fabric_wastage && item.qty && item.employee_id && item.rate && item.amount ;
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
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_cutting_program') } }>
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
                            <Divider plain orientation="left" >CUTTING PROGRAM</Divider>
                            <div className="row">
                                <Selectbox autoFocus modelName="order_id" label="Order No" className="col-md-4" onChange={this.onOrderIDChange} options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                                <Textbox className="col-md-4" label="Lot No" modelName="lotno" ></Textbox>
                                <Datebox  className="col-md-4" label="Vou Date" value={this.state.formData.voudate} modelName="voudate" ></Datebox>
                            </div>
                            
                            <div className="row">
                                <Selectbox modelName="process_id" label="Process" className="col-md-4" options={this.state.process} disabled value={this.state.formData.process_id=8}  ></Selectbox>
                                <Selectbox modelName="style_id" label="Style" disabled required="false" className="col-md-4" options={this.state.style_data} value={this.state.formData.style_id}  ></Selectbox>
                                <Textbox label="Narration" modelName="narration" required="false" className="col-md-4"></Textbox>
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
                                            <th width="20px"> <b> Dia</b></th>
                                            <th width="20px"> <b> GSM</b></th>
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
                                                                    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'fabric_id' ]} modelName={[field.name, 'fabric_id']}  label="Fabric"  options={this.state.fabric_data} onChange={(fabric_id) =>this.onFabricChange(fabric_id, field.name)} value={[field.name, 'fabric_id']} noPlaceholder withoutMargin ></Selectbox>
                                                                </td>
                                                                <td>
                                                                    <Textbox disabled className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'dia' ]} modelName={[field.name, 'dia']}  noPlaceholder withoutMargin label="Dia"  ></Textbox>
                                                                </td>
                                                                <td>
                                                                    <Textbox disabled className="col-md-12" label="Gsm" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'gsm' ]} modelName={[field.name, 'gsm']} noPlaceholder withoutMargin ></Textbox>
                                                                </td>
                                                                <td>
                                                                    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']}  label="Color"  options={this.state.color_data} value={[field.name, 'color_id']} noPlaceholder withoutMargin ></Selectbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Fabric Qty"  field={field} fieldKey={[ field.fieldKey, 'fabric_qty' ]} onChange={this.calculateQty} modelName={[field.name, 'fabric_qty']} value={[field.name, 'fabric_qty']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Fabric Return Qty"  field={field} fieldKey={[ field.fieldKey, 'fabric_return_qty' ]}  onChange={this.calculateQty} modelName={[field.name, 'fabric_return_qty']} value={[field.name, 'fabric_return_qty']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Bundle Weight"  field={field} fieldKey={[ field.fieldKey, 'qty_bundle' ]}  onChange={this.calculateQty} modelName={[field.name, 'qty_bundle']} value={[field.name, 'qty_bundle']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Waste"  field={field} fieldKey={[ field.fieldKey, 'fabric_wastage' ]}  onChange={this.calculateQty} modelName={[field.name, 'fabric_wastage']} value={[field.name, 'fabric_wastage']} disabled noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                {
                                                                    this.state.size_data_for_order.map((item, index) => 
                                                                    item !== "" && <td>
                                                                        <Numberbox className="col-md-12" required="false" showLabel={false} label={item} min={0}  field={field} onChange={this.calculateQty}  fieldKey={[ field.fieldKey, 'size' + Number(Number(index) + 1) ]} modelName={[field.name, 'size' + Number(Number(index) + 1)]} value={[field.name, 'size' + Number(Number(index) + 1)]} noPlaceholder withoutMargin ></Numberbox>
                                                                    </td>
                                                                    )
                                                                }
                                                                {/* <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="S"  field={field} fieldKey={[ field.fieldKey, 'size1' ]} modelName={[field.name, 'size1']} value={[field.name, 'size1']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="M"  field={field} fieldKey={[ field.fieldKey, 'size2' ]} modelName={[field.name, 'size2']} value={[field.name, 'size2']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="L"  field={field} fieldKey={[ field.fieldKey, 'size3' ]} modelName={[field.name, 'size3']} value={[field.name, 'size3']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="XL"  field={field} fieldKey={[ field.fieldKey, 'size4' ]} modelName={[field.name, 'size4']} value={[field.name, 'size4']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="2XL"  field={field} fieldKey={[ field.fieldKey, 'size5' ]} modelName={[field.name, 'size5']} value={[field.name, 'size5']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="3XL"  field={field} fieldKey={[ field.fieldKey, 'size6' ]} modelName={[field.name, 'size6']} value={[field.name, 'size6']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="4XL"  field={field} fieldKey={[ field.fieldKey, 'size7' ]} modelName={[field.name, 'size7']} value={[field.name, 'size7']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td> */}
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" disabled showLabel={false} label="Qty"  field={field} fieldKey={[ field.fieldKey, 'qty' ]} onChange={this.calculateQty} modelName={[field.name, 'qty']} value={[field.name, 'qty']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Selectbox className="col-md-12" required="false" showLabel={false} field={field} fieldKey={[ field.fieldKey, 'employee_id' ]} modelName={[field.name, 'employee_id']}  label="Color"  options={this.state.employee_data} value={[field.name, 'employee_id']} noPlaceholder withoutMargin ></Selectbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" showLabel={false} label="Rate"  field={field} fieldKey={[ field.fieldKey, 'rate' ]} onChange={this.calculateQty} modelName={[field.name, 'rate']} value={[field.name, 'rate']} noPlaceholder withoutMargin ></Numberbox>
                                                                </td>
                                                                <td>
                                                                    <Numberbox className="col-md-12" required="false" disabled showLabel={false} label="Amount"  field={field} fieldKey={[ field.fieldKey, 'amount' ]} modelName={[field.name, 'amount']} value={[field.name, 'amount']} noPlaceholder disabled withoutMargin ></Numberbox>
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
                                        <tr style={{ backgroundColor : 'lightgray', textAlign : 'right' }}>
                                            <td colSpan={4}> <h6> Total</h6></td>
                                            <td > <h6> {this.state.formData.total_fabric_qty}</h6></td>
                                            <td > <h6> {this.state.formData.total_fabric_return_qty}</h6></td>
                                            <td > <h6> {this.state.formData.total_fabric_bundle_qty}</h6></td>
                                            <td > <h6> {this.state.formData.total_fabric_wastage}</h6></td>

                                            { this.state.size_data_for_order.map((item, index) => 
                                                item !== "" && <td > <h6> {this.state.formData["total_size" + Number(Number(index) +1) + "_qty"]}</h6></td>
                                            ) }

                                            <td > <h6> { this.state.formData.total_qty }</h6></td>
                                            <td > <h6> </h6></td>
                                            <td > <h6>  </h6></td>
                                            <td > <h6> { this.state.formData.total_amount }</h6></td>
                                        </tr>
                                    </tbody>
                                </table>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary" disabled={ this.checkButtonDisabled()} onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddCuttingProgram));