import React, { Component } from 'react';
import { Layout, Row, Col, Card, Divider, Table, Menu} from 'antd';
import { FolderOutlined, HomeOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './App.css';

import logo from './images/logo.png';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
            selectedUnit: -1,
            showGraph: true
        };
        this.showUnit = this.showUnit.bind(this);
        this.showGraph = this.showGraph.bind(this);
    }
    showGraph(){
        this.setState({
            showGraph: true
        });
    }
    showUnit(i) {
        this.setState({
            selectedUnit: i,
            showGraph: false
        });
    }
    componentDidMount() {
        fetch('https://tractian-data.s3.us-east-2.amazonaws.com/api.json')
            .then(res => res.json())
            .then((data) => {
                this.setState({units: data.units})
                console.log(this.state.units)
            })
            .catch(console.log)
    }

    render() {
        let divUnit;
        if (this.state.showGraph) {
            var data = [];
            var assets = this.state.units;
            var inUse = 0, available = 0, onAlert = 0, underMaintenance = 0;
            for (var i = 0; i < parseInt(assets.length, 10); i++) {
                inUse += parseInt(assets[i].data.inUse, 10);
                available += parseInt(assets[i].data.available, 10);
                onAlert += parseInt(assets[i].data.onAlert, 10);
                underMaintenance += parseInt(assets[i].data.underMaintenance, 10);
            }
            console.log(inUse);
            const options = {
                chart: {
                    type: "column"
                },
                title: {
                    text: 'Status dos ativos'
                },
                series: [
                    {
                        name: "Em Uso",
                        data: [inUse]
                    },
                    {
                        name: "Disponíveis",
                        data: [available]
                    },
                    {
                        name: "Em Alerta",
                        data: [onAlert]
                    },
                    {
                        name: "Em Manutenção",
                        data: [underMaintenance]
                    },
                ]
            }
            divUnit =
                <div >
                <Row style={{ position: 'relative', left: '240px' }}>
                        <HighchartsReact 
                        highcharts={Highcharts}
                        options={options}
                        />
                </Row>
                </div>;
        }
        else {
            var j = this.state.selectedUnit;
            var sum = 0;
            var data = [];
            var assets = this.state.units[j].data.assetsData;
            var insightsPending = this.state.units[j].data.insightsPending;
            var insightsChecked = this.state.units[j].data.insightsChecked;
            for (var i = 0; i < parseInt(assets.length, 10); i++) {
                sum += parseInt(assets[i].healthscore.health, 10); 
                data.push({
                    name: assets[i].name,
                    model: assets[i].model.description,
                    category: assets[i].category.name,
                    description: assets[i].description,
                    health: assets[i].healthscore.health,
                    ImageURL: assets[i].model.image,
                    insightsPending: assets[i].insights.pending
                })
            }
            var avg = parseFloat(sum / parseInt(assets.length, 10)).toFixed(2);
            const columns = [
                {
                    title: '',
                    dataIndex: 'ImageURL',
                    render: theImageURL => <img style={{ height: '70px', weight: '50px'}} alt={theImageURL} src={theImageURL} /> ,
                    responsive: ['lg'],
                },
                {
                    title: 'Nome',
                    dataIndex: 'name',
                    render: text => <a>{text}</a>,
                    align: 'left',
                },
                {
                    title: 'Modelo',
                    dataIndex: 'model',
                    align: 'left',
                    responsive: ['md'],
                },
                {
                    title: 'Categoria',
                    dataIndex: 'category',
                    align: 'left',
                    responsive: ['lg'],
                },
                {
                    title: 'Descrição',
                    dataIndex: 'description',
                    align: 'left',
                    responsive: ['lg'],
                },
                {
                    title: 'Saúde',
                    dataIndex: 'health',
                    align: 'left',
                },
                {
                    title: 'Insights Pendentes',
                    dataIndex: 'insightsPending',
                    align: 'left',
                },
            ];

            divUnit =
                <div className="site-card-wrapper">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="Nível de Saúde" bordered={false}>
                                {avg} %
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Insights Pendentes" bordered={false}>
                                {insightsPending}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Insights Resolvidos" bordered={false}>
                                {insightsChecked}
                            </Card>
                        </Col>
                </Row>
                <Divider orientation="left" style={{ color: 'white' }}></Divider>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    title={() => 'Ativos'}
                />
                </div>;        
        }
        return (
            <div className="App">
                <Layout>
                    <Header className="header" style={{ backgroundColor: '#000000' }}>
                        <img src={logo} alt="Logo" />
                    </Header>
                    <Layout>
                        <Sider className="site-layout-background">
                            <Menu
                                mode="inline"
                                style={{ minHeight: '100vh', borderRight: 0 }}
                            >
                                <Menu.Item key="sub1" onClick={this.showGraph} icon={<HomeOutlined />} title="Home">Home</Menu.Item>
                                <SubMenu key="sub2" icon={<FolderOutlined />} title="Unidades">
                                    <Menu.Item key="0" onClick={(e) => this.showUnit(e.key)}> Unidade 1 </Menu.Item>
                                    <Menu.Item key="1" onClick={(e) => this.showUnit(e.key)}> Unidade 2 </Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Layout>
                            <Content
                                className="site-layout-background"
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    backgroundColor: '#0b67fa'
                                }}
                            >
                                {divUnit}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default App;
