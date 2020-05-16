import React from 'react';
import { Menu, Switch } from 'antd';
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from '@reach/router';

export const Sider = () => {
  const location = useLocation();

  return (
    <>
      <Menu
        theme="dark"
        style={{ width: 256 }}
        selectedKeys={location.pathname}
        mode="inline"
      >
        <Menu.Item key="dashboard" icon={<AppstoreOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="installments" icon={<AppstoreOutlined />}>
          <Link to="/installments">Installments</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};
