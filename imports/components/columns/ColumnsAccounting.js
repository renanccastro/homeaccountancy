import React from 'react';
import { Link } from '@reach/router';
import { Space, Tag } from 'antd';
import moment from 'moment';
import Dinero from '../../../node_modules/dinero.js/build/esm/dinero';
import { deleteAccountingEntry } from '../../api/methods/deleteAccountingEntry';
import { getInstallmentNumber } from '../../api/installments';
import { Categories } from '../../api/categories';
import { Accounts } from '../../api/accounts';

export const ColumnsAccounting = (entries) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: ({ name: a }, { name: b }) => a.localeCompare(b),
    render: (text) => text,
  },
  {
    title: 'Categories',
    key: 'categoryIds',
    dataIndex: 'categoryIds',
    render: (categorieIdArray) => {
      let names = [];
      categorieIdArray.forEach((catId) => {
        const categorie = Categories.findOne(catId);
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
    // TODO ----> re-render after use set payed button.
    title: 'Account',
    dataIndex: 'accountId',
    key: 'accountId',
    render: (accountId) => {
      const account = Accounts.findOne(accountId);
      return account.name;
    },
    defaultSortOrder: 'descend',
    sorter: ({ accountId: a }, { accountId: b }) => {
      const [accountA, accountB] = Accounts.find({
        _id: { $in: [a, b] },
      }).fetch();
      return accountA?.name.localeCompare(accountB?.name);
    },
    filters: entries.map(({ accountId }) => {
      const account = Accounts.find((acc) => acc._id === accountId);
      return {
        text: account?.name,
        value: accountId,
      };
    }),
    onFilter: (value, record) => record.accountId === value,
  },
  {
    title: '# of Installments',
    key: 'installment',
    render: ({ dueDate, purchaseDate }, record) =>
      getInstallmentNumber(purchaseDate, dueDate),
  },
  {
    title: 'Due date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    defaultSortOrder: 'descend',
    sorter: ({ dueDate: a }, { dueDate: b }) => a.valueOf() - b.valueOf(),
    render: (value, entry) => moment(value).format('DD/MM/YYYY'),
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    defaultSortOrder: 'descend',
    sorter: ({ value: a }, { value: b }) => a - b,
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
