import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from '@reach/router';
import Sider from 'antd/es/layout/Sider';

const { Header, Content, Footer } = Layout;

export const Template = ({ component: Component }) => {
  const location = useLocation();

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/dashboard" icon={<UserOutlined />}>
            <Link to="/dashboard" className="nav-text">
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item key="/installments" icon={<UserOutlined />}>
            <Link to="/installments" className="nav-text">
              Installments
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Component />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
