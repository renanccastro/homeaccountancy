import React, { useRef, useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { useNavigate } from '@reach/router';
import Select from 'antd/es/select';
import { useTracker } from 'meteor/react-meteor-data';
import DatePicker from 'antd/es/date-picker';
import moment from 'moment';
import mapValues from 'lodash.mapvalues';
import Switch from 'antd/es/switch';
import { Accounts } from '../api/accounts';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';
import { addAccount } from '../api/methods/addAccount';

const { Option } = Select;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const AddAccount = ({ format, id }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formRef = useRef();
  const [isCreditCard, setIsCreditCard] = useState(format === 'credit-card');

  const { isLoading, existingEntry } = useTracker(() => {
    const handler = Meteor.subscribe('accounts.findAll');
    return {
      isLoading: !handler.ready(),
      existingEntry: Accounts.findOne(id),
    };
  });

  const initialValues = existingEntry
    ? mapValues(existingEntry, (value, key) => {
        if (value instanceof Date) {
          return moment(value);
        }
        return value;
      })
    : {
        purchaseDate: moment(),
        creditCard: format === 'credit-card',
        dueDate: moment(),
      };

  const onSwitchChange = (bol, event) => {
    setIsCreditCard(bol);
  };

  const onFinish = (values) => {
    addAccount.call({ id, ...values });
    navigate('/accounts', { replace: true });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (isLoading || (id && !existingEntry)) {
    return <SpinnerLoading tip="Loading..." />;
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
        label="Is credit entry?"
        name="creditCard"
        valuePropName="checked"
      >
        <Switch onChange={onSwitchChange} />
      </Form.Item>

      {isCreditCard ? (
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: 'Please input the due date!' }]}
        >
          <InputNumber min={1} max={31} defaultValue={1} />
        </Form.Item>
      ) : null}

      <Form.Item {...tailLayout}>
        <Button
          type="ghost"
          htmlType="button"
          onClick={() => navigate('../accounts', { replace: true })}
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
