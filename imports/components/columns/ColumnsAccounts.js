import { Checkbox, Space } from 'antd';
import React from 'react';
import { Link } from '@reach/router';
import { deleteAccount } from '../../api/methods/deleteAccount';

export const ColumnsAccounts = (accounts) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => text,
  },
  {
    title: 'Credit Card',
    dataIndex: 'creditCard',
    key: 'creditCard',
    render: (bol) => <Checkbox defaultChecked={bol} checked={bol} disabled />,
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
              deleteAccount.call({ _id });
            }
          }}
        >
          Delete
        </a>
        <Link to={`/new-account/not-credit/${record._id}`} className="nav-text">
          Edit
        </Link>
      </Space>
    ),
  },
];

export const ColumnsAccountsCreditCard = (creditCard) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => text,
  },
  {
    title: 'Credit Card',
    dataIndex: 'creditCard',
    key: 'creditCard',
    render: (bol) => <Checkbox defaultChecked={bol} checked={bol} disabled />,
  },
  {
    title: 'Due date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    defaultSortOrder: 'descend',
    sorter: ({ dueDate: a }, { dueDate: b }) => a - b,
    render: (value, entry) => value,
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
              deleteAccount.call({ _id });
            }
          }}
        >
          Delete
        </a>
        <Link
          to={`/new-account/credit-card/${record._id}`}
          className="nav-text"
        >
          Edit
        </Link>
      </Space>
    ),
  },
];
