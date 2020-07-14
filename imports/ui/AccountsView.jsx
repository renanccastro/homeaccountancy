import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import { Accounts } from '../api/accounts';
import { ColumnsAccounts } from '../components/columns/ColumnsAccounts';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';
import { DashboardTable } from '../components/DashboardTable';

const tabsNames = ['Account', 'Credit Card'];

export const AccountsView = () => {
  const { accounts, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('accounts.findAll');
    return {
      isLoading: !handler.ready(),
      accounts: Accounts.find().fetch(),
    };
  });

  return (
    <>
      {isLoading ? (
        <SpinnerLoading tip="Loading..." />
      ) : (
        <div>
          <DashboardTable
            title="Accounts"
            subtitle="every account you registered appears here"
            columns={ColumnsAccounts(accounts)}
            datasource={accounts}
            newEntryKey="account"
            enableRowSelection={false}
            enableBalance={false}
            tabsNames={tabsNames}
            filterOptionString="creditCard"
          />
        </div>
      )}
    </>
  );
};
