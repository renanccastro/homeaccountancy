import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';

import keyBy from 'lodash.keyby';
import Dinero from 'dinero.js';
import moment from 'moment';
import { AccountingEntries } from '../../api/accountingEntries';
import {
  getInstallmentNumber,
  InstallmentsCollection,
} from '../../api/installments';
import { Accounts } from '../../api/accounts';
import { Categories } from '../../api/categories';

export function useDashboardData(startRange, endRange, filters = {}) {
  const {
    credit,
    debit,
    balance,
    debitBalance,
    creditBalance,
  } = useTracker(() => {
    const { payed = false, received = false } = filters;
    const dateQuery = {
      dueDate: { $gte: startRange.toDate(), $lte: endRange.toDate() },
    };

    const creditEntries = AccountingEntries.find({
      credit: true,
      payed: received,
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
      key: obj._id,
      money: new Dinero({ amount: obj.value }),
      account: accounts[obj.accountId],
      categories: obj.categoryIds.map(_id => categories[_id]),
    });
    const installmentToEntryMapper = obj => {
      const { startDate } = obj;
      const installment = getInstallmentNumber(startDate, endRange);
      if (installment > obj.installments || endRange.isBefore(startDate)) {
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
  }, [startRange, endRange, filters]);
  return {
    credit,
    debit,
    balance,
    debitBalance,
    creditBalance,
  };
}
