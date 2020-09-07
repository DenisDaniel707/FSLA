import React, { useState, useContext } from 'react';
import '../../node_modules/antd/dist/antd.css';
import { Typography, Button, Modal, List } from 'antd';
import logo from './logo.png'
import { HistoryContext } from '../context/HistoryContext';
import fsladb from '../apis/fsladb';

const { Title } = Typography;

const MyHeader = () => {

    const {history, setHistory} = useContext(HistoryContext);

    const getHistory = async () => {
        try {
            const response = await fsladb.get(`history`)
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

    return (
        <div class="header" style={{backgroundColor: "#0a2b59", padding: "7px 4%", height: "70px"}} align="left">
            <img src={logo} width="75" height="53" alt="Logo" style={{padding: "-10px 0", position: "relative", top: "1%"}}/>
            <Title level={4} style={{color: '#f0cc00', marginLeft: '94px', position: "relative", top: '-40px', left: '10px'}}>Functional Safety Location Audits</Title>
            <div align="right">
                <Button onClick={showModal} style={{width: "96px", background: "#0a2b59", color: "#f0cc00", position: "relative", left: "19px", top: "-80px"}}>History</Button>
            </div>
            <Modal title="History" visible={state.visible} onCancel={handleCancel} footer={null}>
                <List
                    bordered
                    dataSource={history}
                    renderItem={item => (
                        <List.Item>
                            <div align="right">{item[0]}</div>
                            <div align="right">{item[1]}</div>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    )
}

export default MyHeader;