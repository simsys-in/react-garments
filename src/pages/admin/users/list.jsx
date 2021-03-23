import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      
        {
          label: 'S. No',
          field: 'sno',
          width: "10vw",
        
        },
      
        {
          label: 'Mobile ',
          field: 'mobile',
          width: "60vw",
     
        },
        {
          label: 'Password ',
          field: 'password',
          width: "60vw",
     
        },
        {
          label: 'User Group ',
          field: 'user_group',
          width: "60vw",
     
        },
        {
          label: 'Email ',
          field: 'email',
          width: "60vw",
     
        },
        {
          label: 'Name ',
          field: 'name',
          width: "60vw",
     
        },
        
        {
          label: 'Action',
          field:'action',
          key: 'action',
          width: "30vw",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editUser(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteUser(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editUser = (id) => {
    console.log(id);
    this.props.history.push('/user/edit_user/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('user/user?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteUser = (user) => {
    const id = user.id
    console.log(id);
    const name = user.user;
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure want to delete ' + name + " ?",
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => this.confirmDelete(id)
    });
  }

  componentDidMount = () => {
    seo({
      title: 'List User',
      metaDescription: 'List User'
    });
    getRequest('user/user').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action = <Space size="middle">
          <Button type="primary" onClick={() => this.editUser(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteUser(item)} icon={<DeleteOutlined />} size="middle" />
        </Space>

        newData.push(item)
        })
        this.setState({
          ...this.state,
          rows: newData,
        })
      }
    })
    // }
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-10"></div>
          <div className="col-md-2" align="right">
            <Button type="primary" onClick={() => { this.props.history.push("/user/add_user") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        {/* <Table className="table-scroll" style={{ width : '100%' }} columns={this.state.columns}  dataSource={this.state.data} /> */}
        <DataTable data={this.state}></DataTable>
      </Fragment>
    )
  }
}


export default withRouter(ListUser);