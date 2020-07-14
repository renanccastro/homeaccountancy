import { Button, PageHeader, Row, Statistic, Table } from 'antd';
import { Link } from '@reach/router';
import Tabs from 'antd/es/tabs';
import { useTracker } from 'meteor/react-meteor-data';
import AppleOutlined from '@ant-design/icons/lib/icons/AppleOutlined';
import AndroidOutlined from '@ant-design/icons/lib/icons/AndroidOutlined';
import React, { useState } from 'react';
import Dinero from 'dinero.js';

const { TabPane } = Tabs;
export const DashboardTable = ({
  title,
  subtitle,
  newEntryKey,
  columns,
  datasource,
  onClickPayed,
  enableRowSelection,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [payed, setPayed] = useState(false);
  const dataFiltered = useTracker(() => {
    return datasource.filter((currentValue) =>
      payed ? currentValue.payed : !currentValue.payed
    );
  }, [payed]);

  const rowSelection = enableRowSelection
    ? {
        onChange: (rowKey, selectedRowKeys) => {
          setSelectedRows(selectedRowKeys);
        },
      }
    : undefined;

  const hasSelected = selectedRows.length > 0;

  const balance = useTracker(() => {
    let dineroBalance = new Dinero({ amount: 0 });
    dataFiltered.forEach(({ value }) => {
      dineroBalance = dineroBalance.add(new Dinero({ amount: value }));
    });
    return dineroBalance.toFormat();
  }, [dataFiltered]);

  const onClick = () => {
    onClickPayed(selectedRows.map((row) => row._id));
    setSelectedRows([]);
  };

  return (
    <div>
      <PageHeader
        title={title}
        subTitle={subtitle}
        extra={[
          <Button key="3" type="primary">
            <Link to={`/new-accounting-entry/${newEntryKey}`}>+ Add</Link>
          </Button>,
        ]}
      >
        <Row>
          <Statistic title="Subtotal" value={balance} />
        </Row>
      </PageHeader>

      {onClickPayed && rowSelection ? (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={onClick}
            disabled={!hasSelected || payed}
          >
            Set Payed
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRows.length} items` : ''}
          </span>
        </div>
      ) : null}

      <Tabs
        defaultActiveKey="1"
        onChange={(tabKey) => {
          setPayed(tabKey === '2');
          setSelectedRows([]);
        }}
      >
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Pending
            </span>
          }
          key="1"
        >
          <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataFiltered}
            rowKey="_id"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AndroidOutlined />
              Payed
            </span>
          }
          key="2"
        >
          <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataFiltered}
            rowKey="_id"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

DashboardTable.defaultProps = {
  enableRowSelection: true,
};
