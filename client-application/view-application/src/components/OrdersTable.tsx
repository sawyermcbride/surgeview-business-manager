import React, { useState } from "react";
import { OrdersObject } from "../types/apiResponses";
import { Table, Typography, Pagination } from "antd";

const {Title} = Typography;

interface OrdersTableProps {
  orders: OrdersObject[];
  viewOrderDetails: (id: number) => void
}

const OrdersTable: React.FC<OrdersTableProps> = function({orders, viewOrderDetails}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 4;

  const startIndex = (currentPage - 1) * pageSize;
  const currentOrders = orders.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      className: 'row-nowrap'
    },
    {
      title: 'YouTube URL',
      dataIndex: 'youtubeUrl',
      key: 'youtubeUrl',
      className: 'row-nowrap'
    },
    {
      title: 'Channel Name',
      dataIndex: 'channelName',
      key: 'channelName',
      className: 'row-nowrap'
    },
    {
      title: 'Customer Email',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
      className: 'row-nowrap'

    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'row-nowrap',
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
        scroll={{ x: 800, y: 240 }} // Set width and height for scrollin
        rowKey="id" // Use the id as a unique key for each row
        pagination={false} // Optional: Disable pagination for a better view
        style={{ marginTop: '16px' }}
        onRow={(record) => ({
          onClick: () => viewOrderDetails(record.id)
        })}
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