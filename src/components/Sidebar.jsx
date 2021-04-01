import React, { PureComponent } from 'react';
import { Layout, Menu, Button, Divider } from 'antd';
import { connect } from 'react-redux';
import { onLogOut, toggleSiderCollapse } from '../actions/login'
import { getRequest } from '../helpers/apihelper'
import Logo from '../assets/images/logo.svg';
import menuTree from './Menutree'


const {  Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends PureComponent {
    constructor(props)
    {
        super(props);
        this.state = {
            collapsed: true,
            login: true,
            theme: "light",
            image_class : 'logo-collapsed',
            activeKey : '0',
            menuTree : menuTree
        }
    }
    
    navigateURL = (url, key) => {
        this.setState({
            ...this.state,
            activeKey : key
        })
        this.props.history.push("/" + url)
    }

    onCollapse = collapsed => {
        this.props.toggleSiderCollapse(collapsed)
        this.setState({ 
            collapsed,
            image_class : collapsed ? 'logo-collapsed' : 'logo'
         });

    };

    onLogoutClick = () => {
        // getRequest('user/logout').then(response => {
        //     if(response.status === "success")
        //     {
                this.props.onLogOut();
        //     }
        // })
    }

    render(){
        const { theme } = this.props.store;
        return(
            <Sider theme={ theme.theme } breakpoint="md" style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                width : '80px',
                left: 0,
              }} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
                  <div>
                    <div>
                        <img className={ this.state.image_class } src={Logo} alt="logo"></img>
                    </div>
                    <br/>
                    <div align="middle">
                        <Button type="dashed" onClick={ this.props.onLogOut }>Logout</Button>
                    </div>
                  </div>
                <Divider />
                <div >
                    <Menu theme={ theme.theme } defaultSelectedKeys={[this.state.activeKey]} mode="inline" >
                        { this.props.store.login.userData && this.props.store.login.userData.menuList && this.props.store.login.userData.menuList.length > 0 &&
                        this.props.store.login.userData.menuList.map((menu, index) => 
                        menu.name !== null ?

                        menu.children && menu.children.length > 0 ?
                            <SubMenu key={ index } icon={ <i className={"fa fa-lg fa-" + menu.icon} aria-hidden="true" /> } title={ menu.name }>
                                { menu.children.map((child, key) =>
                                    <Menu.Item icon={ <i className={"fa fa-" + child.icon  } /> } onClick={ () => this.navigateURL(child.url,index.toString() +  key.toString() ) } key={ index.toString() +  key.toString() }>{ child.name }</Menu.Item>
                                )}
                            </SubMenu>
                            :
                            <Menu.Item icon={ <i className={"fa fa-" + menu.icon  } /> } onClick={ () => this.navigateURL(menu.url,index.toString() +  menu.toString() ) } key={ index.toString() +  menu.toString() }>{ menu.name }</Menu.Item>
                            : null
                        ) }
                    </Menu>
                </div>
            </Sider>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        store: state
    }
}


const mapDispatchToProps = {
    onLogOut, toggleSiderCollapse
  }

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);