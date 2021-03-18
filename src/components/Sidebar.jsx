import React, { PureComponent } from 'react';
import { Layout, Menu, Button, Divider } from 'antd';
import { connect } from 'react-redux';
import { onLogOut } from '../actions/login'
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
            collapsed: false,
            login: true,
            theme: "light",
            image_class : 'logo',
            activeKey : '0',
            menuTree : menuTree
        }
    }
    
    navigateURL = (url, key) => {
        this.setState({
            ...this.state,
            activeKey : key
        })
        this.props.history.push(url)
    }

    onCollapse = collapsed => {
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
        console.log(this.state.menuTree);
        return(
            <Sider theme={ theme.theme } breakpoint="md"  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
                <div>
                    <img className={ this.state.image_class } src={Logo} alt="logo"></img>
                </div>
                <br/>
                <div align="middle">
                    <Button type="dashed" onClick={ this.props.onLogOut }>Logout</Button>
                </div>
                <Divider />
                <Menu theme={ theme.theme } defaultSelectedKeys={[this.state.activeKey]} mode="inline" >
                    {
                    this.state.menuTree.map((menu, index) => 
                        <SubMenu key={ index } icon={ <i className={"fa fa-lg fa-" + menu.icon} aria-hidden="true" /> } title={ menu.name }>
                            { menu.children.map((child, key) =>
                                <Menu.Item icon={ <i className={"fa fa-" + child.icon  } /> } onClick={ () => this.navigateURL(child.url,index.toString() +  key.toString() ) } key={ index.toString() +  key.toString() }>{ child.name }</Menu.Item>
                            )}
                        </SubMenu>
                    ) }
                </Menu>
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
    onLogOut
  }

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);