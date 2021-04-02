import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getRequest } from '../../../helpers/apihelper';
import { getStandardDate } from '../../../helpers/timer';


class Report extends PureComponent {
    constructor(props){
        super(props);
        this.state ={
            report_details : {},
            show_details : false,
            size1_total : 0,
            size2_total : 0,
            size3_total : 0,
            size4_total : 0,
            size5_total : 0,
            size6_total : 0,
            size7_total : 0,
            size8_total : 0,
            size9_total : 0,
            qty_total : 0
        }
    }

    componentDidMount = () => {
        getRequest('transactions/getJobworkOutwardReport?id=' + this.props.itemId).then(data => {
            if(data.status === "info")
            {
                var size1_total = 0;
                var size2_total = 0;
                var size3_total = 0;
                var size4_total = 0;
                var size5_total = 0;
                var size6_total = 0;
                var size7_total = 0;
                var size9_total = 0;
                var size8_total = 0;
                var qty_total = 0;

                data.data.color_details.map(item => {
                    size1_total += item.size1;
                    size2_total += item.size2;
                    size3_total += item.size3;
                    size4_total += item.size4;
                    size5_total += item.size5;
                    size6_total += item.size6;
                    size7_total += item.size7;
                    size8_total += item.size8;
                    size9_total += item.size9;
                    qty_total += item.qty;
                })

                this.setState({
                    ...this.state,
                    report_details : data.data,
                    show_details : true,
                    size1_total : size1_total,
                    size2_total : size2_total,
                    size3_total : size3_total,
                    size4_total : size4_total,
                    size5_total : size5_total,
                    size6_total : size6_total,
                    size7_total : size7_total,
                    size8_total : size8_total,
                    size9_total : size9_total,
                    qty_total : qty_total
                })
            }
        })
    }


