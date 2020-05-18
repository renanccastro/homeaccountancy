import React from 'react';
import { Router } from '@reach/router';
import Dinero from 'dinero.js';
import { Dashboard } from './Dashboard';
import { Installments } from './Installments';
import { Template } from './Template';
import { AddInstallment } from './AddInstallment';
import { AddAccountingEntry } from './AddAccountingEntry';

Dinero.defaultCurrency = 'BRL';
Dinero.defaultPrecision = 2;
Dinero.globalLocale = 'pt-BR';

export const App = () => (
  <Router className="router-class">
    <Template component={Dashboard} path="dashboard" />
    <Template component={Dashboard} path="/dashboard/:year/:month" />
    <Template component={Dashboard} path="/" />
    <Template component={AddInstallment} path="/new-installment" />
    <Template component={AddAccountingEntry} path="/new-accounting-entry" />
    <Template component={Installments} path="installments" />
  </Router>
);
