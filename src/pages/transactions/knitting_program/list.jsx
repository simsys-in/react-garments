import React, { PureComponent, Fragment } from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { getRequest, deleteRequest } from '../../../helpers/apihelper';
import { seo } from '../../../helpers/default';
import { withRouter } from 'react-router';
import DataTable from '../../../components/Datatable';
// import Report from './report';

class ListKnittingProgram extends PureComponent {
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
          label: 'Vou No',
          field: 'vouno',
          width: "30vw",
        },
        {
          label: 'Vou Date',
          field: 'vou_date',
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
              <Button type="primary" onClick={() => this.editKnittingProgram(record.id)} icon={<EditOutlined />} size="middle" />
              <Button type="default" color="error" danger onClick={() => this.deleteKnittingProgram(record)} icon={<DeleteOutlined />} size="middle" />
            </Space>
          ),
        },
      ],
      rows: [],
      dataArrived: false
    }
  }

  editKnittingProgram = (id) => {
    // console.log(id);
    this.props.history.push('/transactions/edit_knitting_program/' + id)
  }

  confirmDelete = (id) => {
    deleteRequest('garments/knittingProgram?id=' + id).then(data => {
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
      // window.location.reload();
    })
  }

  showPrint = (record) => {

    this.setState({
      ...this.state,
      showPrint : true,
      selectedItem : record
    })
  }



  deleteKnittingProgram = (user) => {
    const id = user.id
    // console.log(id);
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
      title: 'List Knitting Program',
      metaDescription: 'List Knitting Program'
    });
    getRequest('garments/knittingProgram').then(data => {
      if (data.status === "success") {
        var newData = [];
        data.data.map((item, index) =>{
          item.sno = index +1;
          item.action =  <Space size="middle">
          <Button type="primary" onClick={() => this.editKnittingProgram(item.id)} icon={<EditOutlined />} size="middle" />
          <Button type="default" color="error" danger onClick={() => this.deleteKnittingProgram(item)} icon={<DeleteOutlined />} size="middle" />
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
            <Button type="primary" onClick={() => { this.props.history.push("/transactions/add_knitting_program") }}> Add </Button>
          </div>
          <br />
          <br />
        </div>
        <DataTable data={this.state} ></DataTable>

        {/* <Modal
          title="Knitting Program"
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


export default withRouter(ListKnittingProgram);