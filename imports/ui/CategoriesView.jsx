import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { useTracker } from 'meteor/react-meteor-data';
import { Categories } from '../api/categories';
import { SpinnerLoading } from '../components/spinnerLoading/SpinnerLoading';
import { DashboardTable } from '../components/DashboardTable';
import { ColumnsCategories } from '../components/columns/ColumnsCategories';

const tabsNames = ['Account', 'Credit Card'];

export const CategoriesView = () => {
  const { categories, isLoading } = useTracker(() => {
    const handler = Meteor.subscribe('categories.findAll');
    return {
      isLoading: !handler.ready(),
      categories: Categories.find().fetch(),
    };
  });

  return (
    <>
      {isLoading ? (
        <SpinnerLoading tip="Loading..." />
      ) : (
        <div>
          <DashboardTable
            title="Categories"
            subtitle="every categories you registered appears here"
            columns={ColumnsCategories(categories)}
            datasource={categories}
            newEntryKey=""
            newEntryFormat="new-categorie"
            enableRowSelection={false}
            enableBalance={false}
            tabsNames={tabsNames}
            enableTabs={false}
          />
        </div>
      )}
    </>
  );
};
