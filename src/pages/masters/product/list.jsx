import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
// import DataTable from '../../../components/Datatable/Datatable';

class ListProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Product Group',
          dataIndex: 'product_group_id',
          width: "300px",
          key: 'product_group_id',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          title: 'Product Category',
          dataIndex: 'product_category_id',
          width: "300px",
          key: 'product_category_id',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
        {
          title: 'Product',
          dataIndex: 'product',
          width: "300px",
          key: 'product',
          defaultSortOrder: 'ascend',
          // render : (text, row) => 
          //   <p>{ text.toUpperCase() }</p>

        },
        {
          title: 'Unit',
          dataIndex: 'unit_id',
          width: "300px",
          key: 'unit_id',
          defaultSortOrder: 'ascend',
          // render : (text, row) => 
          //   <p>{ text.toUpperCase() }</p>
        },
        {
          title: 'QR Code',
          dataIndex: 'qrcode',
          width: "300px",
          key: 'qrcode',
          defaultSortOrder: 'ascend',
        },
        {
          title: 'Narration',
          dataIndex: 'narration',
          width: "300px",
          key: 'narration',
          defaultSortOrder: 'ascend',
        },
        {
          title: 'Pur Rate',
          dataIndex: 'purchase_rate',
          width: "300px",
          key: 'purchase_rate',
          defaultSortOrder: 'ascend',
        },
        {
          title: 'Sale Rate',
          key: 'sale_rate',
          width: "250px",
          dataIndex: 'sale_rate',
          defaultSortOrder: 'ascend',
          // render: status => (
          //   <>
          //   <Tag color={ status === "inactive" ? "error" : "green" } key={status}>
          //     { status ? status.toUpperCase() : ""}
          //   </Tag>
          //   </>
          // ),
        },
        {
            title: 'Quantity',
            dataIndex: 'qty',
            width: "300px",
            key: 'qty',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Pur Rate Last',
            dataIndex: 'purchase_rate_last',
            width: "300px",
            key: 'purchase_rate_last',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Min Stock Qty',
            dataIndex: 'purchase_rate',
            width: "300px",
            key: 'purchase_rate',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'HSN/SAC',
            dataIndex: 'hsnsac',
            width: "300px",
            key: 'hsnsac',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'GST %',
            dataIndex: 'gst',
            width: "300px",
            key: 'gst',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'SGST %',
            dataIndex: 'sgst',
            width: "300px",
            key: 'sgst',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'CGST %',
            dataIndex: 'cgst',
            width: "300px",
            key: 'cgst',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Sts',
            dataIndex: 'sts',
            width: "300px",
            key: 'sts',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Unit2',
            dataIndex: 'unit2_id',
            width: "300px",
            key: 'unit2_id',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Unit2 Convert',
            dataIndex: 'unit2_convert',
            width: "300px",
            key: 'unit2_convert',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Clo Qty',
            dataIndex: 'clo_qty',
            width: "300px",
            key: 'clo_qty',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Status',
            dataIndex: 'status_id',
            width: "300px",
            key: 'status_id',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Pur Amt incl Tex',
            dataIndex: 'purchase_rate_incltax',
            width: "300px",
            key: 'purchase_rate_incltax',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Sales Amt incl Tex',
            dataIndex: 'sales_rate_incltax',
            width: "300px",
            key: 'sales_rate_incltax',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Pur Amount',
            dataIndex: 'purchase_amount',
            width: "300px",
            key: 'purchase_amount',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Sales Amount',
            dataIndex: 'sales_amount',
            width: "300px",
            key: 'sales_amount',
            defaultSortOrder: 'ascend',
          },
          {
            title: 'Alias',
            dataIndex: 'alias',
            width: "300px",
            key: 'alias',
            defaultSortOrder: 'ascend',
          },
        
        {
          title: 'Action',
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
      data: [],
      dataArrived: false
    }
  }

  editProduct = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_product/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('masters/product?id=' + id).then(data => {
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
    getRequest('masters/product').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map(dt => {
          var newArr = [];
          Object.entries(dt).map(item => {
            newArr.push(item[1]);
          })
          newData.push(newArr);
        })
        this.setState({
          ...this.state,
          data: newData,
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
        <Table className="table-scroll" columns={this.state.columns}  dataSource={this.state.data} />
        {/* <DataTable columns={this.state.columns} dataSource={this.state.data}></DataTable> */}
      </Fragment>
    )
  }
}


export default withRouter(ListProduct);