    render(){
        const { report_details } = this.state;
        return(
            <Fragment>
                <div id="printable-area">
                { this.state.show_details &&
                <table border={1} style={{border:"lightgray", marginLeft:"5%",marginRight:"5%", marginTop:"5%", marginBottom:"5%"}}>
                    <tr>
                        
                        <td colSpan={2} style={{width:"30%"}} >
                            <table style={{marginLeft:"5%"}}>   
                                                         {/* <div className="col-6" style={{ border : '1px solid black' }} > */}
                             <tr style={{fontWeight:"bold"}}>   { report_details.company_details.company } </tr>
                            <tr>    <p> Address :  { report_details.company_details.address } </p> </tr>
                             <tr>   <p> Phone :  { report_details.company_details.phone } </p></tr>
                               <tr> <p> Mail :  { report_details.company_details.email } </p></tr>
                              <tr> <p> GSTIN :  <b style={{fontWeight:"bold"}}> { report_details.company_details.gstno } </b> </p></tr> 
                            {/* </div> */}
                            </table>

                         </td>
                         {/* <td style={{width:"20%"}}>

                         </td> */}
                         <td colSpan={2} style={{width:"50%"}}>
                          
                                <table border={1} width={"100%"} style={{border:"lightgray"}}>
                                    <tr> 
                                        <td colSpan={4} style={{ backgroundColor : 'lightgray', textAlign: 'center' }}> <b> DELIVERY NOTE </b> </td>
                                    </tr>
                                    <tr>
                                        <th> DC No </th>
                                        <td style={{fontWeight:"bold"}}> { report_details.dcno }</td>
                                        <th> Dated </th>
                                        <td style={{fontWeight:"bold"}}> { getStandardDate(report_details.vou_date)} </td>
                                    </tr>
                                    <tr>
                                        <th> Process </th>
                                        <td style={{fontWeight:"bold"}}> { report_details.process }</td>
                                        <th> HSN Code </th>
                                        <td style={{fontWeight:"bold"}}> {report_details.hsnsac} </td>
                                    </tr>
                                    <tr>
                                        <th> Order No </th>
                                        <td style={{fontWeight:"bold"}}> { report_details.order_no }</td>
                                        <th> Vehicle No </th>
                                        <td style={{fontWeight:"bold"}}> {report_details.vehicle_no} </td>
                                    </tr>
                                    <tr>
                                        <th> Product </th>
                                        <td style={{fontWeight:"bold"}}> { report_details.product }</td>
                                        <th>  </th>
                                        <td>  </td>
                                    </tr>
                                </table>
                        
                        </td>
                    </tr>
                            <tr>
                                <td colSpan={2} style={{width:"50%"}}>
                                <tr><p>Delivery to</p></tr>
                                    <table style={{marginLeft:"5%"}}>

                                <tr style={{fontWeight:"bold"}}><p><b>{ report_details.ledger_details.ledger } , </b></p> </tr>
                               <tr> <p>Address : { report_details.ledger_details.delivery_address }</p></tr>
                              <tr>  <p> Contact :{ report_details.ledger_details.mobile} </p></tr>
                              <tr>  <p><b> GSTIN :{ report_details.ledger_details.gstno} </b></p></tr>
                             
                                </table>
                                </td>

                                <td colSpan={2} style={{width:"50%"}}>
                                        <b style={{fontWeight:"bold"}}>ACCESSORIES</b>
                                    <table border={1} width="90%" style={{border:"lightgray",marginLeft:"5%"}}>
                                        { report_details.accessories.map(item => 
                                        <tr>

                                          <td>  { item.product }</td>
                                          <td>  { item.qty }
                                            { item.unit } </td>
                                           
                                        </tr>
                                    )}
                                       
                                    </table>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                            <td colSpan={4}>
                                     <table border={1} width="100%" style={{border:"lightgray"}}>
                                <thead>
                                 
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{fontWeight:"bold"}}>Color</td>
                                        { report_details.color_size_details.map((size,index) => 
                                        size !== "" &&
                                                <td style={{fontWeight:"bold"}}>{ size }</td>
                                            ) }
                                        <td style={{fontWeight:"bold"}}>Qty</td>
                                    </tr>
                                    { report_details.color_details.map(item => 
                                        <tr>

                                            <td>{ item.color }</td>
                                            { report_details.color_size_details.map((size,index) => 
                                        size !== "" &&
                                                <td>{ item["size" + Number(Number(index) + 1)] }</td>
                                            ) }
                                            {/* <td>{ item.size1 }</td>
                                            <td>{ item.size3 }</td>
                                            <td>{ item.size4 }</td>
                                            <td>{ item.size5 }</td>
                                            <td>{ item.size6 }</td>
                                            <td>{ item.size7 }</td>
                                            <td>{ item.size8 }</td>
                                            <td>{ item.size9 }</td> */}
                                            <td>{ item.qty }</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td> Grand Total</td>
                                        {/* <td>{this.state.size1_total}</td> */}
                                        
                                        { report_details.color_size_details.map((size,index) => 
                                        size !== "" &&
                                                <td style={{fontWeight:"bold"}}>{ this.state["size" + Number(Number(index) + 1) + "_total"] }</td>
                                            ) }
{/*                                         
                                        <td> {this.state.size2_total}</td>
                                        <td>{this.state.size3_total}</td>
                                        <td>{this.state.size4_total}</td>
                                        <td>{this.state.size5_total}</td>
                                        <td>{this.state.size6_total}</td>
                                        <td>{this.state.size7_total}</td>
                                        <td>{this.state.size8_total}</td>
                                        <td>{this.state.size9_total}</td> */}
                                        <td style={{fontWeight:"bold"}}>{this.state.qty_total}</td>
                                    </tr>
                                </tbody>
                            </table>
                            </td>
                            <td>

                            </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <p style={{textDecorationLine: 'underline'}}>Terms</p>
                                Any discrepancy found in this invoice should be notified
                                imediately Subject to "Tirupur Jurisdiction only."
                                </td>
                                <td>
                                    <br />
                                    <br />
                                Receiver's Seal Signature
                                </td>
                                <td  >
                                    For  <b style={{fontWeight:"bold"}}>{ report_details.company_details.company }</b>
                                </td>
                                <td>

                                </td>
                         </tr>

                        {/* </div> */}
                   
                </table>

}
</div>
            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        store: state
    }
}

const mapDispatchToProps = {
  }
  


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Report));
