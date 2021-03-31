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


class AddJobwork_Inward  extends PureComponent{
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
                jobwork_inward_inventory : [
                    {  
                       color : '',
                       size1 : '',
                        size2 : '',
                        size3 :'' ,
                        size4 :'' ,
                        size5 :'' ,
                        size6 :'' ,
                        size7 :'' ,
                        size8 :'' ,
                        size9 :'' ,
                        qty :'' 
                        
                      
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

    getFabricsSB = () => {
        
        getRequest('transactions/getFabricsSB').then(data => {
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
    getColorSB = () => {
        
        getRequest('transactions/getColorSB').then(data => {
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

    getJobwork_Inward  = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("transactions/jobwork_inward?id=" + this.id).then(data => {
                data.data.dob = moment(data.data.dob)
                console.log(data.data)
                data.data.vou_date = moment(data.data.vou_date)
                this.formRef.current.setFieldsValue(data.data);
            })

        }
        else{
            // this.getNextYarnReturnVouNo();
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    // getNextYarnReturnVouNo = () => {
    //     getRequest('transactions/getNextYarnReturnVouNo').then(data => {
    //         console.log(data);
    //         if(data.status === "info")
    //         {
    //             this.setState({
    //                 ...this.state,
    //                 formData : {
    //                     ...this.state.formData,
    //                     vouno : data.data.max_vou_no
    //                 }
    //             },() => {
    //                 this.formRef.current.setFieldsValue({
    //                     vouno : this.state.formData.vouno
    //                 })
    //             })
    //         }
    //     })
    // }

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
    getMobileForLedgerID = (ledger_id) => {
        getRequest('masters/getMobileForLedgerID?ledger_id=' + ledger_id).then(data => {
            if(data.status === "info")
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        mobile : data.data
                    },
                },() => {
                    this.formRef.current.setFieldsValue({
                        mobile : this.state.formData.mobile
                    })
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
        this.getJobwork_Inward ();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add Jobwork inward ',
            metaDescription: 'Add Jobwork inward '
          });

          if(this.id)
          {
            seo({
                title: 'Edit Jobwork inward ',
                metaDescription: 'Edit Jobwork inward '
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            putRequest('transactions/jobwork_inward?id=' + this.id, values).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/transactions/list_jobwork_inward')
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

    addJobwork_inward_inventory = () => {
        var newJobwork_inward_inventory = {
            color : '',
            size1 : '',
             size2 : '',
             size3 :'' ,
             size4 :'' ,
             size5 :'' ,
             size6 :'' ,
             size7 :'' ,
             size8 :'' ,
             size9 :'' ,
             qty :'' 
        }

        var oldJobwork_inward_inventoryArray = this.state.formData.jobwork_inward_inventory;

        oldJobwork_inward_inventoryArray.push(newJobwork_inward_inventory);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_inward_inventory : oldJobwork_inward_inventoryArray
            }
        })
    }

    setTotalKgs = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_kg = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_kg += item.qty_kg;

            if(index === jobwork_inward_inventory.length - 1)
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
    setTotalSize1 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size1 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size1 += Number(item.size1);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size1_total : total_size1
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size1_total : total_size1
                    })
                })
            }

        })
    }
    setTotalSize2 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size2 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size2 += Number(item.size2);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size2_total : total_size2
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size2_total : total_size2
                    })
                })
            }

        })
    }
    setTotalSize3 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size3 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size3 += Number(item.size3);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size3_total : total_size3
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size3_total : total_size3
                    })
                })
            }

        })
    }
    setTotalSize4 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size4 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size4 += Number(item.size4);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size4_total : total_size4
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size4_total : total_size4
                    })
                })
            }

        })
    }
    setTotalSize5 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size5 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size5 += Number(item.size5);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size5_total : total_size5
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size5_total : total_size5
                    })
                })
            }

        })
    }
    setTotalSize6 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size6 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size6 += Number(item.size6);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size6_total : total_size6
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size6_total : total_size6
                    })
                })
            }

        })
    }
    setTotalSize7 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size7 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size7 += Number(item.size7);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size7_total : total_size7
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size7_total : total_size7
                    })
                })
            }

        })
    }
    setTotalSize8 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size8 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size8 += Number(item.size8);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size8_total : total_size8
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size8_total : total_size8
                    })
                })
            }

        })
    }
    setTotalSize9 = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_size9 = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_size9 += Number(item.size9);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        size9_total : total_size9
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        size9_total : total_size9
                    })
                })
            }

        })
    }
    setTotalQty = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_qty = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_qty += Number(item.qty);

            if(index === jobwork_inward_inventory.length - 1)
            {
                this.setState({
                    ...this.state,
                    formData : {
                        ...this.state.formData,
                        inventory_qty_total : total_qty
                    }
                }, () => {
                    this.formRef.current.setFieldsValue({
                        inventory_qty_total : total_qty
                    })
                })
            }

        })
    }
    setTotalBags = () =>{
        var values = this.formRef.current.getFieldValue();
        var jobwork_inward_inventory = values.jobwork_inward_inventory;
        var total_bag = 0;
        jobwork_inward_inventory.map((item, index) => {
            total_bag += Number(item.qty_bag);

            if(index === jobwork_inward_inventory.length - 1)
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
        var fabric = values.jobwork_inward_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.qty_kg = currentFabric.qtybag_per * currentFabric.qty_bag;

        values.jobwork_inward_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_inward_inventory : values.jobwork_inward_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            this.setTotalKgs();
            this.setTotalBags();
            this.setTotalSize1();
            this.setTotalSize2();
            this.setTotalSize3();
            this.setTotalSize4();
            this.setTotalSize5();
            this.setTotalSize6();
            this.setTotalSize7();
            this.setTotalSize8();
            this.setTotalSize9();
            this.setTotalQty();


        })
    }
    setQTYCOLOR = (ev, index) => {
        var values = this.formRef.current.getFieldValue();
        var fabric = values.jobwork_inward_inventory;
        var currentFabric = fabric[index] ;
        currentFabric.qty = Number( currentFabric.size1) + Number(currentFabric.size2)+ Number(currentFabric.size3) + Number(currentFabric.size4) + Number(currentFabric.size5) + Number(currentFabric.size6) + Number(currentFabric.size7) + Number(currentFabric.size8) + Number(currentFabric.size9);

        values.jobwork_inward_inventory.splice(index, 1, currentFabric);

        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_inward_inventory : values.jobwork_inward_inventory
            }
        }, () => {
            // var data = this.formRef.current.getFieldValue();
            // var qty_kg = Number(data.qtybag_per) + Number(data.qty_bag)
            this.formRef.current.setFieldsValue(values);
            this.setTotalKgs();
            this.setTotalBags();
            this.setTotalSize1();
            this.setTotalSize2();
            this.setTotalSize3();
            this.setTotalSize4();
            this.setTotalSize5();
            this.setTotalSize6();
            this.setTotalSize7();
            this.setTotalSize8();
            this.setTotalSize9();
            this.setTotalQty();

        })
    }
    removeJobwork_inward_inventory = (index) => {
        var oldJobwork_inward_inventoryArray = this.state.formData.jobwork_inward_inventory;

        oldJobwork_inward_inventoryArray.splice(index, 1);
        
        this.setState({
            ...this.state,
            formData : {
                ...this.state.formData,
                jobwork_inward_inventory : oldJobwork_inward_inventoryArray
            }
        })
        this.setTotalBags();
        this.setTotalKgs();
        this.setTotalSize1();
        this.setTotalSize2();
        this.setTotalSize3();
        this.setTotalSize4();
        this.setTotalSize5();
        this.setTotalSize6();
        this.setTotalSize7();
        this.setTotalSize8();
        this.setTotalSize9();
        this.setTotalQty();
    }

    // getOrderNos = (ledger_id)

    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/transactions/list_jobwork_inward') } }>
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
                       
                       
                       <Selectbox modelName="order_id" label="Order No" onChange={this.getProcessSBForOrderID} className="col-md-6" options={this.state.order_no} value={this.state.formData.order_id}  ></Selectbox>
                        <Selectbox modelName="process_id" label="Process" className="col-md-6" options={this.state.process} value={this.state.formData.process_id}  ></Selectbox>

                    </div>
                    <div className="row">
                        {/* <Textbox label="Id" modelName="order_id"  className="col-md-6"></Textbox> */}
                        <Selectbox modelName="ledger_id" label="Ledger Name" onChange={this.getMobileForLedgerID} className="col-md-6" options={this.state.ledger_name} value={this.state.formData.ledger_id} ></Selectbox>
                        <Textbox label="Mobile" modelName="mobile" required = "false"  className="col-md-6"></Textbox>



                    </div>
                    <div className="row">
                        <Datebox label="Vou Date" value={this.state.formData.vou_date}  modelName="vou_date" className="col-md-6"></Datebox>
                   
                        <Textbox label="Narration" modelName="narration" required="false" className="col-md-6"></Textbox>


                    </div>
                    <div className="row">
                   
                        <Textbox label="Product" modelName="product" required="false" className="col-md-6"></Textbox>
                       <Textbox label="Adas" modelName="adas" required="false"  className="col-md-6"></Textbox>


                    </div>



                         <div className="row">
                             <div className="col-md-12">
                             <Divider plain orientation="left" >Products</Divider>    

                             <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
                                    <div className="col-md-11">
                                        <div className="row flex-nowarp">
                                            <Textbox  withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Color" label="Color" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size1" label="Size1" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size2" label="Size2" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size3" label="Size3" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size4" label="Size4" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size5" label="Size5" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size6" label="Size6" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size7" label="Size7" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size8" label="Size8" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size9" label="Size9" required="false"></Textbox>
                                            <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty" label="Qty" required="false"></Textbox>
                                            
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <Button type="primary" onClick={this.addJobwork_inward_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
                                    </div>
                                </div>
        
                                    <Form.List name="jobwork_inward_inventory">
                                    { (fields, { add, remove } )=> (
                                        fields.map((field, index) => (
                                                <div className="row" key={field.key} style={{ paddingLeft : 15, paddingRight : 2 }}>
                                                    <div className="col-md-11">
                                                        <div className="row flex-nowarp">

                                                          
                                                            
                                                            <Selectbox noPlaceholder withoutMargin showLabel={false} required="false" className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={field.color_id} options={this.state.color} label="Color"></Selectbox>
                                                            {/* <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'color' ]} required="false" modelName={[field.name, 'color']} value={field.color} label="Color_id"></Textbox> */}

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size1' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) } modelName={[field.name, 'size1']} value={field.size1} label="Size1"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size2' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size2']} value={field.size2} label="Size2"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size3' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size3']} value={field.size3} label="Size3"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size4' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size4']} value={field.size4} label="Size4"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size5' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size5']} value={field.size5} label="Size5"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size6' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size6']} value={field.size6} label="Size6"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size7' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size7']} value={field.size7} label="Size7"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size8' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size8']} value={field.size8} label="Size8"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size9' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) } modelName={[field.name, 'size9']} value={field.size9} label="Size9"></Textbox>

                                                            <Textbox noPlaceholder withoutMargin showLabel={false} disabled className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'qty' ]} required="false"  modelName={[field.name, 'qty']} value={field.qty} label="Qty"></Textbox>

                                                            

                                                        </div>
                                                    </div>
                                                    <div className="col-md-1">
                                                    { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobwork_inward_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}
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
                                <div className="row flex-nowarp">
                                    <div className="col-md-0"></div>
                                    <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Total" label="Total" required="false"></Textbox>
                                    {/* <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty Bags" label="Qty Bags" required="false"></Textbox> */}
                                    {/* <Textbox noPlaceholder modelName="inventory_qty_bag_total" withoutMargin showLabel={false} className="col-md-2" disabled value={this.state.formData.inventory_qty_bag_total} 
                                     label="Total Qty Bags" required="false"></Textbox> */}
                                    <Textbox noPlaceholder modelName="size1_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size1_total} label="Size1" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size2_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size2_total} label="Size2" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size3_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size3_total} label="Size3" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size4_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size4_total} label="Size4" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size5_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size5_total} label="Size5" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size6_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size6_total} label="Size6" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size7_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size7_total} label="Size7" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size8_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size8_total} label="Size8" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="size9_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData._total} label="Size9" required="false"></Textbox>
                                    <Textbox noPlaceholder modelName="inventory_qty_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.inventory_qty_total} label="Qty" required="false"></Textbox>
                                </div>
                            </div>
                        </div>
                     {/* <div className="row">
                        <div className="col-md-12">
                            <Divider plain orientation="left" >Products</Divider>
                            <div className="row">
                            <Selectbox modelName="fabric_id" label="Fabric" className="col-md-6" options={this.state.fabric} value={this.state.fabric_id}  ></Selectbox>
                                <Textbox label="Gsm" modelName="gsm"  className="col-md-2"></Textbox>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddJobwork_Inward ));