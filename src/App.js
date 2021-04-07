import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './App.less';
import  'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './style/theme.less'
// import './style/custom-antd.css'
import {Animated} from "react-animated-css";
// import { connect } from 'react-redux'
import { connect } from 'react-redux';
import {
  Router,
  Switch,
  Route,
  withRouter,
  Redirect
} from "react-router-dom";

import api from './api.js'


import { Layout, message } from 'antd';


///// Components
///// Components
///// Components

import Topbar from './components/Topbar.jsx'
import Sidebar from './components/Sidebar';
import Footerbar from './components/Footerbar';

/// Pages
/// Pages
/// Pages
/// Pages

import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'


/// Designation
import AddAddLess from './pages/masters/addless/add'
import ListAddLess from './pages/masters/addless/list'

/// Ledger
import AddLedger from './pages/masters/ledger/add'
import ListLedger from './pages/masters/ledger/list'
/// Product Category
import AddProductCategory from './pages/masters/product_category/add'
import ListProductCategory from './pages/masters/product_category/list'
///Ledger Group
import AddLedgerGroup from './pages/masters/ledger_group/add'
import ListLedgerGroup from './pages/masters/ledger_group/list'

///Ledger Category
import AddLedgerCategory from './pages/masters/ledger_category/add'
import ListLedgerCategory from './pages/masters/ledger_category/list'

import AddEmployeeCategory from './pages/masters/employee_category/add'
import ListEmployeeCategory from './pages/masters/employee_category/list'
/// Process
import AddProcess from './pages/masters/process/add'
import ListProcess from './pages/masters/process/list'
///size

import AddSize from './pages/masters/size/add'
import ListSize from './pages/masters/size/list'
///masters
import AddMaster from './pages/masters/master/add'
import ListMaster from './pages/masters/master/list'


/// Product Group
import AddProductGroup from './pages/masters/productgroup/add'
import ListProductGroup from './pages/masters/productgroup/list'

/// unit
import AddUnit from './pages/masters/unit/add'
import ListUnit from './pages/masters/unit/list'

/// product
import AddProduct from './pages/masters/product/add'
import ListProduct from './pages/masters/product/list'

/// color
import AddColor from './pages/masters/color/add'
import ListColor from './pages/masters/color/list'


/// Mastergroup
import AddMasterGroup from './pages/masters/master_group/add'
import ListMasterGroup from './pages/masters/master_group/list'

//yarn inward
import AddYarnInward from './pages/transactions/yarn_inward/add'
import ListYarnInward from './pages/transactions/yarn_inward/list'
// yarn outward
import AddYarnOutward from './pages/transactions/yarn_outward/add'
import ListYarnOutward from './pages/transactions/yarn_outward/list'

import AddYarnReturn from './pages/transactions/yarn_return/add'
import ListYarnReturn from './pages/transactions/yarn_return/list'


import AddJobworkinward from './pages/transactions/jobwork_inward/add'
import ListJobworkinward from './pages/transactions/jobwork_inward/list'

import AddYarnInvoice from './pages/transactions/yarn_invoice/add'
import ListYarnInvoice from './pages/transactions/yarn_invoice/list'



import AddMenuMaster from './pages/admin/menu_master/add'
import ListMenuMaster from './pages/admin/menu_master/list'

import AddUserGroup from './pages/admin/user_group/add'
import ListUserGroup from './pages/admin/user_group/list'

import AddUser from './pages/admin/users/add'
import ListUser from './pages/admin/users/list'
/// order
import AddOrderProgram  from './pages/transactions/order/add'
import ListOrderProgram from './pages/transactions/order/list'

/// FabricInward
import AddFabricInward  from './pages/transactions/fabric_inward/add'
import ListFabricInward from './pages/transactions/fabric_inward/list'

/// Fabricoutward
import AddFabricOutward  from './pages/transactions/fabric_outward/add'
import ListFabricOutward from './pages/transactions/fabric_outward/list'

