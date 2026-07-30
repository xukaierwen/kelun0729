import { useState } from 'react'
import { Table, Button, Select, Form, message, Tag } from 'antd'
import { SearchOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import '../budget/ActualDataTable.css'

// 维度字段
const DIMENSION_FIELDS = [
  { key: 'manage_type', title: '总部管理类型', width: 120 },
  { key: 'manage_team', title: '总部管理团队', width: 120 },
  { key: 'business_model', title: '业务模式', width: 120 },
  { key: 'sales_mode', title: '销售模式', width: 120 },
  { key: 'budget_entity', title: '预算编制实体', width: 120 },
  { key: 'version', title: '版本', width: 100 },
  { key: 'status', title: '状态', width: 80 },
]

export default function OverviewTable() {
  const [searchForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 生成表格列配置
  const columns = DIMENSION_FIELDS.map(field => ({
    title: field.title,
    dataIndex: field.key,
    key: field.key,
    width: field.width,
    ellipsis: true,
    render: field.key === 'status' ? (text) => {
      const colorMap = {
        '草稿': 'default',
        '已提交': 'blue',
        '已审批': 'green',
        '已驳回': 'red',
      }
      return <Tag color={colorMap[text] || 'default'}>{text}</Tag>
    } : undefined,
  }))

  // 查询
  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('查询完成')
    }, 500)
  }

  // 创建版本
  const handleCreateVersion = () => {
    message.success('创建版本功能开发中')
  }

  // 审批
  const handleApprove = () => {
    message.success('审批功能开发中')
  }

  // 驳回
  const handleReject = () => {
    message.success('驳回功能开发中')
  }

  // 查询条件字段
  const queryFields = [
    { key: 'year', label: '年份' },
    { key: 'manage_type', label: '总部管理类型' },
    { key: 'manage_team', label: '总部管理团队' },
    { key: 'business_model', label: '业务模式' },
    { key: 'sales_mode', label: '销售模式' },
    { key: 'budget_entity', label: '预算编制实体' },
  ]

  return (
    <div className="actual-data-table">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form form={searchForm} layout="inline" className="search-fields">
          {queryFields.map(field => (
            <Form.Item key={field.key} label={field.label} name={field.key} className="search-field-item">
              <Select placeholder="请选择" allowClear showSearch size="small">
                <Select.Option value="test">测试数据</Select.Option>
              </Select>
            </Form.Item>
          ))}
        </Form>
        <div className="search-buttons">
          <Button size="small" icon={<PlusOutlined />} onClick={handleCreateVersion}>
            创建版本
          </Button>
          <Button size="small" icon={<CheckOutlined />} onClick={handleApprove}>
            审批
          </Button>
          <Button size="small" icon={<CloseOutlined />} onClick={handleReject}>
            驳回
          </Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={[]}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            size: 'small',
          }}
          scroll={{ x: 1000 }}
          size="small"
          bordered
          locale={{
            emptyText: '暂无数据',
          }}
        />
      </div>
    </div>
  )
}
