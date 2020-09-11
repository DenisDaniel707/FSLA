import React, { useContext, useState } from 'react';
import '../../node_modules/antd/dist/antd.css';
import { RecordsContext } from '../context/RecordsContext';
import {
    Divider,
    Button,
    Row,
    Col,
    Input,
    Form,
    Layout,
    Breadcrumb,
    Modal,
    Menu,
    Dropdown,
  } from 'antd';
import MyTable from './MyTable'
import {
    PlusOutlined,
    DownOutlined,
  } from '@ant-design/icons';
import fsladb from '../apis/fsladb';
import ExportCSV from './ExportCSV'
import moment from 'moment'

const { Search } = Input;

const Content = Layout.Content;

const MyContent = () => {

    const { setRecords } = useContext(RecordsContext);

    // New Record Modal
    const s = {
        ModalText: "Content of the modal",
        visible: false,
        confirmLoading: false
    };

    const [state, setState] = useState(s);

    const showModal = () => {
        setState({
          visible: true
        });
    };

    const handleOk = async(e) => {
        setState({
            visible: true,
            ModalText: "Adding",
            confirmLoading: true
        });

        try {
            const response = await fsladb.post("/records", {
                fy,
                plant,
                bu,
                pg,
                au_stat: auStat,
                proj,
                country,
                lead_aud: leadAud,
                co_aud: coAud,
                fsml_t: fsmlT
            })
            const d = moment(new Date()).utc().local().format('YYYY.MM.DD HH:mm:ss');
            await fsladb.post(`/history`, {
                info: `Created Audit ${response.data.records.id}: Plant: ${plant}, Project: ${proj}`,
                h_date: d
            })
        } catch (err) {
            console.error(err.message)
        }

        setTimeout(() => {
            setState({
                visible: false,
                confirmLoading: false
            });
        }, 500);
        setTimeout(() => {
            window.location.reload(false);
        }, 250);
    };

    const handleCancel = () => {
        console.log("Clicked cancel button");
        setState({
          visible: false
        });
    };

    const handleSearch = async (x) => {
        try {
            const response = await fsladb.get(`records/${x}`)
            setRecords(response.data.data.records)
        } catch (err) {
            console.error(err.message)
        }
    }

    const { visible, confirmLoading, ModalText } = state;

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 8,
        },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not validate email!',
          number: '${label} is not a validate number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
    };

    const onFinish = values => {
        console.log(values);
    };

    const [fy,setfy] = useState("");
    const [plant,setplant] = useState("");
    const [bu,setbu] = useState("");
    const [pg,setpg] = useState("");
    const [auStat,setauStat] = useState("");
    const [proj,setproj] = useState("");
    const [country,setcountry] = useState("");
    const [leadAud,setleadAud] = useState("");
    const [coAud,setcoAud] = useState("");
    const [fsmlT,setfsmlT] = useState("");

    // Drop-down menu options:
    const buMenu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setbu("GL")}>
            GL
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setbu("GE")}>
            GE
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setbu("GH")}>
            GH
          </Menu.Item>
          <Menu.Item key="3" onClick={() => setbu("SW House")}>
            SW House
          </Menu.Item>
        </Menu>
    );

    const auStatMenu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setauStat("performed")}>
            performed
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setauStat("canceled")}>
            canceled
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setauStat("finished")}>
            finished
          </Menu.Item>
        </Menu>
    );

    const fsmlTMenu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setfsmlT("A")}>
            A
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setfsmlT("B")}>
            B
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setfsmlT("C")}>
            C
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setfsmlT("D")}>
            D
          </Menu.Item>
        </Menu>
    );

    return (
        <Content style={{ padding: '10px 40px', minHeight: 793}} >

            {/* Breadcrumbs */}
            <Breadcrumb style={{ margin: '15px 35px', textAlign: 'left' }}>
                <Breadcrumb.Item>Audits</Breadcrumb.Item>
            </Breadcrumb>

            {/* Divider */}
            <div align="left">
                <Divider style={{marginTop: '0px', marginBottom: '20px'}}/>
            </div>

            <Row gutter={[32, 32]}>
                {/* New Button */}
                <Col span={3}>
                    <div style={{padding: '0 0'}}>
                        <Button style={{width: '150px', color: '#d9b800'}} onClick={() => showModal()}><PlusOutlined/>New Audit</Button>
                        <Modal
                            title="New Audit"
                            visible={visible}
                            onOk={handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                        >
                            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                <Form.Item
                                    name={['user', 'fy']}
                                    label="Fiscal Year"
                                >
                                    <Input value={fy} onChange={e => setfy(e.target.value)} placeholder="FY--/--"/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'plant']}
                                    label="Plant"
                                >
                                    <Input value={plant} onChange={e => setplant(e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'bu']}
                                    label="Bussiness Unit"
                                >
                                    <Input value={bu} onChange={e => setbu(e.target.value)} placeholder={bu} addonAfter={
                                        <Dropdown overlay={buMenu} trigger={['click']}>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                <DownOutlined />
                                            </a>
                                        </Dropdown>
                                    }/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'pg']}
                                    label="PG"
                                >
                                    <Input value={pg} onChange={e => setpg(e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'au_stat']}
                                    label="Audit Status"
                                >
                                    <Input value={auStat} onChange={e => setauStat(e.target.value)} placeholder={auStat} addonAfter={
                                        <Dropdown overlay={auStatMenu} trigger={['click']}>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                <DownOutlined />
                                            </a>
                                        </Dropdown>
                                    }/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'proj']}
                                    label="Project"
                                >
                                    <Input value={proj} onChange={e => setproj(e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'country']}
                                    label="Country"
                                >
                                    <Input value={country} onChange={e => setcountry(e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'lead_aud']}
                                    label="Lead Auditor"
                                >
                                    <Input value={leadAud} onChange={e => setleadAud(e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'co_aud']}
                                    label="Co-Auditor"
                                >
                                    <Input value={coAud} onChange={e => setcoAud(e.target.value)}/>
                                </Form.Item>
                                <Form.Item
                                    name={['user', 'fsml_t']}
                                    label="FSML Target"
                                >
                                    <Input value={fsmlT} onChange={e => setfsmlT(e.target.value)} placeholder={fsmlT} addonAfter={
                                        <Dropdown overlay={fsmlTMenu} trigger={['click']}>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                <DownOutlined />
                                            </a>
                                        </Dropdown>
                                    }/>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                </Col>
                {/* Search Bar */}
                <Col span={7}>
                    <div>
                        <Search placeholder="Search..." onSearch={value => handleSearch(value)} />
                    </div>
                </Col>

            {/* The space between */}
                <Col span={8} />

            {/* Export Excel Button */}
                <Col span={6}>
                    <div style={{padding: '0 0', textAlign: 'right'}}>
                        <ExportCSV/>
                    </div>
                </Col>
            </Row>

            {/* Records Table */}
            <MyTable/>

        </Content>
    )
}

export default MyContent;