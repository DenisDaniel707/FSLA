import React from 'react';
import '../../node_modules/antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import logo from './logo.png'

const { Header } = Layout;
const MyHeader = () => {
    return (
        <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" style={{margin: '0 30px'}} ><img src={logo} width="60" height="50" alt="Logo" /></Menu.Item>
        </Menu>
        </Header>
    )
}

export default MyHeader;