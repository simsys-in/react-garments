import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
// import  'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import './App.less';
import {Animated} from "react-animated-css";
// import { connect } from 'react-redux'
// import './style/custom-antd.css'
import './style/theme.less'
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import {
  Router,
  Switch,
  Route,
  withRouter,
  Redirect
} from "react-router-dom";

import api from './api.js'


import { Layout } from 'antd';

import Designer from './pages/ReportDesigner.jsx'
import Viewer from './pages/ReportViewer'

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

import AddProductCategory from './pages/masters/product_category/add'
import ListProductCategory from './pages/masters/product_category/list'

import AddLedgerGroup from './pages/masters/ledger_group/add'
import ListLedgerGroup from './pages/masters/ledger_group/list'


import AddLedgerCategory from './pages/masters/ledger_category/add'
import ListLedgerCategory from './pages/masters/ledger_category/list'

import AddProcess from './pages/masters/process/add'
import ListProcess from './pages/masters/process/list'


import AddSize from './pages/masters/size/add'
import ListSize from './pages/masters/size/list'

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


/// Fabric
import AddFabricReturn  from './pages/transactions/fabric_return/add'
import ListFabricReturn from './pages/transactions/fabric_return/list'


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
    localStorage.setItem("api", api)
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
              <Switch >
                <Route exact path="/report_designer">
                  <Designer />
                </Route>
                <Route exact path="/report_viewer">
                  <Viewer/>
                </Route>
                </Switch>
            <Content >
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



                              <Route exact path="/masters/add_product_category" component={AddProductCategory} />
                              <Route exact path="/masters/edit_product_category/:id" component={AddProductCategory} />
                              <Route exact path="/masters/list_product_category" component={ListProductCategory} />


                              <Route exact path="/masters/add_ledger_group" component={AddLedgerGroup} />
                              <Route exact path="/masters/edit_ledger_group/:id" component={AddLedgerGroup} />
                              <Route exact path="/masters/list_ledger_group" component={ListLedgerGroup} />



                              <Route exact path="/masters/add_ledger_category" component={AddLedgerCategory} />
                              <Route exact path="/masters/edit_ledger_category/:id" component={AddLedgerCategory} />
                              <Route exact path="/masters/list_ledger_category" component={ListLedgerCategory} />


                              <Route exact path="/masters/add_process" component={AddProcess} />
                              <Route exact path="/masters/edit_process/:id" component={AddProcess} />
                              <Route exact path="/masters/list_process" component={ListProcess} />


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

                              {/* color */}
                              <Route exact path="/masters/add_color" component={AddColor} />
                              <Route exact path="/masters/edit_color/:id" component={AddColor} />
                              <Route exact path="/masters/list_color" component={ListColor} />


                               {/* master Group */}
                              <Route exact path="/masters/add_masterGroup" component={AddMasterGroup} />
                              <Route exact path="/masters/edit_masterGroup/:id" component={AddMasterGroup} />
                              <Route exact path="/masters/list_masterGroup" component={ListMasterGroup} />

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


export default connect(mapStateToProps)(withRouter(App))