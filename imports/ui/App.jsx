import React from 'react';
import { Router } from '@reach/router';
import { Dashboard } from './Dashboard';
import { Installments } from './Installments';
import { Template } from './Template';
import { AddInstallment } from './AddInstallment';
import { AddAccountingEntry } from './AddAccountingEntry';

export const App = () => (
  <div>
    <Router>
      <Template component={Dashboard} path="dashboard" />
      <Template component={Dashboard} path="/" />
      <Template component={AddInstallment} path="/new-installment" />
      <Template component={AddAccountingEntry} path="/new-accounting-entry" />
      <Template component={Installments} path="installments" />
    </Router>
  </div>
);
