import { Meteor } from 'meteor/meteor';
import { HttpBasicAuth } from 'meteor/jabbslad:basic-auth';
import { createAccounts, createCategories } from '/imports/api/data';
import '../imports/api/apiIndex';
import './src/publications/publicationsIndex';

Meteor.startup(() => {
  const basicAuth = new HttpBasicAuth('admin', 'teste');
  basicAuth.protect();
  createCategories();
  createAccounts();
});
