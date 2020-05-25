import { Mongo } from 'meteor/mongo'

export const CreditEntries = new Mongo.Collection("creditEntries")

export const DebitEntries = new Mongo.Collection("debitEntries")