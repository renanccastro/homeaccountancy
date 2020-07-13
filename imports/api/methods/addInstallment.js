import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import keyBy from 'lodash.keyby';
import { InstallmentsCollection } from '../installments';
import { Accounts } from '../accounts';

export const addInstallment = new ValidatedMethod({
  name: 'addInstallment',

  validate({ startMonth, startDate, ...values }) {
    if (!values) {
      throw new Meteor.Error('Validation error', 'Values must not be null');
    }
  },
  // TODO ----> error TypeError: config._d.getTime is not a function
  run({ startMonth, startDate, ...values }) {
    const accountsMap = keyBy(Accounts.find().fetch(), '_id');
    const { dueDate, creditCard } = accountsMap[values.accountId];
    InstallmentsCollection.insert({
      ...values,
      startDate: creditCard
        ? startMonth.set('date', dueDate).toDate()
        : values.startDate?.toDate(),
      purchaseDate: values.purchaseDate?.toDate(),
      finished: false,
      payedInstallments: [],
    });
  },
});
