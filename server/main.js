import { Meteor } from 'meteor/meteor';
import { HttpBasicAuth } from 'meteor/jabbslad:basic-auth';
import { createAccounts, createCategories } from '/imports/api/data';
import '../imports/api/apiIndex';
import '../imports/api/server/publications/publicationsIndex';

Meteor.startup(() => {
  const basicAuth = new HttpBasicAuth('admin', 'teste');
  basicAuth.protect();
  createCategories();
  createAccounts();
});
