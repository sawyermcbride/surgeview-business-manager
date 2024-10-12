import React, { useState } from "react";
import { OrdersObject } from "../types/apiResponses";
import { Table, Typography, Pagination } from "antd";

const {Title} = Typography;

interface OrdersTableProps {
  orders: OrdersObject[]
}

const OrdersTable: React.FC<OrdersTableProps> = function({orders}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 4;

  const startIndex = (currentPage - 1) * pageSize;
  const currentOrders = orders.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'YouTube URL',
      dataIndex: 'youtubeUrl',
      key: 'youtubeUrl',
    },
    {
      title: 'Channel Name',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: 'Customer Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => {
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

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Title level={3} style={{ marginTop: 0}}>Customer Orders</Title>
      <Table
        dataSource={currentOrders}
        columns={columns}
        rowKey="id" // Use the id as a unique key for each row
        pagination={false} // Optional: Disable pagination for a better view
        style={{ marginTop: '16px' }}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={orders.length}
        onChange={onChangePage}
        style={{ marginTop: '16px', textAlign: 'right' }} // Align pagination to the right
      />
    </>
  )
}

export default OrdersTable;