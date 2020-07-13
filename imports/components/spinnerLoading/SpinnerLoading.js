import React from 'react';
import { Spin } from 'antd';
import './css/loadingSpinner.css';

export const SpinnerLoading = ({ ...props }) => {
  return (
    <div className="spinner-div">
      <Spin {...props} />
    </div>
  );
};
