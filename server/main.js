import { Meteor } from 'meteor/meteor';
import { HttpBasicAuth } from 'meteor/jabbslad:basic-auth';
import { createAccounts, createCategories } from '/imports/api/data';
import { Accounts } from '/imports/api/accounts';
import { AccountingEntries } from '/imports/api/accountingEntries';
import { Categories } from '/imports/api/categories';
import { InstallmentsCollection } from '/imports/api/installments';
import newAccountingEntry from './src/publications/newAccountingEntry'
import dashboardData from './src/publications/dashboardData'
import { markAsPayed } from "../imports/api/methods/dashboardMethods";

Meteor.startup(() => {
  const basicAuth = new HttpBasicAuth('admin', 'teste');
  basicAuth.protect();
  createCategories();
  createAccounts();
});
