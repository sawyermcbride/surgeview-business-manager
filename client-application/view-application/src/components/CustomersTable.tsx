import React from "react";
import { CustomerObject } from "../types/apiResponses";
import { Table } from "antd";

interface CustomersTableProps {
  customers: CustomerObject[]
  viewCustomerDetails: (id: number) => void
}

const CustomersTable: React.FC<CustomersTableProps> = function({customers, viewCustomerDetails}) {

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
      render:  (text: string) => {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }).format(new Date(text));

        return formattedDate;
      },
    },
  ];

  return (
    <Table
      dataSource={customers}
      columns={columns}
      rowKey="id"
      onRow={(record) => ({
        onClick: () => viewCustomerDetails(record.id)
      })}
    />
  );

}

export default CustomersTable;