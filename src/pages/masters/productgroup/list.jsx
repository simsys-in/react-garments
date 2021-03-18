import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
// import DataTable from '../../../components/Datatable/Datatable';

class ListProductGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Product Group',
          dataIndex: 'product_group',
          width: "40vw",
          key: 'product_group',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          title: 'Narration',
          dataIndex: 'narration',
          width: "30vw",
          key: 'narration',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
       
        {
          title: 'Action',
          key: 'action',
          width: "30vw",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editProductGroup(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteProductGroup(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      data: [],
      dataArrived: false
    }
  }

  editProductGroup = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_product_group/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('masters/product_group?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteProductGroup= (user) => {
    const id = user.id
    console.log(id);
    const name = user.product_group;
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
      title: 'List Product Group',
      metaDescription: 'List Product Group'
    });
    getRequest('masters/product_group').then(data => {
      if (data.status === "success") {
        var newData = [];
        // data.data.map(dt => {
        //   var newArr = [];
        //   Object.entries(dt).map(item => {
        //     newArr.push(item[1]);
        //   })
        //   newData.push(newArr);
        // })
        this.setState({
          ...this.state,
          data: data.data,
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_product_group") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        <Table className="table-scroll" columns={this.state.columns}  dataSource={this.state.data} />
        {/* <DataTable columns={this.state.columns} dataSource={this.state.data}></DataTable> */}
      </Fragment>
    )
  }
}


export default withRouter(ListProductGroup);