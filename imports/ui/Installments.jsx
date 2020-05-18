import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import keyBy from 'lodash.keyby';

import { Table, Tag, Space, Button, PageHeader, Row, Statistic } from 'antd';
import { Link } from '@reach/router';
import { InstallmentsCollection } from '../api/installments';
import { Accounts } from '../api/accounts';
import { Categories } from '../api/categories';

export const Installments = () => {
  const installments = useTracker(() => {
    const all = InstallmentsCollection.find().fetch();
    const accounts = keyBy(Accounts.find().fetch(), '_id');
    const categories = keyBy(Categories.find().fetch(), '_id');

    return all.map(obj => ({
      ...obj,
      account: accounts[obj.accountId],
      categories: obj.categoryIds.map(_id => categories[_id]),
    }));
  });
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
      render: account => <a>{account?.name}</a>,
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
              confirm('Are you sure?').then(() => {
                InstallmentsCollection.remove(record._id);
              });
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
        title="Installments"
        // tags={<Tag color="blue">Running</Tag>}
        subTitle="every installment you need to control here"
        extra={[
          <Button type="primary">
            <Link to="/new-installment">+ Add</Link>
          </Button>,
        ]}
      >
        <Row>
          <Statistic title="Subtotal" />
        </Row>
      </PageHeader>

      <Table columns={columns} dataSource={installments} />
    </div>
  );
};
