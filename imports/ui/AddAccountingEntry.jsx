import React, { useRef } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
import keyBy from 'lodash.keyby';
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
    if (accountDueDate) {
      formRef.current.setFieldsValue({
        isCreditCard: true,
      });
    }
  };

  const onFinish = values => {
    AccountingEntries.insert({
      ...values,
      dueDate: values.startDate.toDate(),
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
      initialValues={{ dueDate: moment(), isCreditCard: false }}
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
        name="categoryId"
        rules={[{ required: true, message: 'Please input the category!' }]}
      >
        <Select placeholder="Select an category" allowClear>
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

      <Form.Item
        label="Due Date"
        name="dueDate"
        rules={[{ required: true, message: 'Please input the due date!' }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        label="value"
        name="value"
        rules={[{ required: true, message: 'Please input the value!' }]}
      >
        <InputNumber
          defaultValue={1000}
          formatter={value =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
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
