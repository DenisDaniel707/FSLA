import React, { useContext, useState } from 'react'
import fsladb from '../apis/fsladb';
import { Button, message, Upload, Modal } from 'antd';
import { RecordsContext } from '../context/RecordsContext';
import { DetailsContext } from '../context/DetailsContext';
import {
    FileExcelTwoTone,
  } from '@ant-design/icons';
  import readXlsxFile from 'read-excel-file'
  import moment from 'moment'


const ImportCSV = () => {

    // Get and parse excel file
    const parse = (e) => {
        var id = 0;
        readXlsxFile(e.target.files[0]).then(async (rows) => {
            const sz = rows.length - 1;
            const col_names = rows[0];
            for(var i = 1; i <= sz; i++) {
                if(JSON.stringify(rows[i].slice(1,11)) == JSON.stringify(rows[i-1].slice(1,11))) {
                    console.log(rows[i].slice(11,22))
                    await fsladb.post(`/details/${id}`, {
                        dom: rows[i][11],
                        dom_loc: rows[i][12],
                        fsml_r: rows[i][13],
                        issue: rows[i][14],
                        c_actions: rows[i][15],
                        a_res: rows[i][16],
                        a_rev: rows[i][17],
                        a_due: moment(rows[i][18]).utc().local().format('YYYY-MM-DD'),
                        a_stat: rows[i][19],
                        last_rev: moment(rows[i][20]).utc().local().format('YYYY-MM-DD'),
                        comm: rows[i][21]
                    })
                    continue;
                }
                console.log(rows[i].slice(1,11))
                const result = await fsladb.post(`/records`, {
                    fy: rows[i][1],
                    plant: rows[i][2],
                    bu: rows[i][3],
                    pg: rows[i][4],
                    au_stat: rows[i][5],
                    proj: rows[i][6],
                    country: rows[i][7],
                    lead_aud: rows[i][8],
                    co_aud: rows[i][9],
                    fsml_t: rows[i][10]
                });
                id = result.data.records.id
                console.log(rows[i].slice(11,22))
                await fsladb.post(`/details/${id}`, {
                    dom: rows[i][11],
                    dom_loc: rows[i][12],
                    fsml_r: rows[i][13],
                    issue: rows[i][14],
                    c_actions: rows[i][15],
                    a_res: rows[i][16],
                    a_rev: rows[i][17],
                    a_due: moment(rows[i][18]).utc().local().format('YYYY-MM-DD'),
                    a_stat: rows[i][19],
                    last_rev: moment(rows[i][20]).utc().local().format('YYYY-MM-DD'),
                    comm: rows[i][21]
                })
            }
        })
        importSetState({
            visible: false,
        })
    }

    const { setRecords } = useContext(RecordsContext);

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
            <Button style={{width: '95px'}} onClick={() => importShowModal()} >
                <FileExcelTwoTone/>
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
            </Modal>
        </div>
    )
}

export default ImportCSV;