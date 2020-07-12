import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import { Space, Spin, Tag } from 'antd';

import Dinero from 'dinero.js';
import { Link } from '@reach/router';
import moment from 'moment';
import Tabs from 'antd/es/tabs';
import { Categories } from '../api/categories';
import { markAsPayed } from '../api/methods/markAsPayed';
import { AccountingEntries } from '../api/accountingEntries';
import { Accounts } from '../api/accounts';
import { useDashboardData } from './helpers/dashboardHelpers';
import { DashboardTable } from '../components/DashboardTable';
import { InstallmentsCollection } from '../api/installments';
import { deleteAccountingEntry } from '../api/methods/deleteAccountingEntry';

const { TabPane } = Tabs;

export const Dashboard = ({
  year = moment().format('YYYY'),
  month = moment().format('MMMM'),
}) => {
  const start = moment(`${year}/${month}/01`, 'YYYY/MMMM/DD').toDate();
  const startRange = moment(start).startOf('month');
  const endRange = moment(start).endOf('month');

  const filters = {
    startRange: startRange.toDate(),
    endRange: endRange.toDate(),
  };

  const {
    credit,
    debit,
    accountsArray,
    categoriesArray,
    installments,
    isLoading,
  } = useTracker(() => {
    const handle = Meteor.subscribe('dashboardData.fetchAll', filters);
    return {
      isLoading: !handle.ready(),
      credit: AccountingEntries.find({
        credit: true,
      }).fetch(),
      debit: AccountingEntries.find({
        credit: false,
      }).fetch(),
      accountsArray: Accounts.find().fetch(),
      categoriesArray: Categories.find().fetch(),
      installments: InstallmentsCollection.find().fetch(),
    };
  }, [filters]);

  const { debitBalance, creditBalance } = useDashboardData(
    credit,
    debit,
    accountsArray,
    categoriesArray,
    installments,
    startRange,
    endRange
  );

  const markAsPayedClient = (rowsIds) => {
    const obj = {
      rowsIds,
      endDate: endRange.toDate(),
    };
    markAsPayed.call(obj);
  };

  const columns = (entries) => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name < b.name,
      render: (text) => text,
    },
    {
      title: 'Categories',
      key: 'categoryIds',
      dataIndex: 'categoryIds',
      render: (categorieIdArray) => {
        let names = [];
        categorieIdArray.forEach((catId) => {
          const categorie = categoriesArray.find((cat) => cat._id == catId);
          names.push(categorie.name);
        });
        return (
          <>
            {names.map((name) => {
              const color = name.length > 5 ? 'geekblue' : 'green';
              return (
                <Tag color={color} key={name}>
                  {name.toUpperCase()}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: 'Account',
      dataIndex: 'accountId',
      key: 'accountId',
      render: (accountId) => {
        const account = accountsArray.find((acc) => acc._id == accountId);
        return account.name;
      },
      defaultSortOrder: 'descend',
      //TODO:fix sorter
      sorter: (a, b) => a.account?.name - b.account?.name,
      filters: entries.map(({ account }) => ({
        text: account?.name,
        value: account?.name,
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
      dataIndex: 'value',
      key: 'value',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.money.greaterThan(b.money),
      render: (value) => Dinero({ amount: value }).toFormat(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <a
            onClick={() => {
              const { _id } = record;
              // eslint-disable-next-line no-restricted-globals
              const confirmation = confirm('Are you sure?');
              if (confirmation) {
                deleteAccountingEntry.run(_id);
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
    <>
      {isLoading ? (
        <Spin tip="Loading..." />
      ) : (
        <div>
          <DashboardTable
            title="Credit"
            subtitle="every operation that adds account balance"
            columns={columns(credit)}
            datasource={credit}
            balance={creditBalance.toFormat()}
            newEntryKey="credit"
            onClickPayed={markAsPayedClient}
          />
          <DashboardTable
            title="Debit"
            subtitle="every operation that subtracts account balance"
            columns={columns(debit)}
            datasource={debit}
            balance={debitBalance.toFormat()}
            newEntryKey="debit"
            onClickPayed={markAsPayedClient}
          />
        </div>
      )}
    </>
  );
};
