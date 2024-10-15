import React, { useEffect, useState } from "react";
import { HomeOutlined, ProfileOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Button, Layout, Menu, theme, Typography } from 'antd';
import logo from '../assets/surge_view_new_cropped_transparent.png';
import { useAppContext } from "../contexts/AppContext";
import MainContent from "./MainContent";
import Logout from "./Common/Logout";
import useFetchRolePermissions from "../hooks/useFetchRolePermission";


const { Header, Content, Sider } = Layout;
const {Title} = Typography;

const pages = ['Home', 'Profile'];
const actions = ['Select Action', 'Search Customers', 'View Customer Details', 'View Orders', 'Order Details']

const sideMenuItems: MenuProps['items'] = [
  {
    key: '1',
    icon: <HomeOutlined/>,
    label: 'Home'
  },
  {
    key: '2',
    icon: <ProfileOutlined/>,
    label: 'Profile'
  },
]


const Dashboard: React.FC = function() {
  const AppContext = useAppContext();
  const {data, error, fetchPermissions} = useFetchRolePermissions();
  

  const {state, updateState} = AppContext;
  
  useEffect(() => {

    if(error && error === 'Authorization_Error' && !state.isLoggedIn) {
      updateState({requiresLogin: true})
    }
  }, [error, updateState, state.isLoggedIn]);

  // useEffect(() => {
  //   fetchPermissions();
  // }, [state.isLoggedIn, fetchPermissions])

  useEffect(() => {
    if(data) {
      console.log(data);
      updateState({permissions: data});
    } 

  }, [data, updateState])


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = function(e: {key: string}) {
    AppContext.updateState({page: parseInt(e.key)});
  }

  return (
    <Layout style={{height: '100%'}}>
      <Header style={{ position: 'relative', background: '#bdc3c7', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <img src={logo} data-testid='main-logo' style={{ height: '45px', marginRight: '60px', marginLeft: '25px' }} />
        <Title level={2} style={{color: '#ecf0f1', margin: 0}}> {/*add marginLeft, flex: 1, textAlign: 'center to move towards center*/ }
          Business Tools
        </Title>
        <Logout/>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={sideMenuItems}
            onClick = {handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={[{ title: pages[state.page-1] }, { title: actions[state.actionSelected] }]}
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <MainContent/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Dashboard;