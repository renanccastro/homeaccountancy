import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from '@reach/router';
import Sider from 'antd/es/layout/Sider';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import AppstoreOutlined from '@ant-design/icons/lib/icons/AppstoreOutlined';
import SubMenu from 'antd/es/menu/SubMenu';
import SettingOutlined from '@ant-design/icons/lib/icons/SettingOutlined';
import moment from 'moment';

const { Header, Content, Footer } = Layout;

export const Template = ({ component: Component, ...props }) => {
  const location = useLocation();
  const startOfYear = moment()
    .startOf('year')
    .subtract(1, 'years');
  const endOfYear = moment()
    .endOf('year')
    .add(1, 'years');

  const monthsSet = new Set();
  const yearsSet = new Set();
  for (const m = startOfYear; m.isBefore(endOfYear); m.add(1, 'month')) {
    yearsSet.add(m.format('YYYY'));
    monthsSet.add(m.format('MMMM'));
  }
  const months = [...monthsSet];
  const years = [...yearsSet];

  return (
    <Layout className="site-layout-main">
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
        >
          <Menu mode="horizontal">
            {years.map(year => (
              <SubMenu icon={<SettingOutlined />} key={year} title={year}>
                {months.map(month => (
                  <Menu.Item key={`${year}_${month}`}>
                    {' '}
                    <Link
                      to={`/dashboard/${year}/${month}`}
                      className="nav-text"
                    >
                      {month}
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Component {...props} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
