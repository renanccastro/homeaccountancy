import React from 'react';
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
import { InstallmentsCollection } from '../api/installments';
import { Categories } from '../api/categories';
import { Accounts } from '../api/accounts';
import { AccountingEntries } from '../api/accountingEntries';

export const Dashboard = ({ year, month }) => {
  const currentYear = moment().format('YYYY');
  const currentMonth = moment().format('MMMM');
  const startRange = moment(
    `${year || currentYear}/${month || currentMonth}/01`,
    'YYYY/MMMM/DD'
  ).startOf('month');
  const endRange = moment(`${year}/${month}/01`, 'YYYY/MMMM/DD').endOf('month');
  const dateQuery = {
    $and: [
      { dueDate: { $gte: startRange.toDate() } },
      { dueDate: { $lte: endRange.toDate() } },
    ],
  };
  const { credit, debit, balance, debitBalance, creditBalance } = useTracker(
    () => {
      const creditEntries = AccountingEntries.find({
        credit: true,
        ...dateQuery,
      }).fetch();
      const debitEntries = AccountingEntries.find({
        credit: false,
        ...dateQuery,
      }).fetch();
      const installments = InstallmentsCollection.find().fetch();
      const accounts = keyBy(Accounts.find().fetch(), '_id');
      const categories = keyBy(Categories.find().fetch(), '_id');

      const mapper = obj => ({
        ...obj,
        money: new Dinero({ amount: obj.value }),
        account: accounts[obj.accountId],
        categories: obj.categoryIds.map(_id => categories[_id]),
      });

      const mappedCredit = creditEntries.map(mapper);
      const mappedDebit = debitEntries.map(mapper);
      let dineroBalance = new Dinero({ amount: 0 });
      let creditDinero = new Dinero({ amount: 0 });
      let debitDinero = new Dinero({ amount: 0 });
      mappedCredit.forEach(({ money }) => {
        dineroBalance = dineroBalance.add(money);
        creditDinero = creditDinero.add(money);
      });
      mappedDebit.forEach(({ money }) => {
        dineroBalance = dineroBalance.subtract(money);
        debitDinero = debitDinero.add(money);
      });
      return {
        credit: mappedCredit,
        debit: mappedDebit,
        balance: dineroBalance,
        creditBalance: creditDinero,
        debitBalance: debitDinero,
      };
    }
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
      dataIndex: 'numberOfInstallments',
      key: 'numberOfInstallments',
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
      <Table columns={columns(debit)} dataSource={debit} />
    </div>
  );
};
