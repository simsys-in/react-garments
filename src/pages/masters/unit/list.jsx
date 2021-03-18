import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
// import DataTable from '../../../components/Datatable/Datatable';

class ListUnit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'Unit',
          dataIndex: 'unit',
          width: "25vw",
          key: 'unit',
          defaultSortOrder: 'ascend',
          // render: (text, record) => <p>{ 1 }</p>,
        },
        {
            title: 'Decimal Digit',
            dataIndex: 'decimal_digit',
            width: "25vw",
            key: 'decimal_digit',
            defaultSortOrder: 'ascend',
            render: (text, record) => <p>{text}</p>,
          },
        {
          title: 'Narration',
          dataIndex: 'narration',
          width: "25vw",
          key: 'narration',
          defaultSortOrder: 'ascend',
          render: (text, record) => <p>{text}</p>,
        },
       
        {
          title: 'Action',
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
      data: [],
      dataArrived: false
    }
  }

  editUnit = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_unit/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('masters/unit?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteUnit= (user) => {
    const id = user.id
    console.log(id);
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
    getRequest('masters/unit').then(data => {
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
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_unit") }}> Add </Button>
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


export default withRouter(ListUnit);