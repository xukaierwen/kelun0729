import { useState, useEffect, useMemo } from 'react'
import {
  Table, Button, Space, Modal, Form, Input, Select, Popconfirm,
  message, Tag, DatePicker, Dropdown, Row, Col,
} from 'antd'
import {
  PlusOutlined, DownOutlined, SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import './MasterDataTable.css'

export default function MasterDataTable({
  tableName,
  columns = [],
  dataSource = [],
  onAdd = () => {},
  onEdit = () => {},
  onDisable = () => {},
  onRefresh = () => {},
  loading = false,
  allowSearch = true,
  allowImportExport = false,
  rowKey = 'id',
}) {
  const [data, setData] = useState(dataSource)
  const [searchValues, setSearchValues] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  useEffect(() => {
    setData(dataSource)
  }, [dataSource])

  // 可查询的字段（排除序号和日期字段，取前6个）
  const queryFields = useMemo(() =>
    columns
      .filter(c => c.dataIndex && c.dataIndex !== 'seq' && c.inputType !== 'date')
      .slice(0, 6),
    [columns]
  )

  // 搜索过滤
  const filteredData = useMemo(() => {
    const values = Object.entries(searchValues).filter(([, v]) => v !== undefined && v !== '')
    if (values.length === 0) return data
    return data.filter(record =>
      values.every(([key, val]) =>
        String(record[key] || '').toLowerCase().includes(String(val).toLowerCase())
      )
    )
  }, [data, searchValues])

  // 查询
  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setSearchValues(values)
  }

  // 重置
  const handleReset = () => {
    searchForm.resetFields()
    setSearchValues({})
  }

  // 打开新增模态框
  const handleAdd = () => {
    form.resetFields()
    setEditingRecord(null)
    setModalOpen(true)
  }

  // 打开编辑模态框
  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setEditingRecord(record)
    setModalOpen(true)
  }

  // 提交表单
  const handleSave = async () => {
    const values = await form.validateFields()

    const processedValues = { ...values }
    columns.forEach(col => {
      if (col.inputType === 'date' && processedValues[col.dataIndex || col.key]) {
        const dateVal = processedValues[col.dataIndex || col.key]
        if (dayjs.isDayjs(dateVal)) {
          processedValues[col.dataIndex || col.key] = dateVal.format('YYYY-MM-DD')
        }
      }
    })

    const record = {
      ...processedValues,
      id: editingRecord?.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      updatedAt: new Date().toLocaleString(),
    }

    if (editingRecord) {
      onEdit?.(record)
    } else {
      onAdd?.(record)
    }

    setModalOpen(false)
    form.resetFields()
  }

  // 失效行
  const handleDisable = (record) => {
    onDisable?.(record)
  }

  // 表格列配置
  const tableColumns = [
    ...columns.map(col => ({
      ...col,
      dataIndex: col.dataIndex || col.key,
      key: col.key || col.dataIndex,
      render: col.dataIndex === 'is_valid' ? (val) => (
        <Tag color={val === 1 || val === '是' ? 'green' : 'red'}>
          {val === 1 ? '是' : val === 0 ? '否' : val}
        </Tag>
      ) : col.inputType === 'date' ? (val) => (
        val ? (dayjs.isDayjs(val) ? val.format('YYYY-MM-DD') : val) : '-'
      ) : undefined,
    })),
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认失效？"
            description="将此记录状态改为禁用"
            onConfirm={() => handleDisable(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
            >
              失效
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 更多操作菜单
  const moreMenuItems = [
    { key: 'refresh', label: '刷新', icon: <ReloadOutlined /> },
    ...(allowImportExport ? [
      { key: 'import', label: '导入' },
      { key: 'export', label: '导出' },
    ] : []),
  ]

  const handleMoreClick = ({ key }) => {
    if (key === 'refresh') onRefresh()
  }

  return (
    <div className="master-data-table">
      {/* 查询条件区 */}
      {allowSearch && (
        <div className="search-form">
          <Row gutter={16} align="middle" wrap={false}>
            {/* 左侧：查询字段 */}
            <Col flex="1">
              <Form form={searchForm} layout="inline" className="search-fields">
                {queryFields.map(field => {
                  const fieldName = field.dataIndex || field.key
                  return (
                    <Form.Item key={fieldName} label={field.title} name={fieldName} className="search-field-item">
                      {field.inputType === 'select' ? (
                        <Select
                          placeholder={`请选择${field.title}`}
                          options={field.options}
                          allowClear
                          style={{ width: '100%' }}
                          size="small"
                        />
                      ) : field.inputType === 'date' ? (
                        <DatePicker
                          placeholder={`请选择${field.title}`}
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          size="small"
                        />
                      ) : (
                        <Input
                          placeholder={`请输入${field.title}`}
                          allowClear
                          size="small"
                        />
                      )}
                    </Form.Item>
                  )
                })}
              </Form>
            </Col>

            {/* 右侧：按钮区 */}
            <Col flex="none" className="search-buttons">
              <Dropdown menu={{ items: moreMenuItems, onClick: handleMoreClick }} trigger={['click']}>
                <Button size="small">
                  更多 <DownOutlined />
                </Button>
              </Dropdown>
              <Button size="small" onClick={handleAdd} icon={<PlusOutlined />}>
                新增
              </Button>
              <Button size="small" onClick={handleReset}>
                重置
              </Button>
              <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {/* 数据表格 */}
      <Table
        columns={tableColumns}
        dataSource={filteredData}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
          size: 'small',
        }}
        scroll={{ x: 800 }}
        size="small"
      />

      {/* 编辑模态框 */}
      <Modal
        title={editingRecord ? '编辑' : '新增'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          {columns.map(col => {
            const fieldName = col.dataIndex || col.key

            let initialValue = undefined
            if (col.inputType === 'date' && editingRecord?.[fieldName]) {
              initialValue = dayjs(editingRecord[fieldName])
            }

            return (
              <Form.Item
                key={fieldName}
                name={fieldName}
                label={col.title}
                rules={col.rules || [{ required: true, message: `请输入${col.title}` }]}
                initialValue={initialValue}
              >
                {col.inputType === 'select' ? (
                  <Select
                    placeholder={`请选择${col.title}`}
                    options={col.options}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      String(option.label).toLowerCase().includes(input.toLowerCase())
                    }
                  />
                ) : col.inputType === 'date' ? (
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder={`请选择${col.title}`}
                  />
                ) : col.inputType === 'textarea' ? (
                  <Input.TextArea rows={3} />
                ) : (
                  <Input placeholder={`请输入${col.title}`} />
                )}
              </Form.Item>
            )
          })}
        </Form>
      </Modal>
    </div>
  )
}
