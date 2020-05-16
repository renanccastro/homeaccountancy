import React from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Router } from '@reach/router';
import { Sider } from './Sider';
import { Dashboard } from './Dashboard';

export const App = () => (
  <div>
    <Sider />
    <Router>
      <Dashboard path="dashboard" />
      <Home path="installments" />
    </Router>
  </div>
);
