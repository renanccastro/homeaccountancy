import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import keyBy from 'lodash.keyby';
import { InstallmentsCollection } from '../installments';
import { Accounts } from '../accounts';

export const addInstallment = new ValidatedMethod({
  name: 'addInstallment',

  validate({ startMonth, startDate, ...values }) {
    if (!startMonth || !startDate) {
      throw new Meteor.Error('Validation error', 'Date must not be null');
    }
  },

  run({ startMonth, startDate, ...values }) {
    const { accountMap } = {
      accountMap: keyBy(Accounts.find().fetch(), '_id'),
    };
    const { dueDate } = accountMap[values.accountId];
    InstallmentsCollection.insert({
      ...values,
      startDate: dueDate
        ? startMonth.set('date', dueDate).toDate()
        : values.startDate.toDate(),
      purchaseDate: values.dueDate?.toDate(),
      finished: false,
      payedInstallments: [],
    });
  },
});
