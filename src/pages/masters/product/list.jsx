import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          label: 'S.No',
          field: 'sno',
          width: "300px",
          key: 'sno',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'Product',
          field: 'product',
          width: "300px",
          key: 'product',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'QR Code',
          field: 'qrcode',
          width: "300px",
          key: 'qrcode',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'Group',
          field: 'product_group',
          width: "300px",
          key: 'product_group',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'Category',
          field: 'product_category',
          width: "300px",
         
        },
       
        {
          label: 'Unit',
          field: 'unit',
          width: "300px",
          key: 'unit',
          defaultSortOrder: 'ascend',
          // render : (text, row) => 
          //   <p>{ text.toUpperCase() }</p>
        },
       
        
        {
          label: 'Action',
          field: 'action',
          key: 'action',
          width: "250px",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editProduct(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteProduct(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editProduct = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_product/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/product?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteProduct = (user) => {
    const id = user.id
    console.log(id);
    const name = user.product;
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
      title: 'List Product',
      metaDescription: 'List Product'
    });
    getRequest('garments/product').then(data => {
      if (data.status === "success") {
        var newData = [];
        // data.data.map(dt => {
        //   var newArr = [];
        //   Object.entries(dt).map(item => {
        //     newArr.push(item[1]);
        //   })
        //   newData.push(newArr);
        // })
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action =   <Space size="middle">
          <Button type="primary" onClick={() => this.editProduct(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteProduct(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_product") }}> Add </Button>
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


export default withRouter(ListProduct);