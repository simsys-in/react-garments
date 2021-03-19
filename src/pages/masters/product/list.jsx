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
          label: 'Product Group',
          field: 'product_group_id',
          width: "300px",
          key: 'product_group_id',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'Product Category',
          field: 'product_category_id',
          width: "300px",
          key: 'product_category_id',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
        {
          label: 'Product',
          field: 'product',
          width: "300px",
          key: 'product',
          defaultSortOrder: 'ascend',
          // render : (text, row) => 
          //   <p>{ text.toUpperCase() }</p>

        },
        {
          label: 'Unit',
          field: 'unit_id',
          width: "300px",
          key: 'unit_id',
          defaultSortOrder: 'ascend',
          // render : (text, row) => 
          //   <p>{ text.toUpperCase() }</p>
        },
        {
          label: 'QR Code',
          field: 'qrcode',
          width: "300px",
          key: 'qrcode',
          defaultSortOrder: 'ascend',
        },
        {
          label: 'Narration',
          field: 'narration',
          width: "300px",
          key: 'narration',
          defaultSortOrder: 'ascend',
        },
        {
          label: 'Pur Rate',
          field: 'purchase_rate',
          width: "300px",
          key: 'purchase_rate',
          defaultSortOrder: 'ascend',
        },
        {
          label: 'Sale Rate',
          key: 'sale_rate',
          width: "250px",
          field: 'sale_rate',
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
            label: 'Quantity',
            field: 'qty',
            width: "300px",
            key: 'qty',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Pur Rate Last',
            field: 'purchase_rate_last',
            width: "300px",
            key: 'purchase_rate_last',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Min Stock Qty',
            field: 'purchase_rate',
            width: "300px",
            key: 'purchase_rate',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'HSN/SAC',
            field: 'hsnsac',
            width: "300px",
            key: 'hsnsac',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'GST %',
            field: 'gst',
            width: "300px",
            key: 'gst',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'SGST %',
            field: 'sgst',
            width: "300px",
            key: 'sgst',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'CGST %',
            field: 'cgst',
            width: "300px",
            key: 'cgst',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Sts',
            field: 'sts',
            width: "300px",
            key: 'sts',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Unit2',
            field: 'unit2_id',
            width: "300px",
            key: 'unit2_id',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Unit2 Convert',
            field: 'unit2_convert',
            width: "300px",
            key: 'unit2_convert',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Clo Qty',
            field: 'clo_qty',
            width: "300px",
            key: 'clo_qty',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Status',
            field: 'status_id',
            width: "300px",
            key: 'status_id',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Pur Amt incl Tex',
            field: 'purchase_rate_incltax',
            width: "300px",
            key: 'purchase_rate_incltax',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Sales Amt incl Tex',
            field: 'sales_rate_incltax',
            width: "300px",
            key: 'sales_rate_incltax',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Pur Amount',
            field: 'purchase_amount',
            width: "300px",
            key: 'purchase_amount',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Sales Amount',
            field: 'sales_amount',
            width: "300px",
            key: 'sales_amount',
            defaultSortOrder: 'ascend',
          },
          {
            label: 'Alias',
            field: 'alias',
            width: "300px",
            key: 'alias',
            defaultSortOrder: 'ascend',
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