import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListMenumaster extends PureComponent {
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
          label: 'Menu ',
          field: 'menu',
          width: "60vw",
     
        },
        {
          label: 'Sts ',
          field: 'sts',
          width: "60vw",
     
        },
        {
          label: 'Menu Route ',
          field: 'menu_route',
          width: "60vw",
     
        },
        {
          label: 'Sort Order ',
          field: 'sort_order',
          width: "60vw",
     
        },
        {
          label: 'Method ',
          field: 'method',
          width: "60vw",
     
        },
        {
          label: 'Icon ',
          field: 'icon',
          width: "60vw",
     
        },
        {
          label: 'Addon ',
          field: 'addon',
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
              <Button type="primary" onClick={() => this.editMenu_Master(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteMenu_Master(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editMenu_Master = (id) => {
    console.log(id);
    this.props.history.push('/user/edit_menu_master/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('core/menu_master?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteMenu_Master = (user) => {
    const id = user.id
    console.log(id);
    const name = user.menu_master;
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
      title: 'List Menu Master',
      metaDescription: 'List Menu Master'
    });
    getRequest('core/menu_master').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action = <Space size="middle">
          <Button type="primary" onClick={() => this.editMenu_Master(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteMenu_Master(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/user/add_menu_master") }}> Add </Button>
          </div>
          <br />
        </div>
        {/* <Table className="table-scroll" style={{ width : '100%' }} columns={this.state.columns}  dataSource={this.state.data} /> */}
        <DataTable data={this.state}></DataTable>
      </Fragment>
    )
  }
}


export default withRouter(ListMenumaster);