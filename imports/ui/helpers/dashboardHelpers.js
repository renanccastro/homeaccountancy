import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';

import keyBy from 'lodash.keyby';
import Dinero from 'dinero.js';
import { getInstallmentNumber } from '../../api/installments';

export function useDashboardData(
  creditEntries,
  debitEntries,
  accountsEntries,
  categoriesEntries,
  installmentsEntries,
  startRange,
  endRange,
  filters = {}
) {
  const { balance, debitBalance, creditBalance } = useTracker(() => {
    const accounts = keyBy(accountsEntries, '_id');
    const categories = keyBy(categoriesEntries, '_id');

    const mapper = (obj) => ({
      ...obj,
      key: obj._id,
      money: new Dinero({ amount: obj.value }),
      account: accounts[obj.accountId],
      categories: obj.categoryIds.map((_id) => categories[_id]),
    });
    const installmentToEntryMapper = (obj) => {
      const { startDate } = obj;
      const installment = getInstallmentNumber(startDate, endRange);
      if (installment > obj.installments || endRange.isBefore(startDate)) {
        return null;
      }
      if (!obj.payedInstallments?.includes(installment)) {
        return null;
      }
      return {
        ...obj,
        installment,
        payed: true,
        money: new Dinero({ amount: obj.value }),
        account: accounts[obj.accountId],
        categories: obj.categoryIds.map((_id) => categories[_id]),
      };
    };

    const mappedCredit = creditEntries.map(mapper);
    const mappedDebit = debitEntries
      .concat(installmentsEntries.map(installmentToEntryMapper).filter(Boolean))
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
  }, [
    creditEntries,
    debitEntries,
    installmentsEntries,
    categoriesEntries,
    accountsEntries,
    startRange,
    endRange,
  ]);
  return {
    balance,
    debitBalance,
    creditBalance,
  };
}
