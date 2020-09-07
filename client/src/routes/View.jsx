import React, { useEffect, useContext, useState } from 'react';
import { useParams } from "react-router-dom";
import '../../node_modules/antd/dist/antd.css';
import fsladb from '../apis/fsladb';
import { DetailsContext } from '../context/DetailsContext';
import MyHeader from '../components/MyHeader';
import MyFooter from '../components/MyFooter';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
    Table,
    Divider,
    Button,
    Typography,
    Row,
    Col,
    Input,
    Layout,
    Breadcrumb,
    Popconfirm,
    Tag,
    Modal,
    Form,
    Calendar,
    Menu,
    Dropdown
} from 'antd';
import {
    PlusOutlined,
    LeftOutlined,
    DownOutlined
} from '@ant-design/icons';
import ExportCSV from '../components/ExportCSV'

const View = () => {

    const { id } = useParams();
    const { details, setDetails } = useContext(DetailsContext);
    const Content = Layout.Content;
    const { Title } = Typography;
    const { Search, TextArea } = Input;
    let history = useHistory()

    // New View Modal
    const s = {
        ModalText: "Content of the modal",
        visible: false,
        confirmLoading: false
    };

    const c = {
        ModalText: "Content of the modal",
        visible2: false,
        confirmLoading2: false
    };

    const n = {
        ModalText: "Content of the modal",
        visible2: false,
        confirmLoading2: false
    };

    const [state, setState] = useState(s);
    const [calendarState1, calendarSetState1] = useState(c);
    const [calendarState2, calendarSetState2] = useState(c);
    const [editState, editSetState] = useState(n);

    const [dom,setdom] = useState("");
    const [domLoc,setdomLoc] = useState("");
    const [fsmlR,setfsmlR] = useState("");
    const [issue,setissue] = useState("");
    const [cActions,setcActions] = useState("");
    const [aRes,setaRes] = useState("");
    const [aRev,setaRev] = useState("");
    const [aDue,setaDue] = useState(new Date());
    const [aStat,setaStat] = useState("");
    const [lastRev,setlastRev] = useState(new Date());
    const [comm,setcomm] = useState("");

    const showModal = () => {
        setState({
          visible: true
        });
    };

    const calendarShowModal1 = () => {
        calendarSetState1({
          visible: true
        });
    };

    const calendarShowModal2 = () => {
        calendarSetState2({
          visible: true
        });
    };

    const editShowModal = (r) => {
        editSetState({
            visible2: true,
            v_id: r.v_id,
            dom: r.dom,
            dom_loc: r.dom_loc,
            fsml_r: r.fsml_r,
            issue: r.issue,
            c_actions: r.c_actions,
            a_res: r.a_res,
            a_rev: r.a_rev,
            a_due: r.a_due,
            a_stat: r.a_stat,
            last_rev: r.last_rev,
            comm: r.comm
        });
        setdom(r.dom)
        setdomLoc(r.dom_loc)
        setfsmlR(r.fsml_r)
        setissue(r.issue)
        setcActions(r.c_actions)
        setaRes(r.a_res)
        setaRev(r.a_rev)
        setaDue(moment(r.a_due).utc().local().format('YYYY-MM-DD'))
        setaStat(r.a_stat)
        setlastRev(moment(r.last_rev).utc().local().format('YYYY-MM-DD'))
        setcomm(r.comm)
    }

    const handleOk = async() => {
        setState({
            visible: true,
            ModalText: "Adding",
            confirmLoading: true
        });

        try {
            const response = await fsladb.post(`/details/${id}`, {
                dom,
                dom_loc: domLoc,
                fsml_r: fsmlR,
                issue,
                c_actions: cActions,
                a_res: aRes,
                a_rev: aRev,
                a_due: aDue,
                a_stat: aStat,
                last_rev: lastRev,
                comm
            })
            const d = moment(new Date()).utc().local().format('YYYY.MM.DD HH:mm:ss');
            await fsladb.post(`/history`, {
                info: `Created Weakness ${response.data.details.v_id}: ${dom} ${domLoc}`,
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

    const editHandleOk = async() => {
        editSetState({
            visible2: true,
            ModalText: "Adding",
            confirmLoading2: true
        });

        try {
            const d = moment(new Date()).utc().local().format('YYYY.MM.DD HH:mm:ss');
            await fsladb.post(`/history`, {
                info: `Edited Weakness ${editState.v_id}: ${dom} ${domLoc}`,
                h_date: d
            })
            const response = await fsladb.put(`/details/${editState.v_id}`, {
                dom,
                dom_loc: domLoc,
                fsml_r: fsmlR,
                issue,
                c_actions: cActions,
                a_res: aRes,
                a_rev: aRev,
                a_due: aDue,
                a_stat: aStat,
                last_rev: lastRev,
                comm,
                deleted: false
            })
            console.log(response)
        } catch (err) {
            console.error(err.message)
        }

        setTimeout(() => {
            editSetState({
                visible2: false,
                confirmLoading2: false
            });
        }, 500);
        setTimeout(() => {
            window.location.reload(false);
        }, 250);
    };

    const handleCancel = () => {
        setState({
          visible: false
        });
    };

    const calendarHandleCancel1 = () => {
        calendarSetState1({
          visible: false
        });
    };

    const calendarHandleCancel2 = () => {
        calendarSetState2({
          visible: false
        });
    };

    const editHandleCancel = () => {
        editSetState({
            visible2: false,
        });
        window.location.reload(false);
    };

    const { visible, confirmLoading } = state;
    const { visible2, confirmLoading2 } = editState;

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 8,
        },
    };

    const validateMessages = {};

    const onFinish = values => {
        console.log(values);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fsladb.get(`details/${id}`);
                setDetails(response.data.data.details)
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData();
    },[])

    const handleDelete = async (id, dm, dl) => {
        try {
            const d = moment(new Date()).utc().local().format('YYYY.MM.DD HH:mm:ss');
            await fsladb.post(`/history`, {
                info: `Deleted Weakness ${id}: ${dm} ${dl}`,
                h_date: d
            })
            await fsladb.delete(`/details/${id}`);
            setDetails(details.filter(detail => {
                return detail.v_id !== id
            }))
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleView = () => {
        try {
            history.push(`/`)
        } catch (err) {
            console.error(err.message);
        }
    }

    const filters = (f) => {
        var fiscals = [];
        for(var i = 0; i < details.length; i++) {
            fiscals.push(details[i][f])
        }

        const unique_fiscals = fiscals.filter((x, i, a) => a.indexOf(x) === i)
        const fltr = []

        for(i = 0; i < unique_fiscals.length; i++) {
            //JSON format
            fltr.push({text: unique_fiscals[i], value: unique_fiscals[i]})
        }
        return fltr
    }

    const f_dom = filters('dom')
    const f_dom_loc = filters('dom_loc')
    const f_a_res = filters('a_res')
    const f_a_rev = filters('a_rev')

    const compareAlpha = (a, b) => {
        if (a > b){
            return 1;
        }
        if (a < b){
            return -1;
        }
        return 0;
    }

    const formatTime = (a) => {
        const date = moment(a).utc().local().format('YYYY.MM.DD')
        return date;
    }

    const test_na = t => {
        if(t === null)
            return ' ';
        if(t === 'na')
            return t;
        else
            return t.toUpperCase();
    }

    const handleSearch = async(value) => {
        try {
            if(value === '') {
                const response1 = await fsladb.get(`/details/${id}`)
                console.log(response1)
                setDetails(response1.data.data.details)
            } else {
                const response = await fsladb.get(`/detail/${id}/${value}`)
                console.log(response)
                setDetails(response.data.data.details)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'v_id',
            width: 55,
            align: 'center',
            sorter: (a, b) => a.v_id - b.v_id,
            render: (text, record, i) => i + 1,
        },
        {
            title: 'Domain',
            dataIndex: 'dom',
            width: 50,
            align: 'center',
            filters: f_dom,
            onFilter: ((value, record) => record.dom.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.dom, b.dom)),
        },
        {
            title: "Domain's Location",
            dataIndex: 'dom_loc',
            width: 50,
            align: 'center',
            filters: f_dom_loc,
            onFilter: ((value, record) => record.dom_loc.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.dom_loc, b.dom_loc)),
        },
        {
            title: 'FSML Result',
            dataIndex: 'fsml_r',
            width: 50,
            align: 'center',
            filters: [
                {
                    text: 'A',
                    value: 'A',
                },
                {
                    text: 'B',
                    value: 'B',
                },
                {
                    text: 'C',
                    value: 'C',
                },
                {
                    text: 'D',
                    value: 'D',
                },
                {
                    text: 'na',
                    value: 'na',
                },
            ],
            onFilter: ((value, record) => record.fsml_r.indexOf(value) === 0),
            render: dataIndex => (
                dataIndex = test_na(dataIndex),
                <Tag color={dataIndex === 'A' ? 'green' : (dataIndex === 'B' ? 'lime' : (dataIndex === 'C' ? 'yellow' : (dataIndex === 'D' ? 'red' : '')))}>{dataIndex}</Tag>
            ),
            sorter: ((a, b) => compareAlpha(a.fsml_r, b.fsml_r)),
        },
        {
            title: 'Issues',
            dataIndex: 'issue',
            width: 50,
            align: 'center',
        },
        {
            title: 'Corrective Actions',
            dataIndex: 'c_actions',
            width: 50,
            align: 'center',
        },
        {
            title: 'Action Responsible',
            dataIndex: 'a_res',
            width: 50,
            align: 'center',
            filters: f_a_res,
            onFilter: ((value, record) => record.a_res.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.a_res, b.a_res)),
        },
        {
            title: 'Action Reviewer',
            dataIndex: 'a_rev',
            width: 50,
            align: 'center',
            filters: f_a_rev,
            onFilter: ((value, record) => record.a_rev.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.a_rev, b.a_rev)),
        },
        {
            title: 'Action Due Date',
            dataIndex: 'a_due',
            width: 50,
            align: 'center',
            sorter: ((a, b) => compareAlpha(a.a_due, b.a_due)),
            render: (dataIndex) => formatTime(dataIndex),
        },
        {
            title: 'Action Status',
            dataIndex: 'a_stat',
            width: 50,
            align: 'center',
            filters: [
                {
                    text: 'Open',
                    value: 'Open',
                },
                {
                    text: 'Overdue',
                    value: 'Overdue',
                },
                {
                    text: 'Done',
                    value: 'Done',
                },
                {
                    text: 'Canceled',
                    value: 'Canceled',
                }
            ],
            onFilter: ((value, record) => record.a_stat.indexOf(value) === 0),
            render: dataIndex => (
                dataIndex = (dataIndex && dataIndex.toLowerCase()),
                <Tag color={dataIndex === 'done' ? 'green' : (dataIndex === 'open' ? 'lime' : (dataIndex === 'overdue' ? 'yellow' : (dataIndex === 'canceled' ? 'red' : '')))}>
                    {dataIndex}
                </Tag>
            ),
            sorter: ((a, b) => compareAlpha(a.a_stat, b.a_stat)),
        },
        {
            title: 'Last Review',
            dataIndex: 'last_rev',
            width: 50,
            align: 'center',
            sorter: ((a, b) => compareAlpha(a.last_rev, b.last_rev)),
            render: (dataIndex) => formatTime(dataIndex),
        },
        {
            title: 'Comments',
            dataIndex: 'comm',
            width: 50,
            align: 'center',
        },
        {
            title: 'Action',
            key: 'action',
            width: 50,
            align: 'center',
            render: (details) => (
                <div>
                    <Popconfirm
                        title="Delete Weakness?"
                        onConfirm={() => handleDelete(details.v_id, details.dom, details.dom_loc)}
                        okText="Yes"
                        cancelText="No"
                    > <a href='#'>Delete</a><br/>
                    </Popconfirm>
                    <a onClick={() => editShowModal(details)}>Edit</a>
                </div>
            ),
        },

    ]

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    const changeDueDate = value => {
        var dueDate = moment(value._d).format('YYYY/MM/DD')
        setaDue(dueDate)
    }

    const changeLastRev = value => {
        var lRev = moment(value._d).format('YYYY/MM/DD')
        setlastRev(lRev)
    }

    const onOk1 = value => {
        calendarSetState1({
            visible: false
        });
    }

    const onOk2 = value => {
        calendarSetState2({
            visible: false
        });
    }

    // Domain Drop-Down
    const domMenu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setdom("PJM")}>
            PJM
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setdom("SYS")}>
            SYS
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setdom("MD")}>
            MD
          </Menu.Item>
          <Menu.Item key="3" onClick={() => setdom("HW")}>
            HW
          </Menu.Item>
          <Menu.Item key="4" onClick={() => setdom("SW")}>
            SW
          </Menu.Item>
          <Menu.Item key="5" onClick={() => setdom("Testing")}>
            Testing
          </Menu.Item>
          <Menu.Item key="6" onClick={() => setdom("Quality")}>
            Quality
          </Menu.Item>
          <Menu.Item key="7" onClick={() => setdom("Production")}>
            Production
          </Menu.Item>
        </Menu>
    );

    // FSML_Result Drop-Down
    const fsmlRMenu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setfsmlR("A")}>
            A
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setfsmlR("B")}>
            B
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setfsmlR("C")}>
            C
          </Menu.Item>
          <Menu.Item key="3" onClick={() => setfsmlR("D")}>
            D
          </Menu.Item>
          <Menu.Item key="3" onClick={() => setfsmlR("na")}>
            na
          </Menu.Item>
        </Menu>
    );

    // Action_Status Drop-Down
    const aStatMenu = (
        <Menu>
          <Menu.Item key="0" onClick={() => setaStat("Open")}>
            Open
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setaStat("Overdue")}>
            Overdue
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setaStat("Done")}>
            Done
          </Menu.Item>
          <Menu.Item key="3" onClick={() => setaStat("Canceled")}>
            Canceled
          </Menu.Item>
        </Menu>
    );

    return (
        <Layout className="site-layout-background" style={{ padding: '0px 0' }}>
            <MyHeader/>
            <Content style={{ padding: '10px 40px', minHeight: 793}} >

                {/* Breadcrumbs */}
                <Breadcrumb style={{ margin: '15px 35px', textAlign: 'left' }}>
                    <Breadcrumb.Item href onClick={handleView}>Audits</Breadcrumb.Item>
                    <Breadcrumb.Item>Weaknesses</Breadcrumb.Item>
                </Breadcrumb>

                {/* Divider */}
                <div align="left">
                    <Divider style={{marginTop: '0px', marginBottom: '20px'}}/>
                </div>

                <Row gutter={[32, 32]}>
                    {/* New Weakness Button */}
                    <Col span={3}>
                        <div style={{padding: '0 0'}}>
                            <Button style={{width: '150px', color: '#d9b800'}} onClick={() => showModal()}><PlusOutlined/>New Weakness</Button>

                            <Modal title="New Weakness" centered style={{marginTop: '10px'}} closable={false} visible={visible} onOk={handleOk} keyboard confirmLoading={confirmLoading} onCancel={handleCancel}>

                                <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                    <Form.Item name={['user', 'dom']} label="Domain">
                                        <Input value={dom} onChange={e => setdom(e.target.value)} placeholder={dom} addonAfter={
                                            <Dropdown overlay={domMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'domLoc']} label="Domain Location">
                                        <Input value={domLoc} onChange={e => setdomLoc(e.target.value)}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'fsmlR']} label="FSML Result">
                                        <Input value={fsmlR} onChange={e => setfsmlR(e.target.value)} placeholder={fsmlR} addonAfter={
                                            <Dropdown overlay={fsmlRMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'issue']} label="Issues">
                                        <TextArea value={issue} onChange={e => setissue(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'cActions']} label="Corrective Actions">
                                        <TextArea value={cActions} onChange={e => setcActions(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'aRes']} label="Audit Responsible">
                                        <TextArea value={aRes} onChange={e => setaRes(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'aRev']} label="Audit Reviewer">
                                        <TextArea value={aRev} onChange={e => setaRev(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'aDue']} label="Action Due Date">
                                        {/* <Input value={aDue} onChange={e => setaDue(e.target.value)} placeholder="YYYY/MM/DD"/> */}
                                        <Button type="primary" onClick={calendarShowModal1}>
                                            Open Calendar
                                        </Button>
                                        <Modal title="Action Due Date" visible={calendarState1.visible} onOk={onOk1} onCancel={calendarHandleCancel1}>
                                            <Calendar fullscreen={false} onChange={changeDueDate}/>
                                        </Modal>
                                    </Form.Item>

                                    <Form.Item name={['user', 'aStat']} label="Action Status">
                                        <Input value={aStat} onChange={e => setaStat(e.target.value)} placeholder={aStat} addonAfter={
                                            <Dropdown overlay={aStatMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'lastRev']} label="Last Review">
                                        <Button type="primary" onClick={calendarShowModal2}>Open Calendar</Button>

                                        <Modal title="Last Review" visible={calendarState2.visible} onOk={onOk2} onCancel={calendarHandleCancel2}>
                                            <Calendar fullscreen={false} onChange={changeLastRev}/>
                                        </Modal>
                                    </Form.Item>

                                    <Form.Item name={['user', 'comm']} label="Comments">
                                        <TextArea value={comm} onChange={e => setcomm(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>
                                </Form>
                            </Modal>

                            <Modal title="Edit Weakness" centered style={{marginTop: '10px'}} closable={false} visible={visible2} onOk={editHandleOk} confirmLoading={confirmLoading2} onCancel={editHandleCancel}>

                                <Form {...layout} initialValues={{'domLoc': editState.dom_loc, 'issue': editState.issue, 'cActions': editState.c_actions, 'aRes': editState.a_res, 'aRev': editState.a_rev, 'comm': editState.comm}} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                    <Form.Item name='dom' label="Domain">
                                        <Input value={dom} onChange={e => setdom(e.target.value)} placeholder={dom} addonAfter={
                                            <Dropdown overlay={domMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                                    </Form.Item>

                                    <Form.Item name='domLoc' label="Domain Location">
                                        <Input name='domLoc' value={domLoc} onChange={e => setdomLoc(e.target.value)}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'fsmlR']} label="FSML Result">
                                        <Input value={fsmlR} onChange={e => setfsmlR(e.target.value)} placeholder={fsmlR} addonAfter={
                                            <Dropdown overlay={fsmlRMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                                    </Form.Item>

                                    <Form.Item name='issue' label="Issues">
                                        <TextArea value={issue} onChange={e => setissue(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name='cActions' label="Corrective Actions">
                                        <TextArea value={cActions} onChange={e => setcActions(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name='aRes' label="Audit Responsible">
                                        <TextArea value={aRes} onChange={e => setaRes(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name='aRev' label="Audit Reviewer">
                                        <TextArea value={aRev} onChange={e => setaRev(e.target.value)} autoSize={{ minRows: 2 }}/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'aDue']} label="Action Due Date">
                                        {/* <Input value={aDue} onChange={e => setaDue(e.target.value)} placeholder="YYYY/MM/DD"/> */}
                                        <Button type="primary" onClick={calendarShowModal1}>
                                            Open Calendar
                                        </Button>
                                        <Modal title="Action Due Date" visible={calendarState1.visible} onOk={onOk1} onCancel={calendarHandleCancel1}>
                                            <Calendar fullscreen={false} onChange={changeDueDate}/>
                                        </Modal>
                                    </Form.Item>

                                    <Form.Item name={['user', 'aStat']} label="Action Status">
                                        <Input value={aStat} onChange={e => setaStat(e.target.value)} placeholder={aStat} addonAfter={
                                            <Dropdown overlay={aStatMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                                    </Form.Item>

                                    <Form.Item name={['user', 'lastRev']} label="Last Review">
                                        <Button type="primary" onClick={calendarShowModal2}>Open Calendar</Button>

                                        <Modal title="Last Review" visible={calendarState2.visible} onOk={onOk2} onCancel={calendarHandleCancel2}>
                                            <Calendar fullscreen={false} onChange={changeLastRev}/>
                                        </Modal>
                                    </Form.Item>

                                    <Form.Item name='comm' label="Comments">
                                        <TextArea value={comm} onChange={e => setcomm(e.target.value)} autoSize={{ minRows: 2 }}/>
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
                    <Col span={14} />

                {/* Export Excel Button
                    <Col span={6}>
                        <div style={{padding: '0 0', textAlign: 'right'}}>
                            <ExportCSV/>
                        </div>
                    </Col> */}
                </Row>

                {/* Details Table */}
                <Table columns={columns} dataSource={details} onChange={onChange} size='small' bordered/>
            </Content>
            <MyFooter style={{padding: '20px 0'}}/>
        </Layout>
    )
}

export default View;