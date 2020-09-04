import React from 'react';
import '../../node_modules/antd/dist/antd.css';
import { Layout, Typography } from 'antd';
import logo from './logo.png'

const { Title } = Typography;

const MyHeader = () => {
    return (
        <Layout>
            <div style={{backgroundColor: "#0a2b59", padding: "7px 4%", height: "70px"}} align="left">
                <img src={logo} width="75" height="53" alt="Logo" style={{padding: "-10px 0", position: "relative", top: "11%"}}/>
                <Title level={4} style={{color: '#f0cc00', marginLeft: '94px', position: "relative", top: '-40px', left: '10px'}}>Functional Safety Location Audits</Title>
            </div>
        </Layout>
    )
}

export default MyHeader;