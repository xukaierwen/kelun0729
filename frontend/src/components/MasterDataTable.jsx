import { useState, useEffect, useMemo } from 'react'
import {
  Table, Button, Space, Modal, Form, Input, Select, Popconfirm,
  message, Tag, DatePicker, Switch,
} from 'antd'
import {
  PlusOutlined, DownOutlined, UpOutlined, SearchOutlined,
  ImportOutlined, ExportOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import ParentSelectorDialog from './ParentSelectorDialog'
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
  allowAdd = true,
  allowEdit = true,
  rowKey = 'id',
  searchFields = null,
  readonly = false,
  formHideFields = [],
  selectAllFields = false,
}) {
  const [data, setData] = useState(dataSource)
  const [searchValues, setSearchValues] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [parentDialogOpen, setParentDialogOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setData(dataSource)
  }, [dataSource])

  // 编辑时回填表单数据
  useEffect(() => {
    if (modalOpen && editingRecord) {
      const values = { ...editingRecord }
      // 转换日期字段为 dayjs 对象
      columns.forEach(col => {
        if (col.inputType === 'date' && values[col.dataIndex || col.key]) {
          values[col.dataIndex || col.key] = dayjs(values[col.dataIndex || col.key])
        }
      })
      form.setFieldsValue(values)
    }
  }, [modalOpen, editingRecord])

  // 可查询的字段（如果指定了 searchFields 则只保留这些字段，否则排除序号和日期字段）
  const queryFields = useMemo(() => {
    if (searchFields && Array.isArray(searchFields)) {
      return columns.filter(c => searchFields.includes(c.dataIndex || c.key))
    }
    return columns.filter(c => c.dataIndex && c.dataIndex !== 'seq' && c.inputType !== 'date')
  }, [columns, searchFields])

  // 是否有效筛选字段
  const isValidField = {
    dataIndex: 'is_valid',
    title: '是否有效',
    inputType: 'select',
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ],
  }

  // 第一行显示的字段（最多6个）
  const firstRowFields = useMemo(() => queryFields.slice(0, 6), [queryFields])
  // 第二行及以后隐藏的字段（第7个及以后 + 是否有效）
  const hiddenFields = useMemo(() => {
    const rest = queryFields.slice(6)
    // 检查是否有效字段是否已存在于任何位置
    const hasIsValidAnywhere = queryFields.some(f => f.dataIndex === 'is_valid')
    // 如果不存在，则添加到隐藏字段
    if (!hasIsValidAnywhere) {
      return [...rest, isValidField]
    }
    return rest
  }, [queryFields, firstRowFields])

  // 是否有隐藏字段
  const hasHiddenFields = hiddenFields.length > 0

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
    // 新增默认值：是否有效=启用，生效时间=当天，失效时间=2099-12-31
    const defaults = {}
    columns.forEach(col => {
      const fieldName = col.dataIndex || col.key
      if (fieldName === 'is_valid') defaults[fieldName] = 1
      if (fieldName === 'valid_from') defaults[fieldName] = dayjs()
      if (fieldName === 'valid_to') defaults[fieldName] = dayjs('2099-12-31')
    })
    form.setFieldsValue(defaults)
    setModalOpen(true)
  }

  // 打开编辑模态框
  const handleEdit = (record) => {
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
    ...columns.map(col => {
      const isSeq = col.dataIndex === 'seq' || col.key === 'seq'
      return {
        ...col,
        dataIndex: col.dataIndex || col.key,
        key: col.key || col.dataIndex,
        width: isSeq ? 60 : col.width,
        align: isSeq ? 'center' : col.align,
        render: isSeq
          ? (_, __, index) => (currentPage - 1) * pageSize + index + 1
          : col.dataIndex === 'is_valid' ? (val) => (
              <Tag color={val === 1 || val === '是' ? 'green' : 'red'}>
                {val === 1 ? '是' : val === 0 ? '否' : val}
              </Tag>
            ) : col.inputType === 'date' ? (val) => (
              val ? (dayjs.isDayjs(val) ? val.format('YYYY-MM-DD') : val) : '-'
            ) : undefined,
      }
    }),
    // 只读模式下不显示操作列
    !readonly && {
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
  ].filter(Boolean)

  return (
    <div className="master-data-table">
      {/* 查询条件区 */}
      {allowSearch && (
        <div className="search-form">
          <Form form={searchForm} layout="inline" className="search-fields">
            {/* 第一行字段 */}
            {firstRowFields.map(field => {
              const fieldName = field.dataIndex || field.key
              return (
                <Form.Item key={fieldName} label={field.title} name={fieldName} className="search-field-item">
                  {field.inputType === 'select' || field.inputType === 'switch' ? (
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

            {/* 隐藏字段（展开时显示） */}
            {searchExpanded && hiddenFields.map(field => {
              const fieldName = field.dataIndex || field.key
              return (
                <Form.Item key={fieldName} label={field.title} name={fieldName} className="search-field-item">
                  {field.inputType === 'select' || field.inputType === 'switch' ? (
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

          {/* 按钮区 */}
          <div className="search-buttons">
            {hasHiddenFields && (
              <Button
                size="small"
                type="link"
                onClick={() => setSearchExpanded(!searchExpanded)}
              >
                {searchExpanded ? '收起' : '更多'}
                {searchExpanded ? <UpOutlined /> : <DownOutlined />}
              </Button>
            )}
            {!readonly && (
              <Button size="small" icon={<ImportOutlined />} onClick={() => message.info('导入功能开发中...')}>
                导入
              </Button>
            )}
            <Button size="small" icon={<ExportOutlined />} onClick={() => message.info('导出功能开发中...')}>
              导出
            </Button>
            {!readonly && (
              <Button size="small" onClick={handleAdd} icon={<PlusOutlined />}>
                新增
              </Button>
            )}
            <Button size="small" onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
          </div>
        </div>
      )}

      {/* 数据表格 */}
      <Table
        columns={tableColumns}
        dataSource={filteredData}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          pageSize,
          current: currentPage,
          onChange: (page, size) => {
            setCurrentPage(page)
            if (size) setPageSize(size)
          },
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
          {columns.filter(col => {
            const fieldName = col.dataIndex || col.key
            return fieldName !== 'seq' && !formHideFields.includes(fieldName)
          }).map(col => {
            const fieldName = col.dataIndex || col.key
            const isReadonly = editingRecord && col.readonlyOnEdit

            // 判断是否为父级名称字段（科目维度专用）
            const isParentNameField = fieldName === 'parent_name'

            return (
              <Form.Item
                key={fieldName}
                name={fieldName}
                label={col.title}
                rules={col.rules || (fieldName === 'valid_to' ? [] : [{ required: true, message: `请输入${col.title}` }])}
                valuePropName={col.inputType === 'switch' ? 'checked' : undefined}
                getValueFromEvent={col.inputType === 'switch' ? (checked) => (checked ? 1 : 0) : undefined}
                getValueProps={col.inputType === 'switch' ? (value) => ({ checked: value === 1 || value === true }) : undefined}
              >
                {col.inputType === 'select' ? (
                  <Select
                    placeholder={`请选择${col.title}`}
                    options={col.options}
                    allowClear
                    disabled={isReadonly}
                    showSearch
                    filterOption={(input, option) =>
                      String(option.label).toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(val, option) => {
                      // 联动带出关联字段（如选中产品编码自动带出产品名称）
                      if (col.linkFields && option) {
                        const patch = {}
                        col.linkFields.forEach(f => {
                          if (option[f] !== undefined) patch[f] = option[f]
                        })
                        if (Object.keys(patch).length > 0) form.setFieldsValue(patch)
                      }
                    }}
                  />
                ) : col.inputType === 'switch' ? (
                  // 是否有效等开关字段：HZERO 风格 switch 开关
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    disabled={isReadonly}
                  />
                ) : col.inputType === 'date' ? (
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    placeholder={`请选择${col.title}`}
                    disabled={isReadonly}
                  />
                ) : col.inputType === 'textarea' ? (
                  <Input.TextArea rows={3} disabled={isReadonly} />
                ) : isParentNameField ? (
                  <Input
                    placeholder={`请输入${col.title}`}
                    disabled={isReadonly}
                    addonAfter={
                      !isReadonly ? (
                        <SearchOutlined
                          style={{ cursor: 'pointer' }}
                          onClick={() => setParentDialogOpen(true)}
                        />
                      ) : undefined
                    }
                  />
                ) : selectAllFields ? (
                  // 映射表统一下拉样式：暂无 options 也显示下拉箭头
                  <Select
                    placeholder={`请选择${col.title}`}
                    options={col.options || []}
                    allowClear
                    disabled={isReadonly}
                    showSearch
                    filterOption={(input, option) =>
                      !option || String(option.label || '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(val, option) => {
                      // 联动带出关联字段（如选中产品编码自动带出产品名称）
                      if (col.linkFields && option) {
                        const patch = {}
                        col.linkFields.forEach(f => {
                          if (option[f] !== undefined) patch[f] = option[f]
                        })
                        if (Object.keys(patch).length > 0) form.setFieldsValue(patch)
                      }
                    }}
                  />
                ) : (
                  <Input placeholder={`请输入${col.title}`} disabled={isReadonly} />
                )}
              </Form.Item>
            )
          })}
        </Form>
      </Modal>

      {/* 父级选择弹窗 */}
      <ParentSelectorDialog
        open={parentDialogOpen}
        onClose={() => setParentDialogOpen(false)}
        onSelect={({ parentCode, parentName }) => {
          form.setFieldsValue({
            parent_code: parentCode,
            parent_name: parentName,
          })
        }}
      />
    </div>
  )
}
