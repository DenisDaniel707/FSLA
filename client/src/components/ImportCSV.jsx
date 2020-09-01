import React, { useContext, useState } from 'react'
import fsladb from '../apis/fsladb';
import { Button, message, Upload, Modal } from 'antd';
import { RecordsContext } from '../context/RecordsContext';
import { DetailsContext } from '../context/DetailsContext';
import {
    FileExcelTwoTone,
  } from '@ant-design/icons';

var xlsx = require("xlsx");

const ImportCSV = () => {

    const { records } = useContext(RecordsContext);

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

    const importHandleOk = () => {
        console.log("Clicked ok button")
        importSetState({
          visible: false,
        });
    };

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
                    onOk={importHandleOk}
                    onCancel={importHandleCancel}
            >
                <input className="file-uploader" type="file" accept=".xlsx, .xls" onChange={() => console.log("ok")} />
            </Modal>
        </div>
    )
}

export default ImportCSV;