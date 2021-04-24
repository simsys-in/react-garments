import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined , PrinterOutlined} from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';
// import Report from './report';

class ListVoucher extends PureComponent {
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
          label: 'Voucher Type',
          field: 'voutype',
          width: "30vw",
        },
       
        {
          label: 'Voucher Route',
          field: 'vou_route',
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
              <Button type="primary" onClick={() => this.editVoucher(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteVoucher(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editVoucher = (id) => {
    // console.log(id);
    this.props.history.push('/masters/edit_voucher/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/voucher?id=' + id).then(data => {
      if (data.status === "info") {
        this.props.history.go(0)
      }
    })
  }

//   hideMoal = () => {
//     this.setState({
//       ...this.state,
//       showPrint : false,
//       selectedItem : {}
//     }, () => {
//       window.location.reload();
//     })
//   }

//   showPrint = (record) => {

//     this.setState({
//       ...this.state,
//       showPrint : true,
//       selectedItem : record
//     })
//   }



  deleteVoucher = (user) => {
    const id = user.id
    // console.log(id);
    const name = user.voutype;
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
      title: 'List Voucher',
      metaDescription: 'List Voucher'
    });
    getRequest('garments/voucher').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action =  <Space size="middle">
          <Button type="primary" onClick={() => this.editVoucher(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteVoucher(item)} icon={<DeleteOutlined />} size="middle" />
          {/* <Button type="default" onClick={() => this.showPrint(item)} icon={<PrinterOutlined />} size="middle" /> */}

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

//   printDiv = () => {
//     var printContents = document.getElementById('printableArea').innerHTML;
//      var originalContents = document.body.innerHTML;

//      document.body.innerHTML = printContents;

//      window.print();

//      document.body.innerHTML = originalContents;
//      window.location.reload();
//   }


  render() {
    return (
      <Fragment>
        <div className="row">
          <div className="col-md-10"></div>
          <div className="col-md-2" align="right">
            <Button type="primary" onClick={() => { this.props.history.push("/masters/add_voucher") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        {/* <Table className="table-scroll" columns={this.state.columns}  dataSource={this.state.data} /> */}
        <DataTable data={this.state} ></DataTable>
        {/* <Modal
          title="Voucher"
          centered
          width={1000}
          visible={this.state.showPrint}
          onOk={() => this.printDiv()}
          okText="Print"
          onCancel={() => this.hideMoal(false)}
        >
          <Report itemId={this.state.selectedItem.id} id="printableArea" />
        </Modal> */}
      </Fragment>
    )
  }
}


export default withRouter(ListVoucher);