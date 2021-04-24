import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';
import Item from 'antd/lib/list/Item';

class ListUnit extends PureComponent {
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
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
          label: 'Unit',
          field: 'unit',
          width: "15vw",
          key: 'unit',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
            label: 'Decimal Digit',
            field: 'decimal_digit',
            width: "25vw",
            key: 'decimal_digit',
            defaultSortOrder: 'ascend',
            render: (text, record) => <p>{text}</p>,
          },
        {
          label: 'Narration',
          field: 'narration',
          width: "25vw",
          key: 'narration',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
       
        {
          label: 'Action',
          field: 'action',
          key: 'action',
          width: "25vw",
          defaultSortOrder: 'ascend',
          render: (text, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => this.editUnit(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteUnit(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editUnit = (id) => {
    // console.log(id);
    this.props.history.push('/masters/edit_unit/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/unit?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteUnit= (user) => {
    const id = user.id
    // console.log(id);
    const name = user.unit;
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
      title: 'List Unit',
      metaDescription: 'List Unit'
    });
    getRequest('garments/unit').then(data => {
      if (data.status === "success") {
        var newData = [];
        // data.data.map(dt => {
        //   var newArr = [];
        //   Object.entries(dt).map(item => {
        //     newArr.push(item[1]);
        //   })
        //   newData.push(newArr);
        // })
        data.data.map((item,index)=>{
        item.sno = index +1;
        item.action =  <Space size="middle">
        <Button type="primary" onClick={() => this.editUnit(item.id)} icon={<EditOutlined />} size="middle" />
        <Button type="default" color="error" danger onClick={() => this.deleteUnit(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_unit") }}> Add </Button>
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


export default withRouter(ListUnit);