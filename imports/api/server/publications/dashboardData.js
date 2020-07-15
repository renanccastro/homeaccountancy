import { AccountingEntries } from '../../accountingEntries';
import { InstallmentsCollection } from '../../installments';
import { Accounts } from '../../accounts';
import { Categories } from '../../categories';

Meteor.publish('dashboardData.fetchAll', function (filters) {
  const { startRange, endRange } = filters;
  const dateQuery = {
    dueDate: { $gte: startRange, $lte: endRange },
  };
  const entries = AccountingEntries.find({
    ...dateQuery,
  });

  const installments = InstallmentsCollection.find();
  const accounts = Accounts.find();
  const categories = Categories.find();

  return [entries, installments, accounts, categories];
});
