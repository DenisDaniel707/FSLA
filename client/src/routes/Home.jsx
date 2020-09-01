//Main Page
import React, {useEffect, useContext} from 'react';
import fsladb from '../apis/fsladb';
import '../../node_modules/antd/dist/antd.css';
import { Layout } from 'antd';
import MyHeader from '../components/MyHeader';
import MyContent from '../components/MyContent';
import MyFooter from '../components/MyFooter';
import { RecordsContext } from '../context/RecordsContext';

const Home = (props) => {
    const { setRecords } = useContext(RecordsContext);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fsladb.get("records");
                setRecords(response.data.data.records)
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchData();
    },[])

    return (
        //This is the layout of the main page
        <Layout>
            <MyHeader/>
            <Layout className="site-layout-background" style={{ padding: '0px 0' }}>
                <MyContent/>
            </Layout>
            <MyFooter style={{padding: '20px 0'}}/>
        </Layout>
    )
}

export default Home;
