import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Table, Checkbox  } from 'antd';
import { connect } from 'react-redux';
import { seo } from '../../../helpers/default';
import { getRequest, postRequest, putRequest } from '../../../helpers/apihelper';
import { withRouter } from 'react-router';
import moment from 'moment';
import Textbox from '../../../components/Inputs/Textbox';
import Selectbox from '../../../components/Inputs/Selectbox';
import Numberbox from '../../../components/Inputs/Numberbox';
import Address_Template from '../../../components/Templates/Address_Template';


let interval;


class AddUser_Group extends PureComponent{
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.tenant_id = this.props.match.params.tenant_id;
        this.state = {
            buttonDisabled : true,
            passwordMisMatched : false,
            formData : {
                status : 'active'
            },
            dataSource : [],
            columns : [
                {
                    title: "Menu",
                    dataIndex: "menu",
                    key: "menu",
                    width : '50vw',
                    // render: (value, record, rowIndex) => (
                    //   <Checkbox
                    //     checked={value}
                    //     onChange={this.handleCheckboxChangeFactory(rowIndex, "name")}
                    //   />
                    // )
                  },
                  {
                    title: "Add",
                    dataIndex: "add_permission",
                    key: "add_permission",
                    width : '10vw',
                    render: (value, record, rowIndex) => (
                      <Checkbox
                        checked={value}
                        onChange={this.handleCheckboxChangeFactory(rowIndex, "add_permission")}
                      />
                    )
                  },
                  {
                    title: "Edit",
                    dataIndex: "edit_permission",
                    key: "edit_permission",
                    width : '10vw',
                    render: (value, record, rowIndex) => (
                      <Checkbox
                        checked={value}
                        onChange={this.handleCheckboxChangeFactory(rowIndex, "edit_permission")}
                      />
                    )
                  },
                  {
                    title: "View",
                    dataIndex: "view_permission",
                    key: "view_permission",
                    width : '10vw',
                    render: (value, record, rowIndex) => (
                      <Checkbox
                        checked={value}
                        onChange={this.handleCheckboxChangeFactory(rowIndex, "view_permission")}
                      />
                    )
                  },
                  {
                    title: "Delete",
                    dataIndex: "delete_permission",
                    key: "delete_permission",
                    width : '10vw',
                    render: (value, record, rowIndex) => (
                      <Checkbox
                        checked={value}
                        onChange={this.handleCheckboxChangeFactory(rowIndex, "delete_permission")}
                      />
                    )
                  }
            ],
            companiesList : []
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

    handleCheckboxChangeFactory = (rowIndex, columnKey) => (event) => {
        const newCheckboxState = [...this.state.dataSource];
        newCheckboxState[rowIndex][columnKey] = event.target.checked;
        // setCheckboxState(newCheckboxState);
        this.setState({
            ...this.state,
            dataSource : newCheckboxState
        })
      };
    

      getMenuList = () => {
          getRequest('core/getAllMenusForUserPermission?user_group_id=' + this.id).then(data => {
              if(data.status === "info")
              {
                  this.setState({
                      ...this.state,
                      dataSource : data.data
                  })
              }
          })
      }

    getUser_Group = () => {
        console.log(this.id)
        if(this.id)
        {
            getRequest("core/user_group?id=" + this.id).then(data => {
                // data.data[0].dob = moment(data.data[0].dob)
                console.log(data.data[0])
                this.formRef.current.setFieldsValue(data.data[0]);
            })

        }
        else{
            this.formRef.current.setFieldsValue(this.state.formData);
            this.formRef.current.validateFields();
        }
    }

    componentDidMount() {
        this.getMenuList();
        this.getUser_Group();
        interval = setInterval(() => {
            this.validate()
        }, 100);
      }
    
      componentWillUnmount() {
        clearInterval(interval);
      }

    componentWillMount = () => {
        seo({
            title: 'Add User Group',
            metaDescription: 'Add User Group'
          });

          if(this.id)
          {
            seo({
                title: 'Edit User Group',
                metaDescription: 'Edit User Group'
              });
              console.log("Edit Page");
            }
    }

    onFinish = values => {
        this.setState({
            ...this.state,
            buttonLoading : true
        },() => {
            values.menuList = this.state.dataSource;
            putRequest('core/user_group?id=' + this.id, {...this.state.formData, menuList : this.state.dataSource}).then(data => {
                if(data.status === "success")
                {
                    this.props.history.push('/user/list_user_group')
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

    


    render(){
        return(
            <Fragment>
                <div className="row">
                    <div className="col-md-12" align="right">
                        <Button type="default" htmlType="button" onClick={ () => { this.props.history.push('/user/list_user_group') } }>
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
                        <Textbox label="User Group" autoFocus modelName="user_group" className="col-md-4"></Textbox>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Table pagination={false} columns={this.state.columns} dataSource={this.state.dataSource} />
                            <br/><br/>
                        </div>
                    </div>
                   

                    <div className="row">
                        <div className="col-md-12">
                            <Form.Item>
                                <Button type="primary" disabled={ this.state.buttonDisabled } onClick={this.onFinish} htmlType="submit" loading={this.state.buttonLoading}>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddUser_Group));