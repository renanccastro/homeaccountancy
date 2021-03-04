import React from 'react';
import { Router } from '@reach/router';
import Dinero from 'dinero.js';
import { Dashboard } from './Dashboard';
import { Installments } from './Installments';
import { Template } from './Template';
import { AddInstallment } from './AddInstallment';
import { AddAccountingEntry } from './AddAccountingEntry';
import { AccountsView } from './AccountsView';
import { AddAccount } from './AddAccount';
import { CategoriesView } from './CategoriesView';
import { AddCategories } from './AddCategories';

Dinero.defaultCurrency = 'BRL';
Dinero.defaultPrecision = 2;
Dinero.globalLocale = 'pt-BR';

export const App = () => (
  <Router className="router-class">
    <Template component={Dashboard} path="dashboard" />
    <Template component={Dashboard} path="/dashboard/:year/:month" />
    <Template component={Dashboard} path="/" />
    <Template component={AddInstallment} path="/new-installment/:format" />
    <Template
      component={AddAccountingEntry}
      path="/new-accounting-entry/:format"
    />
    <Template
      component={AddAccountingEntry}
      path="/new-accounting-entry/:format/:id"
    />
    <Template component={Installments} path="installments" />
    <Template component={AccountsView} path="/accounts" />
    <Template component={AddAccount} path="/new-account/:format" />
    <Template component={AddAccount} path="/new-account/:format/:id" />
    <Template component={CategoriesView} path="/categories" />
    <Template component={AddCategories} path="/new-categorie/" />
  </Router>
);
