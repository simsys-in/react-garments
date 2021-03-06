import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListProcess extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      
        {
          label: 'S.No',
          field: 'sno',
          width: "10vw",
          key: 'sno',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
        {
          label: 'Process',
          field: 'process',
          width: "60vw",
          key: 'process',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
       
        {
          label: 'Action',
          key: 'action',
          field: 'action',
          width: "30vw",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editProcess(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteProcess(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editProcess = (id) => {
    // console.log(id);
    this.props.history.push('/masters/edit_process/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/process?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteProcess = (user) => {
    const id = user.id
    // console.log(id);
    const name = user.process;
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
      title: 'List Process',
      metaDescription: 'List Process'
    });
    getRequest('garments/process').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action = <Space size="middle">
          <Button type="primary" onClick={() => this.editProcess(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteProcess(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_process") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        {/* <Table className="table-scroll" columns={this.state.columns}  dataSource={this.state.data} /> */}
        <DataTable data={this.state} ></DataTable>
      </Fragment>
    )
  }
}


export default withRouter(ListProcess);