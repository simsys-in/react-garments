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


/// Add Less
import AddAddLess from './pages/masters/addless/add'
import ListAddLess from './pages/masters/addless/list'


/// Ledger
import AddLedger from './pages/masters/ledger/add'
import ListLedger from './pages/masters/ledger/list'
// import Datatable from './pages/Datatable';

/// Product Group
import AddProductGroup from './pages/masters/productgroup/add'
import ListProductGroup from './pages/masters/productgroup/list'

/// unit
import AddUnit from './pages/masters/unit/add'
import ListUnit from './pages/masters/unit/list'

/// product
import AddProduct from './pages/masters/product/add'
import ListProduct from './pages/masters/product/list'


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
                            <Switch >


                              <Route exact path="/" component={Dashboard} />

                              {/* AddLess Mas */}
                              <Route exact path="/masters/add_addless" component={AddAddLess} />
                              <Route exact path="/masters/edit_addless/:id" component={AddAddLess} />
                              <Route exact path="/masters/list_addless" component={ListAddLess} />

                              {/* Ledger Mas */}
                              <Route exact path="/masters/add_ledger" component={AddLedger} />
                              <Route exact path="/masters/edit_ledger/:id" component={AddLedger} />
                              <Route exact path="/masters/list_ledger" component={ListLedger} />

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


                              <Redirect to="/" />
                            </Switch>
                        </div>
                    :
                        <Switch>
                          <Route exact path="/signup" component={Signup} />
                          <Route exact path="/" component={Login} />
                          {/* <Route exact path="/table" component={Datatable} /> */}

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


export default connect(mapStateToProps)(withRouter(App));