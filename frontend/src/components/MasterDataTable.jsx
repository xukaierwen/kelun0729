import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Table, Button, Space, Modal, Form, Input, Select, Popconfirm,
  Card, message, Tag, DatePicker,
} from 'antd'
import {
  PlusOutlined, EditOutlined, StopOutlined, SearchOutlined,
  ReloadOutlined, ExportOutlined, ImportOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

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
  const [searchText, setSearchText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    setData(dataSource)
  }, [dataSource])

  // 搜索过滤
  const filteredData = useMemo(() => {
    if (!searchText) return data
    return data.filter(record =>
      Object.values(record).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    )
  }, [data, searchText])

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
    
    // 处理日期字段，将 dayjs 对象转换为字符串
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
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
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
              icon={<StopOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={`${tableName}管理`}
      extra={
        <Space>
          {allowSearch && (
            <Input.Search
              placeholder="搜索..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
          )}
          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
            刷新
          </Button>
          {allowImportExport && (
            <>
              <Button icon={<ImportOutlined />}>导入</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
            </>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增
          </Button>
        </Space>
      }
    >
      <Table
        columns={tableColumns}
        dataSource={filteredData}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条`,
          showSizeChanger: true,
        }}
        scroll={{ x: 800 }}
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

            // 处理日期字段的初始值
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
    </Card>
  )
}
