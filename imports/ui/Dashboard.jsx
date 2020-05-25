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
  Menu,
} from 'antd';

import Dinero from 'dinero.js';
import { Link } from '@reach/router';
import moment from 'moment';
import Tabs from 'antd/es/tabs';
import AppleOutlined from '@ant-design/icons/lib/icons/AppleOutlined';
import AndroidOutlined from '@ant-design/icons/lib/icons/AndroidOutlined';
import { Categories } from '../api/categories';
import { AccountingEntries } from '../api/accountingEntries';
import { useDashboardData } from './helpers/dashboardHelpers';
import { DashboardTable } from '../components/DashboardTable';
import {
  getInstallmentNumber,
  InstallmentsCollection,
} from '../api/installments';

const { TabPane } = Tabs;

export const Dashboard = ({
  year = moment().format('YYYY'),
  month = moment().format('MMMM'),
}) => {
  const start = moment(`${year}/${month}/01`, 'YYYY/MMMM/DD').toDate();
  const startRange = moment(start).startOf('month');
  const endRange = moment(start).endOf('month');

  const [received, setReceived] = useState(false);
  const [payed, setPayed] = useState(false);
  const { credit, debit, debitBalance, creditBalance } = useDashboardData(
    startRange,
    endRange,
    { payed, received }
  );

  const markAsPayed = rows => {
    rows.forEach(_id => {
      const accountingEntry = AccountingEntries.findOne(_id);
      if (!accountingEntry) {
        const { startDate } = InstallmentsCollection.findOne(_id);
        const installment = getInstallmentNumber(startDate, endRange);
        InstallmentsCollection.update(_id, {
          payedInstallments: { $pushToSet: installment },
        });
      } else {
        AccountingEntries.update(_id, { $set: { payed: true } });
      }
    });
  };
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
          <Link
            to={`/new-accounting-entry/credit/${record._id}`}
            className="nav-text"
          >
            Edit
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <DashboardTable
        title="Credit"
        subtitle="every operation that adds account balance"
        columns={columns(credit)}
        datasource={credit}
        balance={creditBalance.toFormat()}
        newEntryKey="credit"
        setPayed={setReceived}
        onClickPayed={markAsPayed}
      />
      <DashboardTable
        title="Debit"
        subtitle="every operation that subtracts account balance"
        columns={columns(debit)}
        datasource={debit}
        balance={debitBalance.toFormat()}
        newEntryKey="debit"
        setPayed={setPayed}
        onClickPayed={markAsPayed}
      />
    </div>
  );
};
