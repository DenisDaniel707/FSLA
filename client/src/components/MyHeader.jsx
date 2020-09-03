import React from 'react';
import '../../node_modules/antd/dist/antd.css';
import { Layout, Divider } from 'antd';
import logo from './logo.png'

const MyHeader = () => {
    return (
        <Layout>
            <div style={{backgroundColor: "#0a2b59", padding: "0 4%", height: "70px"}} align="left">
                <img src={logo} width="75" height="53" alt="Logo" style={{padding: "-10px 0", position: "relative", top: "11%"}}/>
                <Divider type="vertical"/>
            </div>
        </Layout>
    )
}

export default MyHeader;