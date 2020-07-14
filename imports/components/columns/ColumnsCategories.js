import { Checkbox, Space } from 'antd';
import React from 'react';
import { Link } from '@reach/router';
import { deleteAccount } from '../../api/methods/deleteAccount';

export const ColumnsCategories = (categories) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
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
      </Space>
    ),
  },
];