/// FabricInvoice
import AddFabricInvoice  from './pages/transactions/fabric_invoice/add'
import ListFabricInvoice from './pages/transactions/fabric_invoice/list'


/// Fabricreturn
import AddFabricReturn  from './pages/transactions/fabric_return/add'
import ListFabricReturn from './pages/transactions/fabric_return/list'

import AddEmployee from './pages/masters/employee/add'
import ListEmployee from './pages/masters/employee/list'

/// Fabric
import AddCuttingProgram  from './pages/transactions/cutting_program/add'
import ListCuttingProgram from './pages/transactions/cutting_program/list'


import { postRequest } from './helpers/apihelper';
import { onLogOut } from './actions/login';

//jobwork_outwork
import AddJobworkOutward  from './pages/transactions/jobwork_outward/add'
import ListJobworkOutward from './pages/transactions/jobwork_outward/list'
///branch
import AddBranch from './pages/masters/branch/add'
import ListBranch from './pages/masters/branch/list'
//department
import AddDepartment from './pages/masters/department/add'
import ListDepartment from './pages/masters/department/list'
///bank
import AddBank from './pages/masters/bank/add'
import ListBank from './pages/masters/bank/list'






//designation
import AddDesignation  from './pages/masters/designation/add'
import ListDesignation from './pages/masters/designation/list'

///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////





///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////
///// Boopathi Workspace //////




///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////

//garments invoice
import AddGarmentsInvoice  from './pages/transactions/garments_invoice/add'
import ListGarmentsInvoice from './pages/transactions/garments_invoice/list'

//garments delivery note
import AddGarmentsDeliveryNote  from './pages/transactions/garments_delivery_note/add'
import ListGarmentsDeliveryNote from './pages/transactions/garments_delivery_note/list'

//garments receipt note
import AddGarmentsReceiptNote  from './pages/transactions/garments_receipt_note/add'
import ListGarmentsReceiptNote from './pages/transactions/garments_receipt_note/list'


///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////




///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////
///// Kowsalya Workspace //////





///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////




///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////
///// Hariprakash Workspace //////



//designation
import AddJobworkInvoice  from './pages/transactions/jobwork_invoice/add'
import ListJobworkInvoice from './pages/transactions/jobwork_invoice/list'


let interval;
const { Content } = Layout;
class App extends React.PureComponent
{
  constructor(props){
    super(props);
    this.state = {
      login : true
    }
  }

  componentDidMount = () => {
    interval = setInterval(() => {
      postRequest('user/verifyLogin').then(function(data){
        if(data.type === "unauthorized")
        {
          message.error(data.message);
        }
      })
    }, 10000);
    localStorage.setItem("api", api);
    
    postRequest('user/verifyLogin').then(function(data){
      if(data.type === "unauthorized")
      {
        message.error(data.message);
      }
    })
    if(!this.props.store.login.login)
    {
      this.props.onLogOut();
    }
  }
  
  componentWillUnmount() {
    clearInterval(interval);
  }

