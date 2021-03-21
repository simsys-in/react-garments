import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListMaster extends PureComponent {
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
          label: 'Master',
          field: 'master',
          width: "60vw",
          key: 'master',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
        {
          label: 'Master Group',
          field: 'master_group',
          width: "60vw",
          key: 'master_group',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
        {
          label: 'Narration',
          field: 'narration',
          width: "60vw",
          key: 'narration',
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
              <Button type="primary" onClick={() => this.editMaster(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteMaster(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editMaster = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_master/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('masters/master?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteMaster = (user) => {
    const id = user.id
    console.log(id);
    const name = user.master;
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
      title: 'List Master',
      metaDescription: 'List Master'
    });
    getRequest('masters/master').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action = <Space size="middle">
          <Button type="primary" onClick={() => this.editMaster(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteMaster(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_master") }}> Add </Button>
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


export default withRouter(ListMaster);