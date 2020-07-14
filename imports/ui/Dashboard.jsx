import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import { Categories } from '../api/categories';
import { markAsPayed } from '../api/methods/markAsPayed';
import { AccountingEntries } from '../api/accountingEntries';
import { Accounts } from '../api/accounts';
import { useDashboardData } from './helpers/dashboardHelpers';
import { DashboardTable } from '../components/DashboardTable';
import { InstallmentsCollection } from '../api/installments';
import { ColumnsAccounting } from '../components/columns/ColumnsAccounting';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';

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

  return (
    <>
      {isLoading ? (
        <SpinnerLoading tip="Loading..." />
      ) : (
        <div>
          <DashboardTable
            title="Credit"
            subtitle="every operation that adds account balance"
            columns={ColumnsAccounting(credit)}
            datasource={credit}
            balance={creditBalance.toFormat()}
            newEntryKey="credit"
            onClickPayed={markAsPayedClient}
            newEntryFormat="new-accounting-entry"
            filterOptionString="payed"
          />
          <DashboardTable
            title="Debit"
            subtitle="every operation that subtracts account balance"
            columns={ColumnsAccounting(debit)}
            datasource={debit}
            balance={debitBalance.toFormat()}
            newEntryKey="debit"
            onClickPayed={markAsPayedClient}
            newEntryFormat="new-accounting-entry"
            filterOptionString="payed"
          />
        </div>
      )}
    </>
  );
};