  render (){

    return (
          <Layout style={{ minHeight: '98vh' }}>
            { this.props.store.login.login ? 
              <Sidebar history={ this.props.history } />
          : null }
          <Layout className="site-layout" theme="dark">
            
          { this.props.store.login.login ? 
              <Topbar history={this.props.history} />
              : null }
            <Router history={this.props.history} >
            <Content style={{ marginLeft : this.props.store.login.sider_collapsed ? '80px' : '200px' }}>
                    { this.props.store.login.login ? 
                    <div className="main-content">
                      {/* <Animated animationIn="fadeInUp" animationOut="fadeInDown" animationInDuration={400} animationOutDuration={400} isVisible={true}> */}
                    <div className="main-container">
                            <Switch >

                              <Route exact path="/" component={Dashboard} />


                              {/* AddLess Mas */}
                              <Route exact path="/masters/add_addless" component={AddAddLess} />
                              <Route exact path="/masters/edit_addless/:id" component={AddAddLess} />
                              <Route exact path="/masters/list_addless" component={ListAddLess} />


                              {/* product category */}
                              <Route exact path="/masters/add_product_category" component={AddProductCategory} />
                              <Route exact path="/masters/edit_product_category/:id" component={AddProductCategory} />
                              <Route exact path="/masters/list_product_category" component={ListProductCategory} />

                              {/* ledger group */}
                              <Route exact path="/masters/add_ledger_group" component={AddLedgerGroup} />
                              <Route exact path="/masters/edit_ledger_group/:id" component={AddLedgerGroup} />
                              <Route exact path="/masters/list_ledger_group" component={ListLedgerGroup} />


                              {/* Ledger Category */}
                              <Route exact path="/masters/add_ledger_category" component={AddLedgerCategory} />
                              <Route exact path="/masters/edit_ledger_category/:id" component={AddLedgerCategory} />
                              <Route exact path="/masters/list_ledger_category" component={ListLedgerCategory} />
                           
                              <Route exact path="/masters/add_employee_category" component={AddEmployeeCategory} />
                              <Route exact path="/masters/edit_employee_category/:id" component={AddEmployeeCategory} />
                              <Route exact path="/masters/list_employee_category" component={ListEmployeeCategory} />

                              {/* process */}
                              <Route exact path="/masters/add_process" component={AddProcess} />
                              <Route exact path="/masters/edit_process/:id" component={AddProcess} />
                              <Route exact path="/masters/list_process" component={ListProcess} />

                              {/* size */}
                              <Route exact path="/masters/add_size" component={AddSize} />
                              <Route exact path="/masters/edit_size/:id" component={AddSize} />
                              <Route exact path="/masters/list_size" component={ListSize} />

                              <Route exact path="/masters/add_master" component={AddMaster} />
                              <Route exact path="/masters/edit_master/:id" component={AddMaster} />
                              <Route exact path="/masters/list_master" component={ListMaster} />



                              {/* Product Group Mas */}
                              <Route exact path="/masters/add_product_group" component={AddProductGroup} />
                              <Route exact path="/masters/edit_product_group/:id" component={AddProductGroup} />
                              <Route exact path="/masters/list_product_group" component={ListProductGroup} />


                               {/* Unit Mas */}
                               <Route exact path="/masters/add_unit" component={AddUnit} />
                              <Route exact path="/masters/edit_unit/:id" component={AddUnit} />
                              <Route exact path="/masters/list_unit" component={ListUnit} />

                              {/* Product Mas */}
                              <Route exact path="/masters/add_product" component={AddProduct} />
                              <Route exact path="/masters/edit_product/:id" component={AddProduct} />
                              <Route exact path="/masters/list_product" component={ListProduct} />

                              {/* Ledger */}
                              <Route exact path="/masters/add_ledger" component={AddLedger} />
                              <Route exact path="/masters/edit_ledger/:id" component={AddLedger} />
                              <Route exact path="/masters/list_ledger" component={ListLedger} />
                              
                              
                              
                              <Route exact path="/masters/add_employee" component={AddEmployee} />
                              <Route exact path="/masters/edit_employee/:id" component={AddEmployee} />
                              <Route exact path="/masters/list_employee" component={ListEmployee} />

                              {/* color */}
                              <Route exact path="/masters/add_color" component={AddColor} />
                              <Route exact path="/masters/edit_color/:id" component={AddColor} />
                              <Route exact path="/masters/list_color" component={ListColor} />


                               {/* master Group */}
                              <Route exact path="/masters/add_masterGroup" component={AddMasterGroup} />
                              <Route exact path="/masters/edit_masterGroup/:id" component={AddMasterGroup} />
                              <Route exact path="/masters/list_masterGroup" component={ListMasterGroup} />
                             
                             {/* yarn YarnInward */}

                              <Route exact path="/transactions/add_yarn_inward" component={AddYarnInward} />
                              <Route exact path="/transactions/edit_yarn_inward/:id" component={AddYarnInward} />
                              <Route exact path="/transactions/list_yarn_inward" component={ListYarnInward} />
                             {/* yarn Yarn outward */}

                              <Route exact path="/transactions/add_yarn_outward" component={AddYarnOutward} />
                              <Route exact path="/transactions/edit_yarn_outward/:id" component={AddYarnOutward} />
                              <Route exact path="/transactions/list_yarn_outward" component={ListYarnOutward} />
                             
                              {/* yarn return */}
                              <Route exact path="/transactions/add_yarn_return" component={AddYarnReturn } />
                              <Route exact path="/transactions/edit_yarn_return/:id" component={AddYarnReturn } />
                              <Route exact path="/transactions/list_yarn_return" component={ListYarnReturn } />
                              

                              <Route exact path="/transactions/add_jobwork_inward" component={AddJobworkinward } />
                              <Route exact path="/transactions/edit_jobwork_inward/:id" component={AddJobworkinward } />
                              <Route exact path="/transactions/list_jobwork_inward" component={ListJobworkinward } />

                              {/* Yarn_invoice */}
                              <Route exact path="/transactions/add_yarn_invoice" component={AddYarnInvoice} />
                              <Route exact path="/transactions/edit_yarn_invoice/:id" component={AddYarnInvoice} />
                              <Route exact path="/transactions/list_yarn_invoice" component={ListYarnInvoice} />
                             
                             
                             
                              <Route exact path="/user/add_menu_master" component={AddMenuMaster} />
                              <Route exact path="/user/edit_menu_master/:id" component={AddMenuMaster} />
                              <Route exact path="/user/list_menu_master" component={ListMenuMaster} />
                             
                              <Route exact path="/user/add_user_group" component={AddUserGroup} />
                              <Route exact path="/user/edit_user_group/:id" component={AddUserGroup} />
                              <Route exact path="/user/list_user_group" component={ListUserGroup} />
                             
                              <Route exact path="/user/add_user" component={AddUser} />
                              <Route exact path="/user/edit_user/:id" component={AddUser} />
                              <Route exact path="/user/list_user" component={ListUser} />

                               {/* order program */}
                              <Route exact path="/transactions/add_orderprogram" component={AddOrderProgram} />
                              <Route exact path="/transactions/edit_orderprogram/:id" component={AddOrderProgram} />
                              <Route exact path="/transactions/list_orderprogram" component={ListOrderProgram} />


                                {/* fabric inward */}
                              <Route exact path="/transactions/add_fabric_inward" component={AddFabricInward} />
                              <Route exact path="/transactions/edit_fabric_inward/:id" component={AddFabricInward} />
                              <Route exact path="/transactions/list_fabric_inward" component={ListFabricInward} />

                               {/* fabric outward */}
                               <Route exact path="/transactions/add_fabric_outward" component={AddFabricOutward} />
                              <Route exact path="/transactions/edit_fabric_outward/:id" component={AddFabricOutward} />
                              <Route exact path="/transactions/list_fabric_outward" component={ListFabricOutward} />


                               {/* fabric invoice */}
                              <Route exact path="/transactions/add_fabric_invoice" component={AddFabricInvoice} />
                              <Route exact path="/transactions/edit_fabric_invoice/:id" component={AddFabricInvoice} />
                              <Route exact path="/transactions/list_fabric_invoice" component={ListFabricInvoice} />

                               {/* fabric invoice */}
                              <Route exact path="/transactions/add_fabric_return" component={AddFabricReturn} />
                              <Route exact path="/transactions/edit_fabric_return/:id" component={AddFabricReturn} />
                              <Route exact path="/transactions/list_fabric_return" component={ListFabricReturn} />

                              
                               {/* fabric invoice */}
                              <Route exact path="/transactions/add_cutting_program" component={AddCuttingProgram} />
                              <Route exact path="/transactions/edit_cutting_program/:id" component={AddCuttingProgram} />
                              <Route exact path="/transactions/list_cutting_program" component={ListCuttingProgram} />


                               {/* jobwork Outward */}
                              <Route exact path="/transactions/add_jobwork_outward" component={AddJobworkOutward} />
                              <Route exact path="/transactions/edit_jobwork_outward/:id" component={AddJobworkOutward} />
                              <Route exact path="/transactions/list_jobwork_outward" component={ListJobworkOutward} />

                              
                              
                              {/* branch */}
                              <Route exact path="/masters/add_branch" component={AddBranch} />
                              <Route exact path="/masters/edit_branch/:id" component={AddBranch} />
                              <Route exact path="/masters/list_branch" component={ListBranch} />
                              {/* department */}
                              <Route exact path="/masters/add_department" component={AddDepartment} />
                              <Route exact path="/masters/edit_department/:id" component={AddDepartment} />
                              <Route exact path="/masters/list_department" component={ListDepartment} />
                              {/* bank */}
                              <Route exact path="/masters/add_bank" component={AddBank} />
                              <Route exact path="/masters/edit_bank/:id" component={AddBank} />
                              <Route exact path="/masters/list_bank" component={ListBank} />

                              {/*designation */}
                              <Route exact path="/masters/add_designation" component={AddDesignation} />
                              <Route exact path="/masters/edit_designation/:id" component={AddDesignation} />
                              <Route exact path="/masters/list_designation" component={ListDesignation} />
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}




                            
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}
                            {/* Boopathi Workspace */}




                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}

