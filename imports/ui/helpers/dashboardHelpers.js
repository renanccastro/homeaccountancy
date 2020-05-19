import keyBy from 'lodash.keyby';
import Dinero from 'dinero.js';
import moment from 'moment';
import { AccountingEntries } from '../../api/accountingEntries';
import { InstallmentsCollection } from '../../api/installments';
import { Accounts } from '../../api/accounts';
import { Categories } from '../../api/categories';

export function fetchDashboardData(startRange, endRange, filters = {}) {
  const { payed = false } = filters;
  const dateQuery = {
    $and: [
      { dueDate: { $gte: startRange.toDate() } },
      { dueDate: { $lte: endRange.toDate() } },
    ],
  };

  const creditEntries = AccountingEntries.find({
    credit: true,
    payed,
    ...dateQuery,
  }).fetch();
  const debitEntries = AccountingEntries.find({
    credit: false,
    payed,
    ...dateQuery,
  }).fetch();
  const installments = InstallmentsCollection.find().fetch();
  const accounts = keyBy(Accounts.find().fetch(), '_id');
  const categories = keyBy(Categories.find().fetch(), '_id');

  const mapper = obj => ({
    ...obj,
    money: new Dinero({ amount: obj.value }),
    account: accounts[obj.accountId],
    categories: obj.categoryIds.map(_id => categories[_id]),
  });
  const installmentToEntryMapper = obj => {
    const { startDate } = obj;
    const installment = moment(endRange).diff(moment(startDate), 'months') + 1;
    if (installment > obj.installments) {
      return null;
    }
    if (payed && !obj.payedInstallments?.includes(installment)) {
      return null;
    }
    return {
      ...obj,
      installment,
      payed: true,
      money: new Dinero({ amount: obj.value }),
      account: accounts[obj.accountId],
      categories: obj.categoryIds.map(_id => categories[_id]),
    };
  };

  const mappedCredit = creditEntries.map(mapper);
  const mappedDebit = debitEntries
    .concat(installments.map(installmentToEntryMapper).filter(Boolean))
    .map(mapper);
  let dineroBalance = new Dinero({ amount: 0 });
  let creditDinero = new Dinero({ amount: 0 });
  let debitDinero = new Dinero({ amount: 0 });
  mappedCredit.forEach(({ money }) => {
    dineroBalance = dineroBalance.add(money);
    creditDinero = creditDinero.add(money);
  });
  mappedDebit.forEach(({ money }) => {
    dineroBalance = dineroBalance.subtract(money);
    debitDinero = debitDinero.add(money);
  });
  return {
    credit: mappedCredit,
    debit: mappedDebit,
    balance: dineroBalance,
    creditBalance: creditDinero,
    debitBalance: debitDinero,
  };
}
