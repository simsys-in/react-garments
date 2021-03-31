import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';
import { getStandardDate } from '../../../helpers/timer'

class ListCuttingProgram extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'S.No',
          field: 'sno',
          width: "300px",
         
        },
        {
          label: 'Order No',
          field: 'order_no',
          width: "300px",
         
        },
        {
          label: 'Vou. Date',
          field: 'vou_date',
          width: "300px",
         
        },
        {
          label: 'Lot No.',
          field: 'lotno',
          width: "300px",
        },
        {
          label: 'Action',
          field: 'action',
          key: 'action',
          width: "250px",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editCuttingProgram(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteCuttingProgram(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editCuttingProgram = (id) => {
    console.log(id);
    this.props.history.push('/transactions/edit_cutting_program/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('transactions/CuttingProgram?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteCuttingProgram = (user) => {
    const id = user.id
    console.log(id);
    const name = user.lotno;
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
      title: 'List Cutting Program',
      metaDescription: 'List Cutting Program'
    });
    getRequest('transactions/cuttingProgram').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.vou_date = getStandardDate(item.vou_date) ;
          item.action =   <Space size="middle">
          <Button type="primary" onClick={() => this.editCuttingProgram(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteCuttingProgram(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/transactions/add_cutting_program") }}> Add </Button>
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


export default withRouter(ListCuttingProgram);