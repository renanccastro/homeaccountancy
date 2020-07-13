import { Space, Tag } from 'antd';
import moment from 'moment';
import { InstallmentsCollection } from '../../api/installments';
import React from 'react';

export const ColumnsInstallments = (installments) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => text,
  },
  {
    title: 'Categories',
    key: 'categories',
    dataIndex: 'categories',
    render: (categories) => (
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
    render: (account) => <a>{account?.name}</a>,
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.account.name - b.account.name,
    filters: installments?.map(({ account }) => ({
      text: account?.name,
      value: account?.name,
    })),
  },
  {
    title: '# of Installments',
    dataIndex: 'installments',
    key: 'installments',
  },
  {
    title: 'Start',
    dataIndex: 'start',
    key: 'start',
    defaultSortOrder: 'descend',
    render: (o) => moment(o).format('DD/MM/YYYY'),
    sorter: (a, b) => a.start - b.start,
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a
          onClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('Are you sure?')) {
              InstallmentsCollection.remove(record._id);
            }
          }}
        >
          Delete
        </a>
      </Space>
    ),
  },
];
