import { useState, useEffect } from 'react'
import { Card, Button, Space, Table, Select, InputNumber, message, Modal, Tag, Row, Col, Statistic } from 'antd'
import {
  PlusOutlined, DeleteOutlined, SaveOutlined, DownloadOutlined,
} from '@ant-design/icons'
import api from '../../api'

const MONTH_KEYS = Array.from({ length: 12 }, (_, i) => `month_${String(i + 1).padStart(2, '0')}`)
const MONTH_LABELS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

// 预算实体选项
const BUDGET_ENTITIES = [
  { label: '总部', value: '总部' },
  { label: '华东片区', value: '华东片区' },
  { label: '华南片区', value: '华南片区' },
  { label: '华北片区', value: '华北片区' },
]

let rowId = 1
function createRow(year, entity) {
  return {
    _rowId: rowId++,
    year,
    entity,
    managementType: null,
    managementTeam: null,
    businessMode: null,
    salesMode: null,
    product: null,
    salesperson: null,
    metrics: Object.fromEntries(MONTH_KEYS.map(k => [k, ''])),
  }
}

export default function SalesBudgetV2() {
  const [messageApi, contextHolder] = message.useMessage()
  const [year, setYear] = useState(new Date().getFullYear())
  const [entity, setEntity] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // 加载数据
  const loadData = async () => {
    if (!entity) return
    setLoading(true)
    try {
      const res = await api.get('/budget/sales', { params: { year, entity } })
      const data = res.data || []
      if (data.length > 0) {
        setRows(data.map(item => ({
          ...item,
          _rowId: rowId++,
          metrics: item.metrics || Object.fromEntries(MONTH_KEYS.map(k => [k, ''])),
        })))
      } else {
        setRows([createRow(year, entity)])
      }
    } catch (err) {
      // 如果API失败，使用空行
      setRows([createRow(year, entity)])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (entity) {
      loadData()
    }
  }, [year, entity])

  // 更新行
  const updateRow = (rowId, field, value) => {
    setRows(prev => prev.map(r => {
      if (r._rowId !== rowId) return r
      return { ...r, [field]: value }
    }))
  }

  // 更新月度数据
  const updateMetric = (rowId, monthKey, value) => {
    setRows(prev => prev.map(r => {
      if (r._rowId !== rowId) return r
      return { ...r, metrics: { ...r.metrics, [monthKey]: value } }
    }))
  }

  // 新增行
  const addRow = () => {
    setRows(prev => [...prev, createRow(year, entity)])
  }

  // 删除行
  const deleteRow = (id) => {
    setRows(prev => prev.filter(r => r._rowId !== id))
  }

  // 保存
  const handleSave = async () => {
    try {
      const data = rows.map(r => ({
        year,
        entity,
        managementType: r.managementType,
        managementTeam: r.managementTeam,
        businessMode: r.businessMode,
        salesMode: r.salesMode,
        product: r.product,
        salesperson: r.salesperson,
        metrics: r.metrics,
      }))
      await api.post('/budget/sales', { data })
      messageApi.success('保存成功')
    } catch (err) {
      messageApi.error(`保存失败: ${err.message}`)
    }
  }

  // 导出
  const handleExport = () => {
    if (rows.length === 0) {
      messageApi.warning('暂无数据可导出')
      return
    }

    const headers = [
      '管理类型', '管理团队', '业务模式', '销售模式', '产品', '业务员',
      ...MONTH_LABELS, '全年合计', '月均',
    ]

    const csvRows = rows.map(record => {
      const months = MONTH_KEYS.map(k => parseFloat(record.metrics[k]) || 0)
      const total = months.reduce((s, v) => s + v, 0)
      const avg = months.length > 0 ? total / months.length : 0

      return [
        record.managementType || '',
        record.managementTeam || '',
        record.businessMode || '',
        record.salesMode || '',
        record.product || '',
        record.salesperson || '',
        ...months,
        total,
        avg.toFixed(2),
      ]
    })

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...csvRows.map(r => r.map(v => `"${v}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `销售预算_${entity}_${year}.csv`
    link.click()
    messageApi.success('导出成功')
  }

  // 统计
  const stats = {
    totalRows: rows.length,
    totalAmount: rows.reduce((s, r) => {
      return s + MONTH_KEYS.reduce((ms, k) => ms + (parseFloat(r.metrics[k]) || 0), 0)
    }, 0),
  }

  // 表格列
  const columns = [
    {
      title: '管理类型', dataIndex: 'managementType', key: 'managementType', width: 120,
      render: (val, record) => (
        <Select value={val} onChange={v => updateRow(record._rowId, 'managementType', v)}
          options={[{ label: '直营', value: '直营' }, { label: '代理', value: '代理' }]}
          placeholder="选择" size="small" style={{ width: '100%' }} allowClear />
      ),
    },
    {
      title: '业务模式', dataIndex: 'businessMode', key: 'businessMode', width: 120,
      render: (val, record) => (
        <Select value={val} onChange={v => updateRow(record._rowId, 'businessMode', v)}
          options={[{ label: '制药', value: '制药' }, { label: '医疗', value: '医疗' }]}
          placeholder="选择" size="small" style={{ width: '100%' }} allowClear />
      ),
    },
    {
      title: '产品', dataIndex: 'product', key: 'product', width: 150,
      render: (val, record) => (
        <Select value={val} onChange={v => updateRow(record._rowId, 'product', v)}
          placeholder="选择产品" size="small" style={{ width: '100%' }} showSearch allowClear />
      ),
    },
    ...MONTH_KEYS.map((k, i) => ({
      title: MONTH_LABELS[i], dataIndex: ['metrics', k], key: k, width: 100,
      render: (val, record) => (
        <InputNumber value={val} onChange={v => updateMetric(record._rowId, k, v)}
          placeholder="0" size="small" min={0} precision={2} controls={false} style={{ width: '100%' }} />
      ),
    })),
    {
      title: '操作', key: 'action', width: 60, fixed: 'right',
      render: (_, record) => (
        <Button type="link" danger size="small" icon={<DeleteOutlined />}
          onClick={() => deleteRow(record._rowId)} />
      ),
    },
  ]

  return (
    <div>
      {contextHolder}

      <Card
        title="销售预算编制"
        extra={
          <Space>
            <Select value={year} onChange={setYear} style={{ width: 100 }}
              options={[2024, 2025, 2026].map(y => ({ label: `${y}年`, value: y }))} />
            <Select value={entity} onChange={setEntity} style={{ width: 120 }}
              options={BUDGET_ENTITIES} placeholder="选择实体" />
          </Space>
        }
      >
        {entity ? (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Statistic title="记录数" value={stats.totalRows} suffix="条" />
              </Col>
              <Col span={6}>
                <Statistic title="预算总额" value={stats.totalAmount} precision={2} prefix="¥" valueStyle={{ color: '#1677ff' }} />
              </Col>
            </Row>

            <div style={{ marginBottom: 12 }}>
              <Space>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addRow}>新增行</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
                <Tag color="blue">{rows.length} 行</Tag>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={rows}
              rowKey="_rowId"
              loading={loading}
              size="small"
              pagination={false}
              scroll={{ x: 1800 }}
              bordered
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
            请选择实体开始编制预算
          </div>
        )}
      </Card>
    </div>
  )
}
