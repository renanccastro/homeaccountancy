import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from '@reach/router';
import moment from 'moment';
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
