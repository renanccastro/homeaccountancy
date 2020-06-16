import React, { useRef, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
import keyBy from 'lodash.keyby';
import mapValues from 'lodash.mapvalues';
import Switch from 'antd/es/switch';
import Dinero from 'dinero.js';
import Spin from 'antd/es/spin';
import { Categories } from '../api/categories';
import { Accounts } from '../api/accounts';
import { AccountingEntries } from '../api/accountingEntries';
import { InstallmentsCollection } from '../api/installments';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const AddAccountingEntry = ({ format, id }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [accountId, setAccountId] = useState(null);

  const {
    categories,
    accounts,
    accountsMap,
    existingEntry,
    isLoading,
  } = useTracker(() => {
    const handle = Meteor.subscribe('newAccounting.fetchAll');
    const accountsData = Accounts.find().fetch();
    return {
      isLoading: !handle.ready(),
      accounts: Accounts.find().fetch(),
      categories: Categories.find().fetch(),
      accountsMap: keyBy(accountsData, '_id'),
      existingEntry: AccountingEntries.findOne(id),
    };
  });

  const onAccountChange = (value) => {
    const accountDueDate = accountsMap[value].dueDate;
    setAccountId(value);
    if (accountDueDate) {
      formRef.current.setFieldsValue({
        creditCard: true,
      });
    }
  };

  const onFinish = ({ startMonth, ...values }) => {
    const { dueDate } = accountsMap[values.accountId];
    const dates = {
      dueDate: dueDate
        ? startMonth.set('date', dueDate).toDate()
        : values.dueDate.toDate(),
      purchaseDate: values.purchaseDate?.toDate(),
    };

    if (id) {
      AccountingEntries.update(id, {
        $set: {
          ...values,
          ...dates,
          updatedAt: new Date(),
        },
      });
      navigate('/', { replace: true });
      return;
    }
    AccountingEntries.insert({
      ...values,
      ...dates,
      createdAt: new Date(),
    });
    navigate('/', { replace: true });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const initialValues = existingEntry
    ? mapValues(existingEntry, (value, key) => {
        if (value instanceof Date) {
          return moment(value);
        }
        return value;
      })
    : {
        purchaseDate: moment(),
        creditCard: false,
        credit: format === 'credit',
        value: 0,
        startMonth: moment().add(1, 'month'),
        dueDate: moment(),
        payed: false,
      };
  if (isLoading || (id && !existingEntry)) {
    return <Spin tip="Loading..." />;
  }
  return (
    <Form
      ref={formRef}
      {...layout}
      form={form}
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input the name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Category"
        name="categoryIds"
        rules={[{ required: true, message: 'Please input the category!' }]}
      >
        <Select placeholder="Select an category" allowClear mode="multiple">
          {categories.map(({ name, _id }) => (
            <Option value={_id}>{name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Account"
        name="accountId"
        rules={[{ required: true, message: 'Please input the account!' }]}
      >
        <Select
          placeholder="Select an account"
          onChange={onAccountChange}
          allowClear
        >
          {accounts.map(({ name, _id }) => (
            <Option value={_id}>{name}</Option>
          ))}
        </Select>
      </Form.Item>

      {!accountId || !accountsMap[accountId].creditCard ? (
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: 'Please input the due date!' }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      ) : (
        <Form.Item
          label="Start Month"
          name="startMonth"
          rules={[{ required: true, message: 'Please input the start month!' }]}
        >
          <DatePicker.MonthPicker />
        </Form.Item>
      )}

      <Form.Item
        label="Purchase Date"
        name="purchaseDate"
        rules={[{ required: true, message: 'Please input the purchase date!' }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item label="Is credit entry?" name="credit" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="Payed?" name="payed" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item
        label="value"
        name="value"
        rules={[{ required: true, message: 'Please input the value!' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) => {
            console.log(value);
            return new Dinero({ amount: parseInt(value, 10) || 0 }).toFormat();
          }}
          parser={(value) => {
            return value.replace(/[^0-9]/g, '');
          }}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button
          type="ghost"
          htmlType="button"
          onClick={() => navigate('../', { replace: true })}
        >
          Back
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
