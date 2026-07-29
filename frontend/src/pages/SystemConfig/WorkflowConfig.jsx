import React from 'react';
import { Card, Table, Button, Tag, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// 模拟审批流程数据
const mockWorkflows = [
  {
    id: 1,
    name: 'CNS业务审批流程',
    type: 'CNS',
    levels: ['片区填报', '大区审核', '总部终审'],
    status: 'active',
  },
  {
    id: 2,
    name: '招商业务审批流程',
    type: '招商',
    levels: ['片区填报', '大区审核', '总部终审'],
    status: 'active',
  },
  {
    id: 3,
    name: '费用制业务审批流程',
    type: '费用制',
    levels: ['片区填报', '大区审核', '总部终审'],
    status: 'active',
  },
];

function WorkflowConfig() {
  const columns = [
    {
      title: '流程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '业务类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '审批层级',
      dataIndex: 'levels',
      key: 'levels',
      render: (levels) => (
        <Space>
          {levels.map((level, index) => (
            <Tag key={index} color={index === levels.length - 1 ? 'green' : 'default'}>
              {level}
            </Tag>
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
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="审批流程配置"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          新增流程
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={mockWorkflows}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
}

export default WorkflowConfig;
