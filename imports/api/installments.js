import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const InstallmentsCollection = new Mongo.Collection('installments');

export function getInstallmentNumber(startDate, endRange) {
  return moment(endRange).diff(moment(startDate), 'months') + 1;
}
