import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
import Dinero from 'dinero.js';
import keyBy from 'lodash.keyby';
import { Categories } from '../api/categories';
import { Accounts } from '../api/accounts';
import { addInstallment } from '../api/methods/addInstallment';
import Spin from 'antd/es/spin';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';

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

  const { categories, accounts, accountsMap, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('newAccounting.fetchAll');
    const accountsData = Accounts.find().fetch();
    return {
      isLoading: !handle.ready(),
      accounts: Accounts.find().fetch(),
      categories: Categories.find().fetch(),
      accountsMap: keyBy(accountsData, '_id'),
    };
  });

  const onFinish = (values) => {
    const { purchaseDate, startDate, startMonth, accId } = values;
    const givenAccount = Accounts.findOne(accId);
    if (startMonth) {
      startMonth.set('date', givenAccount?.dueDate).toDate();
    }
    addInstallment.call({
      ...values,
      startMonth,
      purchaseDate: purchaseDate.toDate(),
      startDate: startDate.toDate(),
    });
    navigate('../installments', { replace: true });
  };

  const onAccountChange = (value) => {
    setAccountId(value);
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Try again!');
    console.log('Failed:', errorInfo);
  };

  if (isLoading) {
    return <SpinnerLoading tip="Loading..." />;
  }

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
          formatter={(value) => {
            console.log(value);
            return new Dinero({ amount: parseInt(value, 10) || 0 }).toFormat();
          }}
          parser={(value) => {
            return value.replace(/[^0-9]/g, '');
          }}
        />
      </Form.Item>

      {!accountId || !accountsMap[accountId].creditCard ? (
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
