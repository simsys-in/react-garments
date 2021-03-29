import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListFabricOutward extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      
        {
          label: 'S.No',
          field: 'sno',
          width: "10vw",
          defaultSortOrder: 'ascend',
          
        },
        {
          label: 'Vou Date',
          field: 'vou_date',
          width: "30vw",
        },
       
        {
          label: 'Vou No',
          field: 'vouno',
          width: "30vw",
        },
        
        {
          label: 'Ledger Name',
          field: 'ledger',
          width: "10vw",
        },
       
        {
          label: 'Action',
          key: 'action',
          field: 'action',
          width: "30vw",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editFabricOutward(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteFabricOutward(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editFabricOutward = (id) => {
    console.log(id);
    this.props.history.push('/transactions/edit_fabric_outward/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('transactions/fabric_outward?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteFabricOutward = (user) => {
    const id = user.id
    console.log(id);
    const name = user.ledger;
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
      title: 'List Fabric Outward',
      metaDescription: 'List Fabric Outward'
    });
    getRequest('transactions/fabricOutward').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action =  <Space size="middle">
          <Button type="primary" onClick={() => this.editFabricOutward(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteFabricOutward(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/transactions/add_fabric_outward") }}> Add </Button>
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


export default withRouter(ListFabricOutward);