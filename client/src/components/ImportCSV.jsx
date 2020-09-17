import React, { useState } from 'react'
import fsladb from '../apis/fsladb';
import { Button, Modal } from 'antd';
import {
    FileExcelOutlined,
  } from '@ant-design/icons';
import readXlsxFile from 'read-excel-file'
import moment from 'moment'

const ImportCSV = () => {

    var count = 0;
    // Get and parse excel file
    const parse = async (e) => {
        var id = 0;
        readXlsxFile(e.target.files[0]).then(async (rows) => {
            const sz = rows.length - 1;
            console.log(sz)
            for(var i = 1; i <= sz; i++) {
                console.log(rows[i])
                if((JSON.stringify(rows[i].slice(0,8)) === JSON.stringify(rows[i-1].slice(0,8)))) {
                    console.log(rows[i][11])
                    await fsladb.post(`/details/${id}`, {
                        dom: rows[i][9],
                        dom_loc: rows[i][10],
                        fsml_r: rows[i][12],
                        issue: rows[i][13],
                        c_actions: rows[i][14],
                        a_res: rows[i][15],
                        a_rev: rows[i][16],
                        a_due: moment(rows[i][17], "DD.MM.YY").utc().local().format('YYYY.MM.DD'),
                        a_stat: rows[i][18],
                        last_rev: moment(rows[i][19], "DD.MM.YY").utc().local().format('YYYY.MM.DD'),
                        comm: rows[i][20]
                    })
                    continue;
                }
                const result = await fsladb.post(`/records`, {
                    fy: rows[i][0],
                    plant: rows[i][1],
                    bu: rows[i][2],
                    pg: rows[i][3],
                    au_stat: rows[i][4],
                    proj: rows[i][5],
                    country: rows[i][6],
                    lead_aud: rows[i][7],
                    co_aud: rows[i][8],
                    fsml_t: rows[i][11]
                });
                id = result.data.records.id
                await fsladb.post(`/details/${id}`, {
                    dom: rows[i][9],
                    dom_loc: rows[i][10],
                    fsml_r: rows[i][12],
                    issue: rows[i][13],
                    c_actions: rows[i][14],
                    a_res: rows[i][15],
                    a_rev: rows[i][16],
                    a_due: moment(rows[i][17], "DD.MM.YY").utc().local().format('YYYY.MM.DD'),
                    a_stat: rows[i][18],
                    last_rev: moment(rows[i][19], "DD.MM.YY").utc().local().format('YYYY.MM.DD'),
                    comm: rows[i][20]
                })
            }
            importSetState({
                visible: false,
            })
            setTimeout(() => {
                window.location.reload(false);
            }, 500)
        })
        const d = moment(new Date()).utc().local().format('DD.MM.YYYY HH:mm:ss');
        await fsladb.post(`/history`, {
            info: "Imported Excel File",
            h_date: d
        })
        // setTimeout(() => {
        //     importSetState({
        //         visible: false,
        //     })
        // }, 2000);
    }

    const p = {
        ModalText: "Content of the modal",
        visible: false,
        confirmLoading: false
    };

    const [importState, importSetState] = useState(p)

    const importShowModal = () => {
        importSetState({
          visible: true,
        });
    };

    // const importHandleOk = () => {
    //     parse(e)
    //     importSetState({
    //       visible: false,
    //     });
    // };

    const importHandleCancel = () => {
        console.log("Clicked cancel button");
        importSetState({
          visible: false
        });
    };

    return (
        <div>
            <Button style={{width: "96px", height: "32px", background: "#0a2b59", color: "#f0cc00", position: "relative", left: "19px", top: "-110px"}} onClick={() => importShowModal()} >
                <FileExcelOutlined/>
                Import
            </Button>
            <Modal
                    title="Enter Excel File"
                    visible={importState.visible}
                    // onOk={importHandleOk}
                    onCancel={importHandleCancel}
                    footer={null}
            >
                <input className="file-uploader" type="file" id="fileUpload" accept=".xlsx, .xls" onChange={(e) => parse(e)}/>
                <br/><br/>(After loading the file wait until this box closes)
            </Modal>
        </div>
    )
}

export default ImportCSV;