                             {/* garments invoice */}
                              <Route exact path="/transactions/add_garments_invoice" component={AddGarmentsInvoice} />
                              <Route exact path="/transactions/edit_garments_invoice/:id" component={AddGarmentsInvoice} />
                              <Route exact path="/transactions/list_garments_invoice" component={ListGarmentsInvoice} />

                             {/* garments delivery note */}
                             <Route exact path="/transactions/add_garments_delivery_note" component={AddGarmentsDeliveryNote} />
                              <Route exact path="/transactions/edit_garments_delivery_note/:id" component={AddGarmentsDeliveryNote} />
                              <Route exact path="/transactions/list_garments_delivery_note" component={ListGarmentsDeliveryNote} />

                              {/* jobwork receipt note */}
                              <Route exact path="/transactions/add_garments_receipt_note" component={AddGarmentsReceiptNote} />
                              <Route exact path="/transactions/edit_garments_receipt_note/:id" component={AddGarmentsReceiptNote} />
                              <Route exact path="/transactions/list_garments_receipt_note" component={ListGarmentsReceiptNote} />


                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}
                            {/* Kowsalya Workspace */}






                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}




                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}
                            {/* Hariprakash Workspace */}

                              {/*jobwork_invoice */}
                              <Route exact path="/transactions/add_jobwork_invoice" component={AddJobworkInvoice} />
                              <Route exact path="/transactions/edit_jobwork_invoice/:id" component={AddJobworkInvoice} />
                              <Route exact path="/transactions/list_jobwork_invoice" component={ListJobworkInvoice} />



                              <Redirect to="/" />
                            </Switch>
                        </div>
                    </div>
                    :
                        <Switch>
                          <Route exact path="/signup" component={Signup} />
                          <Route exact path="/" component={Login} />

                          <Redirect to="/" />
                        </Switch>
                    }
            </Content>
            
              {this.props.history.location.pathname !== null ? 
                  <Redirect to={this.props.history.location.pathname } />
              : null}
          </Router>
          {/* { this.props.store.login.login ? 
              <Footerbar /> : null } */}
          </Layout>
        </Layout>

    )
  }
}


const mapStateToProps = (state) => {
  return {
      store: state
  }
}


export default connect(mapStateToProps, { onLogOut })(withRouter(App))