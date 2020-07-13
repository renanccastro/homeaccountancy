import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import keyBy from 'lodash.keyby';

import { Button, PageHeader, Row, Statistic, Table } from 'antd';
import { Link } from '@reach/router';
import { InstallmentsCollection } from '../api/installments';
import { Accounts } from '../api/accounts';
import { Categories } from '../api/categories';
import { ColumnsInstallments } from '../components/columns/ColumnsInstallments';

export const Installments = () => {
  const installments = useTracker(() => {
    const all = InstallmentsCollection.find().fetch();
    const accounts = keyBy(Accounts.find().fetch(), '_id');
    const categories = keyBy(Categories.find().fetch(), '_id');

    return all.map((obj) => ({
      ...obj,
      account: accounts[obj.accountId],
      categories: obj.categoryIds.map((_id) => categories[_id]),
    }));
  });

  return (
    <div>
      <PageHeader
        title="Installments"
        // tags={<Tag color="blue">Running</Tag>}
        subTitle="every installment you need to control here"
        extra={[
          <Button type="primary">
            <Link to="/new-installment">+ Add</Link>
          </Button>,
        ]}
      >
        <Row>
          <Statistic title="Subtotal" />
        </Row>
      </PageHeader>

      <Table
        columns={ColumnsInstallments(installments)}
        dataSource={installments}
      />
    </div>
  );
};
