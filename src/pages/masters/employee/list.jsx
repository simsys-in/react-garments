import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListEmployee extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'S.No',
          field: 'sno',
          width: "300px",
         
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'Employee',
          field: 'employee',
          width: "300px",
    
        },
        {
          label: 'Code',
          field: 'employee_code',
          width: "300px",
          
        },
        
        {
          label: 'Mobile',
          field: 'mobile',
          width: "300px",
       
        },
        {
          label: 'Employee Category',
          field: 'employee_category',
          width: "300px",
    
        },
        {
          label: 'Action',
          key: 'action',
          field : 'action',
          width: "250px",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editEmployee(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteEmployee(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editEmployee = (id) => {
    // console.log(id);
    this.props.history.push('/masters/edit_employee/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/employee?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteEmployee = (user) => {
    const id = user.id
    // console.log(id);
    const name = user.employee;
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
      title: 'List Employee',
      metaDescription: 'List Employee'
    });
    getRequest('garments/employee').then(data => {
      if (data.status === "success") {
        var newData = [];

          data.data.map((item,index) => {
            item.sno = index +1;
            item.action =  <Space size="middle">
              <Button type="primary" onClick={() => this.editEmployee(item.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteEmployee(item)} icon={<DeleteOutlined />} size="middle" />
            </Space>
            item.status =  <Tag color={ item.status === "inactive" ? "error" : "green" } key={item.status}>
               { item.status ? item.status.toUpperCase() : "Active"}
              </Tag>
            newData.push(item);
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_employee") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        {/* <Table className="table-scroll" columns={this.state.columns}  dataSource={this.state.data} /> */}
        <DataTable data={this.state}></DataTable>
      </Fragment>
    )
  }
}


export default withRouter(ListEmployee);