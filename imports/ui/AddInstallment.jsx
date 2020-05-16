import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import InputNumber from 'antd/es/input-number';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
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

  const { categories, accounts } = useTracker(() => {
    return {
      categories: Categories.find().fetch(),
      accounts: Accounts.find().fetch(),
    };
  });
  const onFinish = values => {
    InstallmentsCollection.insert({
      ...values,
      startDate: values.startDate.toDate(),
    });
    navigate('../', { replace: true });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ startDate: moment() }}
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
        name="category"
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
        name="account"
        rules={[{ required: true, message: 'Please input the account!' }]}
      >
        <Select placeholder="Select an account" allowClear>
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
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: 'Please input the start date!' }]}
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
