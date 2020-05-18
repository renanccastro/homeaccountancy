import React from 'react';
import InputNumber from 'antd/es/input-number';
import Dinero from 'dinero.js';

export const MoneyInput = () => {
  return (
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
  );
};
