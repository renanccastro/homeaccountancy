import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import keyBy from 'lodash.keyby';
import Dinero from 'dinero.js';
import { InstallmentsCollection } from '../api/installments';
import { Accounts } from '../api/accounts';
import { Categories } from '../api/categories';
import { ColumnsInstallments } from '../components/columns/ColumnsInstallments';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';
import { DashboardTable } from '../components/DashboardTable';

export const Installments = () => {
  const { installments, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('installments.findAll');
    const accounts = keyBy(Accounts.find().fetch(), '_id');
    const categoriesArray = keyBy(Categories.find().fetch(), '_id');
    return {
      isLoading: !handle.ready(),
      accounts: Accounts.find().fetch(),
      categories: Categories.find().fetch(),
      installments: InstallmentsCollection.find()
        .fetch()
        .map((obj) => ({
          ...obj,
          account: accounts[obj.accountId],
          categories: obj.categoryIds.map((_id) => categoriesArray[_id]),
        })),
    };
  });

  const balance = useTracker(() => {
    let dineroBalance = new Dinero({ amount: 0 });
    installments.forEach(({ value }) => {
      dineroBalance = dineroBalance.add(new Dinero({ amount: value }));
    });
    return dineroBalance.toFormat();
  }, [installments]);

  return (
    <>
      {isLoading ? (
        <SpinnerLoading tip="Loading..." />
      ) : (
        <div>
          <DashboardTable
            title="Installments"
            subtitle="every installments that adds account balance"
            columns={ColumnsInstallments(installments)}
            datasource={installments}
            balance={balance}
            enableRowSelection={false}
            newEntryKey="credit-card"
          />
        </div>
      )}
    </>
  );
};
