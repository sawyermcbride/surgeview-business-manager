import React from 'react';
import { Table } from 'antd';

const data = [
  {
    key: '1',
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: '2024-10-09 08:58:22',
  },
  {
    key: '2',
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: '2024-10-10 10:30:45',
  },
  // Add more data as needed
];

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
];

const NewOrdersTable = () => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false} // Disable pagination for a continuous view
      className="excel-table"
      rowClassName="excel-row" // Add class for row styling
      // headerClassName="excel-header" // Add class for header styling
    />
  );
};

export default NewOrdersTable;
