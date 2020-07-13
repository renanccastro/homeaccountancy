import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';

import { Button, PageHeader, Table, Tabs } from 'antd';
import { Link } from '@reach/router';
import { Accounts } from '../api/accounts';
import {
  ColumnsAccounts,
  ColumnsAccountsCreditCard,
} from '../components/columns/ColumnsAccounts';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';
import AndroidOutlined from '@ant-design/icons/lib/icons/AndroidOutlined';

const { TabPane } = Tabs;

export const AccountsView = () => {
  const { accounts, creditCard, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('accounts.findAll');
    return {
      isLoading: !handler.ready(),
      accounts: Accounts.find({ creditCard: false }).fetch(),
      creditCard: Accounts.find({ creditCard: true }).fetch(),
    };
  });

  if (isLoading) {
    return <SpinnerLoading tip="Loading..." />;
  }

  return (
    <div>
      <PageHeader
        title="Accounts"
        // tags={<Tag color="blue">Running</Tag>}
        subTitle="every account you need to control here"
        extra={[
          <Button type="primary">
            <Link to="/new-account/credit-card">+ Add</Link>
          </Button>,
        ]}
      />

      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Bank Accounts
            </span>
          }
          key="1"
        >
          <Table columns={ColumnsAccounts(accounts)} dataSource={accounts} />
        </TabPane>

        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Credit Card Accounts
            </span>
          }
          key="2"
        >
          <Table
            columns={ColumnsAccountsCreditCard(creditCard)}
            dataSource={creditCard}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
