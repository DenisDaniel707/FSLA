import React, { useContext } from 'react'
import fsladb from '../apis/fsladb';
import { Button } from 'antd';
import { RecordsContext } from '../context/RecordsContext';
import {
    FileExcelOutlined,
  } from '@ant-design/icons';
import ExportJsonExcel from 'js-export-excel';
import moment from 'moment';

const ExportCSV = () => {

    const { records } = useContext(RecordsContext);

    var option = {};
    let dataTable = [];
    var count = 0;
    const fun = async () => {
        if (records) {
            for(var i = 0; i < records.length; i++) {
                const details = await fsladb.get(`details/${records[i].id}`);
                for(var j = 0; j < details.data.results; j++) {
                    count++;
                    if(records) {
                        let obj = {
                            'ID': count,
                            'Fiscal Year': records[i].fy,
                            'Plant': records[i].plant,
                            'BU': records[i].bu,
                            'Product Group': records[i].pg,
                            'Audit Status': records[i].au_stat,
                            'Project': records[i].proj,
                            'Country': records[i].country,
                            'Lead Auditor': records[i].lead_aud,
                            'Co Auditor': records[i].co_aud,
                            'FSML Target': records[i].fsml_t,
                            'Domain': details.data.data.details[j].dom,
                            'Domain Location': details.data.data.details[j].dom_loc,
                            'FSML Result': details.data.data.details[j].fsml_r,
                            'Issue': details.data.data.details[j].issue,
                            'Corrective Actions': details.data.data.details[j].c_actions,
                            'Audit Result': details.data.data.details[j].a_res,
                            'Audit Reviewer': details.data.data.details[j].a_rev,
                            'Due Date': moment(details.data.data.details[j].a_due).utc().local().format('YYYY-MM-DD'),
                            'Action Status': details.data.data.details[j].a_stat,
                            'Last Reviewed': moment(details.data.data.details[j].last_rev).utc().local().format('YYYY-MM-DD'),
                            'Comments': details.data.data.details[j].comm
                        }
                        dataTable.push(obj);
                    }
                }
            }
        }
    }

    fun()

    option.fileName = 'FSLA Export'
    option.datas=[
        {
            sheetData:dataTable,
            sheetName:'sheet',
                    sheetHeader:[
                        'ID',
                        'Fiscal Year',
                        'Plant',
                        'BU',
                        'Product Group',
                        'Audit Status',
                        'Project',
                        'Country',
                        'Lead Auditor',
                        'Co Auditor',
                        'FSML Target',
                        'Domain',
                        'Domain Location',
                        'FSML Result',
                        'Issues',
                        'Corrective Actions',
                        'Audit Result',
                        'Audit Reviewer',
                        'Due Date',
                        'Action Status',
                        'Last Review',
                        'Comments'
                    ],
        }
        ];

    var toExcel = new ExportJsonExcel(option);

    return(
        <Button style={{width: '95px'}} onClick={() => toExcel.saveExcel()}><FileExcelOutlined/>Export</Button>
    )
}

export default ExportCSV;
