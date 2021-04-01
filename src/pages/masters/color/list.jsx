import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';

class ListColor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPrint : false,
      selectedItem : {},
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
          label: 'Color',
          field: 'color',
          width: "60vw",
          key: 'color',
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
              <Button type="primary" onClick={() => this.editColor(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteColor(record)} icon={<DeleteOutlined />} size="middle" />
              <Button type="primary" onClick={() => this.printColor(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editColor = (id) => {
    console.log(id);
    this.props.history.push('/masters/edit_color/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('masters/color?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  deleteColor = (user) => {
    const id = user.id
    console.log(id);
    const name = user.color;
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
      title: 'List Color',
      metaDescription: 'List Color'
    });
    getRequest('masters/color').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action = <Space size="middle">
          <Button type="primary" onClick={() => this.editColor(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" danger onClick={() => this.deleteColor(item)} icon={<DeleteOutlined />} size="middle" />
          <Button type="default" onClick={() => this.showPrint(item)} icon={<PrinterOutlined />} size="middle" />
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

  hideMoal = () => {
    this.setState({
      ...this.state,
      showPrint : false,
      selectedItem : {}
    })
  }

  showPrint = (record) => {

    this.setState({
      ...this.state,
      showPrint : true,
      selectedItem : record
    })
  }

  printColor = () => {
    var printContents = document.getElementById('printable-area').innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
     window.location.reload();
  }

  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-10"></div>
          <div className="col-md-2" align="right">
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_color") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        {/* <Table className="table-scroll" columns={this.state.columns}  dataSource={this.state.data} /> */}
        <DataTable data={this.state} ></DataTable>
        {/* { this.state.showPrint && */}
         <Modal
          title="Color Details"
          centered
          visible={this.state.showPrint}
          onOk={() => this.printColor()}
          okText="Print"
          onCancel={() => this.hideMoal(false)}
        >
          <div id="printable-area">
            <h4>Color Details</h4>
            <br/>
            <h5>Color Name : { this.state.selectedItem.color }</h5>
            <h5>Color ID : { this.state.selectedItem.id }</h5>
            <table border="1">
              <thead>
                <tr>
                  <th width="200px">Color</th>
                  <th width="200px">ID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.selectedItem.color}</td>
                  <td>{this.state.selectedItem.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
         {/* } */}
      </Fragment>
    )
  }
}


export default withRouter(ListColor);