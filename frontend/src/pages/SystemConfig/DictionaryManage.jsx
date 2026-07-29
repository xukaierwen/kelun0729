import React from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

// 模拟字典数据
const mockDictionaries = [
  {
    id: 1,
    category: '业务类型',
    code: 'business_type',
    items: ['CNS', '招商', '费用制', '代理', '城连锁', '数字营销'],
    status: 'active',
  },
  {
    id: 2,
    category: '省份',
    code: 'province',
    items: ['安徽', '湖南', '广西', '广东', '江苏', '浙江'],
    status: 'active',
  },
  {
    id: 3,
    category: '集采属性',
    code: 'collection_attribute',
    items: ['集采', '非集采'],
    status: 'active',
  },
];

function DictionaryManage() {
  const columns = [
    {
      title: '字典分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag color="purple">{code}</Tag>,
    },
    {
      title: '字典项',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Space wrap>
          {items.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="字典管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新增字典
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={mockDictionaries}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
}

export default DictionaryManage;
