import { useState, useEffect, useMemo } from 'react'
import {
  Table, Button, Space, Modal, Form, Input, Select, Popconfirm,
  message, Tag, DatePicker, Checkbox, Dropdown,
} from 'antd'
import {
  PlusOutlined, EditOutlined, StopOutlined, SearchOutlined,
  ReloadOutlined, CopyOutlined, DownOutlined, ThunderboltOutlined,
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
  const [searchText, setSearchText] = useState('')
  const [exactMatch, setExactMatch] = useState(false)
  const [filterField, setFilterField] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    setData(dataSource)
  }, [dataSource])

  // 搜索过滤
  const filteredData = useMemo(() => {
    if (!searchText) return data
    if (exactMatch && filterField) {
      return data.filter(record =>
        String(record[filterField] || '').includes(searchText)
      )
    }
    return data.filter(record =>
      Object.values(record).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    )
  }, [data, searchText, exactMatch, filterField])

  // 可搜索的字段列表
  const searchableFields = useMemo(() =>
    columns
      .filter(c => c.dataIndex && c.dataIndex !== 'seq' && c.dataIndex !== 'is_valid')
      .map(c => ({ label: c.title, value: c.dataIndex })),
    [columns]
  )

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
      {/* 工具栏 */}
      <div className="table-toolbar">
        {/* 左侧：查询条件区 */}
        <div className="toolbar-filter">
          <Select
            placeholder="选择查询字段"
            value={filterField || undefined}
            onChange={(val) => setFilterField(val || '')}
            allowClear
            style={{ width: 140 }}
            options={searchableFields}
            className="filter-select"
          />
          <Input
            placeholder="搜索关键字"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 220 }}
            onPressEnter={() => {}}
            className="filter-input"
          />
          <div
            className={`exact-match-tag ${exactMatch ? 'active' : ''}`}
            onClick={() => setExactMatch(!exactMatch)}
          >
            <Checkbox checked={exactMatch} style={{ marginRight: 4 }} />
            <span>精确匹配</span>
          </div>
          <Button type="primary" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button
            type="primary"
            ghost
            icon={<ThunderboltOutlined />}
            title="快速搜索"
          />
        </div>

        {/* 右侧：功能按钮区 */}
        <div className="toolbar-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建
          </Button>
          <Button icon={<CopyOutlined />} onClick={() => message.info('复制功能开发中')}>
            复制
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
            刷新
          </Button>
          <Dropdown menu={{ items: moreMenuItems, onClick: handleMoreClick }} trigger={['click']}>
            <Button>
              更多 <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

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
        }}
        scroll={{ x: 800 }}
        size="middle"
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
