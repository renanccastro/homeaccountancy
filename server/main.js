import { Meteor } from 'meteor/meteor';
import { HttpBasicAuth } from 'meteor/jabbslad:basic-auth';
import { createAccounts, createCategories } from '/imports/api/data';
import { Accounts } from '/imports/api/accounts';
import { AccountingEntries } from '/imports/api/accountingEntries';
import { Categories } from '/imports/api/categories';
import { InstallmentsCollection } from '/imports/api/installments';
import newAccountingEntry from './src/publications/newAccountingEntry';
import dashboardData from './src/publications/dashboardData';
import accounts from './src/publications/accounts';
import installments from './src/publications/installments';
import { markAsPayed } from '../imports/api/methods/markAsPayed';
import { deleteAccountingEntry } from '../imports/api/methods/deleteAccountingEntry';
import { addInstallment } from '../imports/api/methods/addInstallment';
import { addAccounting } from '../imports/api/methods/addAccountingEntry';
import { addAccount } from '../imports/api/methods/addAccount';
import { deleteAccount } from '../imports/api/methods/deleteAccount';

Meteor.startup(() => {
  const basicAuth = new HttpBasicAuth('admin', 'teste');
  basicAuth.protect();
  createCategories();
  createAccounts();
});
