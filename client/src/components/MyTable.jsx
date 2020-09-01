import React, { useContext, useState } from 'react';
import fsladb from '../apis/fsladb'
import { RecordsContext } from '../context/RecordsContext';
import '../../node_modules/antd/dist/antd.css';
import {
    Table,
    Tag,
    Popconfirm,
    Modal,
    Form,
    Input,
    Menu,
    Dropdown,
    Col,
    Button
  } from 'antd';
import { useHistory } from 'react-router-dom';
import {
    RightOutlined,
    DownOutlined,
    FileExcelOutlined
  } from '@ant-design/icons';

const MyTable = () => {

    const {records, setRecords} = useContext(RecordsContext);
    let history = useHistory()

    const handleDelete = async (id) => {
        try {
            await fsladb.delete(`records/${id}`);
            setRecords(records.filter(record => {
                return record.id !== id
            }))
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleView = (id) => {
        try {
            history.push(`records/${id}/view`)
        } catch (err) {
            console.error(err.message);
        }
    }

    //Get the unique fiscal years for the filtering options
    const filters = (f) => {
        var fiscals = [];
        for(var i = 0; i < records.length; i++) {
            fiscals.push(records[i][f])
        }

        const unique_fiscals = fiscals.filter((x, i, a) => a.indexOf(x) === i)
        const fltr = []

        for(i = 0; i < unique_fiscals.length; i++) {
            //JSON format
            fltr.push({text: unique_fiscals[i], value: unique_fiscals[i]})
        }
        return fltr
    }

    const f_fy = filters('fy')
    const f_plant = filters('plant')
    const f_bu = filters('bu')
    const f_proj = filters('proj')
    const f_pg = filters('pg')
    const f_country = filters('country')
    const f_laud = filters('lead_aud')
    const f_caud = filters('co_aud')

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

    //Sorting function
    const compareAlpha = (a, b) => {
        if (a > b){
            return 1;
        }
        if (a < b){
            return -1;
        }
        return 0;
    }

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 8,
        },
    };

    var s = {
        ModalText: "Content of the modal",
        visible: false,
        confirmLoading: false,
    };

    const [state, setState] = useState(s)
    const { visible, confirmLoading } = state

    const onFinish = values => {
        console.log(values);
    };

    // Also setting the current state of the fields to the local params of the modal
    const showModal = (r) => {
        setState({
            visible: true,
            id: r.id,
            fy: r.fy,
            plant: r.plant,
            bu: r.bu,
            pg: r.pg,
            au_stat: r.au_stat,
            proj: r.proj,
            country: r.country,
            lead_aud: r.lead_aud,
            co_aud: r.co_aud,
            fsml_t: r.fsml_t,
        });
        setfy(r.fy)
        setplant(r.plant)
        setbu(r.bu)
        setpg(r.pg)
        setauStat(r.au_stat)
        setproj(r.proj)
        setcountry(r.country)
        setleadAud(r.lead_aud)
        setcoAud(r.co_aud)
        setfsmlT(r.fsml_t)
        // setTimeout(500);
    };

    const handleCancel = () => {
        console.log("Clicked cancel button");
        setState({
          visible: false
        });
    };

    const handleOk = async(id) => {
        setState({
            visible: true,
            ModalText: "Adding",
            confirmLoading: true
        });

        try {
            const response = await fsladb.put(`/records/${id}`, {
                fy,
                plant,
                bu,
                pg,
                au_stat: auStat,
                proj,
                country,
                lead_aud: leadAud,
                co_aud: coAud,
                fsml_t: fsmlT,
                deleted: false
            })
            console.log(response)
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
          <Menu.Item key="0" onClick={() => setauStat("Performed")}>
            Performed
          </Menu.Item>
          <Menu.Item key="1" onClick={() => setauStat("Canceled")}>
            Canceled
          </Menu.Item>
          <Menu.Item key="2" onClick={() => setauStat("Finished")}>
            Finished
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

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            width: 55,
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            render: (text, record, i) => i + 1,
        },
        {
            title: 'Fiscal Year',
            dataIndex: 'fy',
            width: 100,
            align: 'center',
            filters: f_fy,
            onFilter: ((value, record) => record.fy.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.fy, b.fy)),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Plant',
            dataIndex: 'plant',
            width: 50,
            align: 'center',
            filters: f_plant,
            onFilter: ((value, record, dataIndex) => record.plant.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.plant, b.plant)),
        },
        {
            title: 'BU',
            dataIndex: 'bu',
            width: 50,
            align: 'center',
            filters: f_bu,
            onFilter: ((value, record, dataIndex) => record.bu.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.bu, b.bu)),
        },
        {
            title: 'Product Group',
            dataIndex: 'pg',
            width: 50,
            align: 'center',
            filters: f_pg,
            onFilter: ((value, record) => record.pg.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.pg, b.pg)),
        },
        {
            title: 'Audit status',
            dataIndex: 'au_stat',
            width: 125,
            align: 'center',
            filters: [
                {
                    text: 'performed',
                    value: 'performed'
                },
                {
                    text: 'canceled',
                    value: 'canceled'
                },
                {
                    text: 'finished',
                    value: 'finished'
                },
            ],
            onFilter: ((value, record) => record.au_stat.indexOf(value) === 0),
            render: dataIndex => (
                dataIndex = dataIndex.toLowerCase(),
                <Tag color={dataIndex === 'performed' ? 'green' : (dataIndex === 'canceled' ? 'red' : (dataIndex === 'finished' ? 'blue' : ''))}>{dataIndex}</Tag>
            ),
            sorter: ((a, b) => compareAlpha(a.au_stat, b.au_stat)),
        },
        {
            title: 'Project',
            dataIndex: 'proj',
            width: 150,
            align: 'center',
            filters: f_proj,
            onFilter: ((value, record) => record.proj.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.proj, b.proj)),
        },
        {
            title: 'Location',
            dataIndex: 'country',
            width: 75,
            align: 'center',
            filters: f_country,
            onFilter: ((value, record) => record.country.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.country, b.country)),
        },
        {
            title: 'Lead Auditor',
            dataIndex: 'lead_aud',
            width: 75,
            align: 'center',
            filters: f_laud,
            onFilter: ((value, record) => record.lead_aud.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.lead_aud, b.lead_aud)),
        },
        {
            title: 'Co- Auditor',
            dataIndex: 'co_aud',
            width: 100,
            align: 'center',
            filters: f_caud,
            onFilter: ((value, record) => record.co_aud.indexOf(value) === 0),
            sorter: ((a, b) => compareAlpha(a.co_aud, b.co_aud)),
        },
        {
            title: 'FSML Target',
            dataIndex: 'fsml_t',
            width: 100,
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
            ],
            onFilter: ((value, record) => record.fsml_t.indexOf(value) === 0),
            render: dataIndex => (
                dataIndex = dataIndex.toUpperCase(),
                <Tag color={dataIndex === 'A' ? 'green' : (dataIndex === 'B' ? 'lime' : (dataIndex === 'C' ? 'yellow' : (dataIndex === 'D' ? 'red' : '')))}>{dataIndex}</Tag>
            ),
            sorter: ((a, b) => compareAlpha(a.fsml_t, b.fsml_t)),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (records) => (
                <div>
                    <Popconfirm title="Delete Audit?" onConfirm={() => handleDelete(records.id)} okText="Yes" cancelText="No">
                        <a>Delete</a><br/>
                    </Popconfirm>

                    <a onClick={() => showModal(records)}>Edit</a>
                </div>
            ),
          },
          {
                title: 'View',
                width: 65,
                align: 'center',
                render: (dataIndex, records) => (
                    <a onClick={() => handleView(records.id)}><RightOutlined/></a>
                ),
          },
    ];

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    return (
        <div>
            <Table columns={columns} dataSource={records} onChange={onChange} size='middle' bordered/>
            <Modal title="Edit Audit" visible={visible} onOk={() => handleOk(state.id)} keyboard confirmLoading={confirmLoading} onCancel={handleCancel}>
                <Form {...layout} name="nest-messages" onFinish={onFinish}>
                    <Form.Item name={['user', 'fy']} label="Fiscal Year">
                        <Input value={state.fy} onChange={e => setfy(e.target.value)} placeholder={state.fy}/>
                    </Form.Item>
                    <Form.Item name={['user', 'plant']} label="Plant">
                        <Input value={state.plant} onChange={e => setplant(e.target.value)} placeholder={state.plant}/>
                    </Form.Item>
                    <Form.Item name='bu' label="BU">
                        <Input value={bu} onChange={e => setbu(e.target.value)} placeholder={bu} addonAfter={
                                            <Dropdown overlay={buMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                    </Form.Item>
                    <Form.Item name={['user', 'pg']} label="Product Group">
                        <Input value={state.pg} onChange={e => setpg(e.target.value)} placeholder={state.pg}/>
                    </Form.Item>
                    <Form.Item name='auStat' label="Audit Status">
                        <Input value={auStat} onChange={e => setauStat(e.target.value)} placeholder={auStat} addonAfter={
                                            <Dropdown overlay={auStatMenu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        }/>
                    </Form.Item>
                    <Form.Item name={['user', 'proj']} label="Project">
                        <Input value={state.proj} onChange={e => setproj(e.target.value)} placeholder={state.proj}/>
                    </Form.Item>
                    <Form.Item name={['user', 'country']} label="Location">
                        <Input value={state.country} onChange={e => setcountry(e.target.value)} placeholder={state.country}/>
                    </Form.Item>
                    <Form.Item name={['user', 'leadAud']} label="Lead Auditor">
                        <Input value={state.lead_aud} onChange={e => setleadAud(e.target.value)} placeholder={state.lead_aud}/>
                    </Form.Item>
                    <Form.Item name={['user', 'coAud']} label="Co Auditor">
                        <Input value={state.co_aud} onChange={e => setcoAud(e.target.value)} placeholder={state.co_aud}/>
                    </Form.Item>
                    <Form.Item name='fsmlT' label="FSML Target">
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
    )
}

export default MyTable;