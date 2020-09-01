import React from 'react';
import '../../node_modules/antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import {
    SyncOutlined
  } from '@ant-design/icons';

const { Header } = Layout;
const MyHeader = () => {
    return (
        <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" style={{margin: '0 30px'}} >Testing</Menu.Item>
            <Menu.Item><SyncOutlined spin />In development</Menu.Item>
        </Menu>
        </Header>
    )
}

export default MyHeader;