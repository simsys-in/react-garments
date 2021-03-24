import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListYarnreturn  extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'S.No',
          field: 'sno',
          width: "10vw",
        
        },
        {
          label: 'Ledger Name',
          field: 'ledger',
          width: "10vw",
        },
        {
          label: 'Narration',
          field: 'narration',
          width: "30vw",
        },
        {
          label: 'Vou Date',
          field: 'vou_date',
          width: "30vw",
        },
       
        {
          label: 'Process',
          field: 'process',
          width: "30vw",
        },
        {
          label: 'Ref No',
          field: 'refno',
          width: "30vw",
        },
        {
          label: 'Order No',
          field: 'order_no',
          width: "30vw",
        },
        
       
       
        {
          label: 'Action',
          key: 'action',
          field: 'action',
          width: "30vw",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editYarn_Return (record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteYarn_Return (record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editYarn_Return  = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_yarn_return /' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('masters/yarn_return ?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteYarn_Return  = (user) => {
    const id = user.id
    console.log(id);
    const name = user.yarn_return ;
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
      title: 'List Yarn Return ',
      metaDescription: 'List Yarn Return '
    });
    getRequest('masters/yarn_return ').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action =  <Space size="middle">
          <Button type="primary" onClick={() => this.editYarn_Return (item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteYarn_Return (item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_yarn_return ") }}> Add </Button>
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


export default withRouter(ListYarnreturn );