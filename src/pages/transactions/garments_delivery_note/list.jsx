import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';
import Report from './report';

class ListGarmentsDeliveryNote extends PureComponent {
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
          label: 'Ledger ',
          field: 'ledger',
          width: "10vw",
        },

        {
            label: 'Qty',
            field: 'inventory_qty_total',
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
              <Button type="primary" onClick={() => this.editGarmentsDeliveryNote(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteGarmentsDeliveryNote(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editGarmentsDeliveryNote = (id) => {
    console.log(id);
    this.props.history.push('/transactions/edit_garments_delivery_note/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/garmentsDeliveryNote?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

  
  hideMoal = () => {
    this.setState({
      ...this.state,
      showPrint : false,
      selectedItem : {}
    }, () => {
      window.location.reload();
    })
  }

  showPrint = (record) => {

    this.setState({
      ...this.state,
      showPrint : true,
      selectedItem : record
    })
  }



  deleteGarmentsDeliveryNote = (user) => {
    const id = user.id
    console.log(id);
    const name = user.vouno;
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
      title: 'List Garments Delivery Note',
      metaDescription: 'List Garments Delivery Note'
    });
    getRequest('garments/garmentsDeliveryNote').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action =  <Space size="middle">
          <Button type="primary" onClick={() => this.editGarmentsDeliveryNote(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteGarmentsDeliveryNote(item)} icon={<DeleteOutlined />} size="middle" />
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

  
  printDiv = () => {
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
            <Button type="primary" onClick={() => { this.props.history.push("/transactions/add_garments_delivery_note") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        <DataTable data={this.state} ></DataTable>

        <Modal
          title="Garments Delivery Note"
          centered
          width={1000}
          visible={this.state.showPrint}
          onOk={() => this.printDiv()}
          okText="Print"
          onCancel={() => this.hideMoal(false)}
        >
          <Report itemId={this.state.selectedItem.id} id="printable-area" />
        </Modal>

      </Fragment>
    )
  }
}


export default withRouter(ListGarmentsDeliveryNote);