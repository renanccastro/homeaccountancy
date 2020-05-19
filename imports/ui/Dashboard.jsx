import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import keyBy from 'lodash.keyby';
import {
  PageHeader,
  Tag,
  Button,
  Descriptions,
  Row,
  Table,
  Space,
  Statistic,
} from 'antd';

import Dinero from 'dinero.js';
import { Link } from '@reach/router';
import moment from 'moment';
import Tabs from 'antd/es/tabs';
import AppleOutlined from '@ant-design/icons/lib/icons/AppleOutlined';
import AndroidOutlined from '@ant-design/icons/lib/icons/AndroidOutlined';
import { Categories } from '../api/categories';
import { AccountingEntries } from '../api/accountingEntries';
import { fetchDashboardData } from './helpers/dashboardHelpers';

const { TabPane } = Tabs;

export const Dashboard = ({
  year = moment().format('YYYY'),
  month = moment().format('MMMM'),
}) => {
  const startRange = moment(`${year}/${month}/01`, 'YYYY/MMMM/DD').startOf(
    'month'
  );
  const endRange = moment(`${year}/${month}/01`, 'YYYY/MMMM/DD').endOf('month');

  const [payed, setPayed] = useState(false);
  const { credit, debit, balance, debitBalance, creditBalance } = useTracker(
    () => fetchDashboardData(startRange, endRange, { payed }),
    [startRange, endRange, payed]
  );

  const columns = entries => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name < b.name,
      render: text => text,
    },
    {
      title: 'Categories',
      key: 'categories',
      dataIndex: 'categories',
      render: categories => (
        <>
          {categories?.map(({ name }) => {
            const color = name.length > 5 ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={name}>
                {name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      render: account => account.name,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.account.name - b.account.name,
      filters: entries.map(({ account }) => ({
        text: account.name,
        value: account.name,
      })),
    },
    {
      title: '# of Installments',
      dataIndex: 'installment',
      key: 'installment',
    },
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.start - b.start,
      render: (value, entry) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: 'Value',
      dataIndex: 'money',
      key: 'money',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.money.greaterThan(b.money),
      render: value => value.toFormat(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals
              const confirmation = confirm('Are you sure?');
              if (confirmation) {
                AccountingEntries.remove(record._id);
              }
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Credit"
        // tags={<Tag color="blue">Running</Tag>}
        subTitle="every operation that adds account balance"
        extra={[
          <Button key="3" type="primary">
            <Link to="/new-accounting-entry/credit">+ Add</Link>
          </Button>,
        ]}
      >
        <Row>
          <Statistic title="Balance" value={balance.toFormat()} />
          <Statistic
            title="Subtotal"
            value={creditBalance.toFormat()}
            style={{
              margin: '0 32px',
            }}
          />
        </Row>
      </PageHeader>
      <Table columns={columns(credit)} dataSource={credit} />
      <PageHeader
        title="Debit"
        // tags={<Tag color="blue">Running</Tag>}
        subTitle="every operation that subtracts account balance"
        extra={[
          <Button key="2" type="primary">
            <Link to="/new-accounting-entry/debit">+ Add</Link>
          </Button>,
        ]}
      >
        <Row>
          <Statistic title="Subtotal" value={debitBalance.toFormat()} />
        </Row>
      </PageHeader>
      <Tabs defaultActiveKey="1" onChange={key => setPayed(key === '2')}>
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Pending
            </span>
          }
          key="1"
        >
          <Table columns={columns(debit)} dataSource={debit} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Payed
            </span>
          }
          key="2"
        >
          <Table columns={columns(debit)} dataSource={debit} />
        </TabPane>
      </Tabs>
    </div>
  );
};
