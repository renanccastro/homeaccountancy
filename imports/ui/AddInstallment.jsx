import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
import Dinero from 'dinero.js';
import keyBy from 'lodash.keyby';
import { InstallmentsCollection } from '../api/installments';
import { Categories } from '../api/categories';
import { Accounts } from '../api/accounts';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const AddInstallment = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [accountId, setAccountId] = useState(null);
  const { categories, accounts, accountMap } = useTracker(() => {
    return {
      categories: Categories.find().fetch(),
      accounts: Accounts.find().fetch(),
      accountMap: keyBy(Accounts.find().fetch(), '_id'),
    };
  });
  const onFinish = ({ startMonth, startDate, ...values }) => {
    const { dueDate } = accountMap[values.accountId];

    InstallmentsCollection.insert({
      ...values,
      startDate: dueDate
        ? startMonth.set('date', dueDate).toDate()
        : values.startDate.toDate(),
      purchaseDate: values.dueDate?.toDate(),
      finished: false,
      payedInstallments: [],
    });
    navigate('../', { replace: true });
  };

  const onAccountChange = value => {
    setAccountId(value);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      form={form}
      name="basic"
      initialValues={{
        purchaseDate: moment(),
        startDate: moment(),
        finished: false,
      }}
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
          allowClear
          onChange={onAccountChange}
        >
          {accounts.map(({ name, _id }) => (
            <Option value={_id}>{name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Installments"
        name="installments"
        rules={[
          { required: true, message: 'Please input the # of installments!' },
        ]}
      >
        <InputNumber min={1} max={60} />
      </Form.Item>

      <Form.Item
        label="Value of Installments"
        name="value"
        rules={[
          {
            required: true,
            message: 'Please input the value of individual installments!',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => {
            console.log(value);
            return new Dinero({ amount: parseInt(value, 10) || 0 }).toFormat();
          }}
          parser={value => {
            return value.replace(/[^0-9]/g, '');
          }}
        />
      </Form.Item>

      {!accountId || !accountMap[accountId].creditCard ? (
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: 'Please input the start date!' }]}
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
