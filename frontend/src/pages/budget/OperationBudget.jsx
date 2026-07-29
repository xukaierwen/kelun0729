import { useState, useEffect } from 'react'
import { Card, Table, Button, Select, InputNumber, Space, Typography, Popconfirm, message, Tag, Row, Col, Statistic, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, SendOutlined, DownloadOutlined, ClearOutlined } from '@ant-design/icons'
import api from '../../api'
import dayjs from 'dayjs'

const { Text } = Typography

// 部门选项
const DEPARTMENTS = [
  { label: '销售部', value: '销售部' },
  { label: '市场部', value: '市场部' },
  { label: '运营部', value: '运营部' },
  { label: '财务部', value: '财务部' },
  { label: '人力资源部', value: '人力资源部' },
]

// 科目类型
const EXPENSE_SUBJECT_TYPES = [
  { label: '人力成本', value: '人力成本' },
  { label: '办公费用', value: '办公费用' },
  { label: '差旅费用', value: '差旅费用' },
  { label: '市场推广', value: '市场推广' },
  { label: '其他费用', value: '其他费用' },
]

// 科目
const EXPENSE_SUBJECTS = {
  '人力成本': ['工资', '社保', '公积金', '奖金', '培训费'],
  '办公费用': ['办公用品', '水电费', '物业费', '网络费', '设备折旧'],
  '差旅费用': ['交通费', '住宿费', '餐饮费', '其他差旅'],
  '市场推广': ['广告费', '活动费', '宣传材料', '展会费'],
  '其他费用': ['咨询费', '审计费', '其他'],
}

let rowId = 1
function createRow() {
  return { _rowId: rowId++, department: null, subjectType: null, subject: null, amount: '' }
}

