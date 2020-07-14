import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import keyBy from 'lodash.keyby';
import { InstallmentsCollection } from '../installments';
import { Accounts } from '../accounts';

export const addInstallment = new ValidatedMethod({
  name: 'addInstallment',

  validate(values) {
    if (!values) {
      throw new Meteor.Error('Validation error', 'Values must not be null');
    }
  },

  run(values) {
    const accountsMap = keyBy(Accounts.find().fetch(), '_id');
    const { creditCard } = accountsMap[values.accountId];
    InstallmentsCollection.insert({
      ...values,
      startDate: creditCard ? values.startMonth : values.startDate,
      finished: false,
      payedInstallments: [],
    });
  },
});
