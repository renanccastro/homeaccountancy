import { Space } from 'antd';
import React from 'react';
import { deleteCategorie } from '../../api/methods/deleteCategorie';

export const ColumnsCategories = (categories) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: ({ name: a }, { name: b }) => a.localeCompare(b),
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
              deleteCategorie.call({ _id });
            }
          }}
        >
          Delete
        </a>
      </Space>
    ),
  },
];
