import React, { useRef, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
import keyBy from 'lodash.keyby';
import Switch from 'antd/es/switch';
import Dinero from 'dinero.js';
import { Categories } from '../api/categories';
import { Accounts } from '../api/accounts';
import { AccountingEntries } from '../api/accountingEntries';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const AddAccountingEntry = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [accountId, setAccountId] = useState(null);

  const { categories, accounts, accountsMap } = useTracker(() => {
    const accountsData = Accounts.find().fetch();
    return {
      categories: Categories.find().fetch(),
      accounts: accountsData,
      accountsMap: keyBy(accountsData, '_id'),
    };
  });

  const onAccountChange = value => {
    const accountDueDate = accountsMap[value].dueDate;
    setAccountId(value);
    if (accountDueDate) {
      formRef.current.setFieldsValue({
        creditCard: true,
      });
    }
  };

  const onFinish = values => {
    AccountingEntries.insert({
      ...values,
      dueDate: values.dueDate?.toDate(),
      startMonth: values.dueDate?.toDate(),
      purchaseDate: values.dueDate?.toDate(),
      createdAt: new Date(),
    });
    navigate('../', { replace: true });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      ref={formRef}
      {...layout}
      form={form}
      name="basic"
      initialValues={{
        purchaseDate: moment(),
        creditCard: false,
        credit: false,
        value: 0,
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

      <Form.Item label="Is credit entry?" name="credit">
        <Switch />
      </Form.Item>

      <Form.Item
        label="value"
        name="value"
        rules={[{ required: true, message: 'Please input the value!' }]}
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