export default function OperationBudget() {
  const [messageApi, contextHolder] = message.useMessage()
  const [rows, setRows] = useState([createRow()])
  const [savedRecords, setSavedRecords] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // 加载已保存记录
  const loadRecords = async () => {
    setLoading(true)
    try {
      const res = await api.get('/budget/operation')
      setSavedRecords(res.data || [])
    } catch (err) {
      console.log('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

  const updateRow = (rowId, field, value) => {
    setRows(prev => prev.map(r => {
      if (r._rowId !== rowId) return r
      if (field === 'subjectType') return { ...r, [field]: value, subject: null }
      return { ...r, [field]: value }
    }))
  }

  const addRow = () => setRows(prev => [...prev, createRow()])
  const deleteRow = (id) => setRows(prev => prev.filter(r => r._rowId !== id))

  // 获取科目选项
  const getSubjectOptions = (subjectType) => {
    if (!subjectType) return []
    const subjects = EXPENSE_SUBJECTS[subjectType] || []
    return subjects.map(s => ({ label: s, value: s }))
  }

  // 提交
  const handleSubmit = async () => {
    for (const row of rows) {
      if (!row.department) { messageApi.warning('请选择所有行的部门'); return }
      if (!row.subjectType) { messageApi.warning('请选择所有行的科目类型'); return }
      if (!row.subject) { messageApi.warning('请选择所有行的科目'); return }
      if (!row.amount && row.amount !== 0) { messageApi.warning('请填写所有行的金额'); return }
    }

    try {
      const data = rows.map(row => ({
        ...row,
        amount: parseFloat(row.amount) || 0,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }))
      await api.post('/budget/operation', { data })
      messageApi.success(`成功提交 ${rows.length} 条运营费用预算`)
      setRows([createRow()])
      loadRecords()
    } catch (err) {
      messageApi.error(`提交失败: ${err.message}`)
    }
  }

  // 删除记录
  const handleDeleteRecord = async (id) => {
    try {
      await api.delete(`/budget/operation/${id}`)
      messageApi.success('已删除')
      loadRecords()
    } catch (err) {
      messageApi.error(`删除失败: ${err.message}`)
    }
  }

  // 导出
  const handleExport = () => {
    if (savedRecords.length === 0) { messageApi.warning('暂无数据'); return }
    const header = '部门,科目类型,科目,金额,提交时间'
    const csvRows = savedRecords.map(r =>
      `${r.department || ''},${r.subjectType || ''},${r.subject || ''},${r.amount || 0},${r.createdAt || ''}`
    )
    const csv = '\uFEFF' + [header, ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '运营费用预算.csv'
    link.click()
    messageApi.success('导出成功')
  }

  // 统计
  const stats = {
    totalAmount: savedRecords.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0),
    count: savedRecords.length,
  }

  // 编辑表格列
  const editColumns = [
    {
      title: '部门', dataIndex: 'department', key: 'department', width: 160, fixed: 'left',
      render: (val, record) => (
        <Select value={val} onChange={v => updateRow(record._rowId, 'department', v)}
          options={DEPARTMENTS} placeholder="选择部门" size="small" style={{ width: '100%' }} showSearch />
      ),
    },
    {
      title: '科目类型', dataIndex: 'subjectType', key: 'subjectType', width: 150,
      render: (val, record) => (
        <Select value={val} onChange={v => updateRow(record._rowId, 'subjectType', v)}
          options={EXPENSE_SUBJECT_TYPES} placeholder="选择类型" size="small" style={{ width: '100%' }} />
      ),
    },
    {
      title: '科目', dataIndex: 'subject', key: 'subject', width: 180,
      render: (val, record) => (
        <Select value={val} onChange={v => updateRow(record._rowId, 'subject', v)}
          options={getSubjectOptions(record.subjectType)}
          placeholder={record.subjectType ? '选择科目' : '先选科目类型'} size="small"
          style={{ width: '100%' }} disabled={!record.subjectType} />
      ),
    },
    {
      title: '金额', dataIndex: 'amount', key: 'amount', width: 150,
      render: (val, record) => (
        <InputNumber value={val === '' ? null : val} onChange={v => updateRow(record._rowId, 'amount', v ?? '')}
          placeholder="0.00" size="small" min={0} precision={2} prefix="¥" controls={false} style={{ width: '100%' }} />
      ),
    },
    {
      title: '操作', key: 'action', width: 60, fixed: 'right',
      render: (_, record) => (
        rows.length > 1 ? (
          <Popconfirm title="确认删除？" onConfirm={() => deleteRow(record._rowId)} okText="删除" cancelText="取消">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        ) : <Button type="link" danger size="small" icon={<DeleteOutlined />} disabled />
      ),
    },
  ]

  // 已保存记录列
  const savedColumns = [
    { title: '部门', dataIndex: 'department', key: 'department', width: 130 },
    { title: '科目类型', dataIndex: 'subjectType', key: 'subjectType', width: 120, render: v => <Tag color="blue">{v}</Tag> },
    { title: '科目', dataIndex: 'subject', key: 'subject', width: 140 },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: v => <Text strong>¥{(v || 0).toLocaleString()}</Text> },
    { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作', key: 'action', width: 60,
      render: (_, record) => (
        <Popconfirm title="确认删除？" onConfirm={() => handleDeleteRecord(record.id)} okText="删除" cancelText="取消">
          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  const filteredRecords = search
    ? savedRecords.filter(r =>
        (r.department || '').includes(search) || (r.subjectType || '').includes(search) ||
        (r.subject || '').includes(search)
      )
    : savedRecords

  return (
    <div>
      {contextHolder}

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card size="small"><Statistic title="费用记录数" value={stats.count} suffix="条" /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="费用总金额" value={stats.totalAmount} prefix="¥" precision={2} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      {/* 编辑区 */}
      <Card title="运营费用预算编制" size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <Space>
            <Button type="dashed" icon={<PlusOutlined />} onClick={addRow}>新增行</Button>
            <Tag color="blue">{rows.length} 行</Tag>
          </Space>
          <Space>
            <Popconfirm title="清空所有行？" onConfirm={() => { setRows([createRow()]); messageApi.info('已清空') }} okText="清空" cancelText="取消">
              <Button icon={<ClearOutlined />}>清空</Button>
            </Popconfirm>
            <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit}>提交保存</Button>
          </Space>
        </div>
        <Table columns={editColumns} dataSource={rows} rowKey="_rowId" size="small"
          pagination={false} scroll={{ x: 700 }} bordered />
      </Card>

      {/* 已保存记录 */}
      <Card title="已保存的运营费用预算" size="small"
        extra={<Space><Input prefix="搜索" placeholder="部门/科目" allowClear size="small" style={{ width: 180 }} value={search} onChange={e => setSearch(e.target.value)} />
          <Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>导出</Button></Space>}>
        <Table columns={savedColumns} dataSource={filteredRecords} rowKey="id" size="small"
          loading={loading} scroll={{ x: 750 }} pagination={{ pageSize: 10, showTotal: t => `共 ${t} 条` }} />
      </Card>
    </div>
  )
}
