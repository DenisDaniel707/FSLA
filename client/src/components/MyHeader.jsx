import React, { useState, useContext } from 'react';
import '../../node_modules/antd/dist/antd.css';
import { Typography, Button, Modal, List, Checkbox } from 'antd';
import logo from './logo.png'
import { HistoryContext } from '../context/HistoryContext';
import fsladb from '../apis/fsladb';
import ImportCSV from './ImportCSV'
import {
    HistoryOutlined,
  } from '@ant-design/icons';

const { Title } = Typography;

const MyHeader = () => {

    const {history, setHistory} = useContext(HistoryContext);
    const getHistory = async () => {
        try {
            const response = await fsladb.get(`history/10`)
            var d = response.data.data.history.map(function(item) {
                return [item['info'], item['h_date']];
              });
            setHistory(d)
        } catch (err) {
            console.error(err.message)
        }
    }

    const s = {
        visible: false
    };

    const [state, setState] = useState(s)

    const showModal = () => {
        getHistory();
        setState({
          visible: true,
        });
    };

    const handleCancel = e => {
        setState({
          visible: false,
        });
    };

    // Check Show All History
    const handleCheck = async (e) => {
        if(e === true) {
            try {
                const response = await fsladb.get(`history/ALL`)
                var d = response.data.data.history.map(function(item) {
                    return [item['info'], item['h_date']];
                  });
                setHistory(d)
            } catch (err) {
                console.error(err.message)
            }
        } else {
            getHistory()
        }
    }

    return (
        <div class="header" style={{backgroundColor: "#0a2b59", padding: "7px 4%", height: "70px"}} align="left">
            <img src={logo} width="75" height="53" alt="Logo" style={{padding: "-10px 0", position: "relative", top: "1px"}}/>
            <Title level={4} style={{color: '#f0cc00', marginLeft: '94px', position: "relative", top: '-40px', left: '10px'}}>Functional Safety Location Audits</Title>
            <div align="right">
                <Button onClick={() => showModal()} style={{width: "96px", background: "#0a2b59", color: "#f0cc00", position: "relative", left: "-100px", top: "-78px"}}><HistoryOutlined/>History</Button>
                <ImportCSV/>
            </div>
            <Modal title={<div align="center">History</div>} visible={state.visible} centered style={{marginTop: '10px'}} onCancel={handleCancel} footer={null}>
                <div align="right" style={{position: 'relative', top: '-12px'}}>
                    <Checkbox onChange={(e) => handleCheck(e.target.checked)}>Show all history</Checkbox>
                </div>
                <List
                    bordered
                    dataSource={history}
                    renderItem={item => (
                        <List.Item>
                            <div align="left">{item[0]}</div>
                            <div align="right">{item[1]}</div>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    )
}

export default MyHeader;