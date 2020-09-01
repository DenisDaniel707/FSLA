import React, { useContext, useEffect } from 'react'
import fsladb from '../apis/fsladb';
import { Button, Popconfirm } from 'antd';
import { RecordsContext } from '../context/RecordsContext';
import { DetailsContext } from '../context/DetailsContext';
import {
    FileExcelTwoTone,
  } from '@ant-design/icons';
import { ExcelJS } from 'exceljs'

const ImportCSV = () => {

    const { records } = useContext(RecordsContext);

    const handleImport = () => {
        console.log(records)
    }

    return (
        <Popconfirm title="Import records from excel file?" onConfirm={() => handleImport()} okText="Yes" cancelText="No">
            <Button style={{width: '95px'}} ><FileExcelTwoTone/>Import</Button>
        </Popconfirm>
    )
}

export default ImportCSV;