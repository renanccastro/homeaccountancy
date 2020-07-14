import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from '@reach/router';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment';
import keyBy from 'lodash.keyby';
import { Categories } from '../api/categories';
import { Accounts } from '../api/accounts';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';
import { addCategorie } from '../api/methods/addCategorie';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const AddCategories = () => {
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
    addCategorie.call({
      ...values,
    });
    navigate('../categories', { replace: true });
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
