import { Button, PageHeader, Row, Statistic, Table } from 'antd';
import { Link } from '@reach/router';
import Tabs from 'antd/es/tabs';
import { useTracker } from 'meteor/react-meteor-data';
import AppleOutlined from '@ant-design/icons/lib/icons/AppleOutlined';
import AndroidOutlined from '@ant-design/icons/lib/icons/AndroidOutlined';
import React, { useState } from 'react';
import Dinero from 'dinero.js';
import PropTypes from 'prop-types';

const { TabPane } = Tabs;
export const DashboardTable = ({
  title,
  subtitle,
  newEntryKey,
  newEntryFormat,
  columns,
  datasource,
  secondTabColumns,
  filterOptionString,
  onClickPayed,
  enableRowSelection,
  enableBalance,
  tabsNames,
  enableTabs,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterOptionActive, setFilterOptionActive] = useState(false);

  const dataFiltered = useTracker(() => {
    return datasource.filter((currentValue) =>
      filterOptionActive
        ? currentValue[filterOptionString]
        : !currentValue[filterOptionString]
    );
  }, [filterOptionActive]);

  const [nameFirstTab, nameSecondTab] = tabsNames;

  const rowSelection = enableRowSelection
    ? {
        onChange: (rowKey, selectedRowKeys) => {
          setSelectedRows(selectedRowKeys);
        },
      }
    : undefined;

  const hasSelected = selectedRows.length > 0;

  const balance = useTracker(() => {
    if (!enableBalance) {
      return null;
    }
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
            <Link to={`/${newEntryFormat}/${newEntryKey}`}>+ Add</Link>
          </Button>,
        ]}
      >
        {enableBalance ? (
          <Row>
            <Statistic title="Subtotal" value={balance} />
          </Row>
        ) : null}
      </PageHeader>

      {onClickPayed && rowSelection ? (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={onClick}
            disabled={!hasSelected || filterOptionActive}
          >
            Set Payed
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRows.length} items` : ''}
          </span>
        </div>
      ) : null}

      {enableTabs ? (
        <Tabs
          defaultActiveKey="1"
          onChange={(tabKey) => {
            setFilterOptionActive(tabKey === '2');
            setSelectedRows([]);
          }}
        >
          <TabPane
            tab={
              <span>
                <AppleOutlined />
                {nameFirstTab}
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
                {nameSecondTab}
              </span>
            }
            key="2"
          >
            <Table
              columns={!secondTabColumns ? columns : secondTabColumns}
              rowSelection={rowSelection}
              dataSource={dataFiltered}
              rowKey="_id"
            />
          </TabPane>
        </Tabs>
      ) : (
        <Table
          columns={columns}
          rowSelection={rowSelection}
          dataSource={dataFiltered}
          rowKey="_id"
        />
      )}
    </div>
  );
};

DashboardTable.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  newEntryKey: PropTypes.string.isRequired,
  newEntryFormat: PropTypes.string.isRequired,
  columns: PropTypes.object.isRequired,
  secondTabColumns: PropTypes.object,
  datasource: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterOptionString: PropTypes.string,
  onClickPayed: PropTypes.func,
  enableRowSelection: PropTypes.bool,
  enableBalance: PropTypes.bool,
  tabsNames: PropTypes.arrayOf(PropTypes.string),
  enableTabs: PropTypes.bool,
};

DashboardTable.defaultProps = {
  enableRowSelection: true,
  enableBalance: true,
  tabsNames: ['Pending', 'Payed'],
  onClickPayed: undefined,
  secondTabColumns: undefined,
  filterOptionString: undefined,
  enableTabs: true,
};
