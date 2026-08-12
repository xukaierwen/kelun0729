import { useState, useMemo } from 'react'
import { Form, Select, Button, Space, Table, Modal, InputNumber, message } from 'antd'
import {
  SearchOutlined,
  SaveOutlined,
  ImportOutlined,
  ExportOutlined,
  LockOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import './TargetCompileTable.css'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const pad2 = (n) => String(n).padStart(2, '0')

// ---------- 参数筛选值集 ----------
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 2020 }, (_, i) => String(2021 + i))
const MGMT_TYPE_OPTIONS = ['南区', '北区']
const MGMT_TEAM_MAP = {
  南区: ['南一区', '南二区', '南三区', '南四区', '南商务'],
  北区: ['北一区', '北二区', '北三区', '北四区', '北五区', '北特区', '北商务'],
}
const PERIOD_TYPE_OPTIONS = ['当期', '累计']
const ANALYSIS_ARCH_OPTIONS = ['处方药-输液', '处方药-非输液', '非处方药', '营养产品']

// 参数筛选字段
const FILTER_FIELDS = [
  { key: 'year', label: '年份', type: 'year' },
  { key: 'mgmt_type', label: '总部管理类型', type: 'select', options: MGMT_TYPE_OPTIONS },
  { key: 'mgmt_team', label: '总部管理团队', type: 'select', dependsOn: 'mgmt_type' },
  { key: 'period_type', label: '当期/累计', type: 'select', options: PERIOD_TYPE_OPTIONS },
  { key: 'analysis_arch', label: '产品分析架构', type: 'select', options: ANALYSIS_ARCH_OPTIONS },
]

// ---------- 维度列（左侧固定） ----------
const DIMENSION_FIELDS = [
  { key: 'mgmt_type', title: '总部管理类型', width: 110 },
  { key: 'mgmt_team', title: '总部管理团队', width: 110 },
  { key: 'product_owner_hq', title: '产品负责人（总部）', width: 130 },
  { key: 'province', title: '省份', width: 90 },
  { key: 'salesman_lv1', title: '一级业务员', width: 110 },
  { key: 'analysis_arch', title: '产品分析架构', width: 120 },
]

// ---------- 指标分组（预算数可填报，其余灰色只读） ----------
const GROUPS = [
  { key: 'budget', title: '预算数', editable: true },
  { key: 'last_year', title: '上年预计完成数' },
  { key: 'diff', title: '增减数' },
  { key: 'diff_rate', title: '增减率', isPercent: true },
]

// ---------- 数值读取 ----------
// 预算数：直接取填报值；上年预计完成数：系统取数
const getCellValue = (g, m, record) => {
  const b = record[`budget_m${pad2(m)}`]
  const l = record[`last_year_m${pad2(m)}`]
  if (g.key === 'budget') return b ?? null
  if (g.key === 'last_year') return l ?? null
  if (g.key === 'diff') {
    if (b == null && l == null) return null
    return (Number(b) || 0) - (Number(l) || 0)
  }
  if (g.key === 'diff_rate') {
    if (b == null || l == null || Number(l) === 0) return null
    return ((Number(b) - Number(l)) / Number(l)) * 100
  }
  return null
}

// 全年合计（空值视为 0；全部为空返回 null）
const getAnnualValue = (g, record) => {
  if (g.key === 'budget' || g.key === 'last_year') {
    let hasVal = false
    let sum = 0
    for (let m = 1; m <= 12; m++) {
      const v = record[`${g.key}_m${pad2(m)}`]
      if (v != null && v !== '') {
        hasVal = true
        sum += Number(v)
      }
    }
    return hasVal ? sum : null
  }
  const bSum = getAnnualValue({ key: 'budget' }, record)
  const lSum = getAnnualValue({ key: 'last_year' }, record)
  if (g.key === 'diff') {
    if (bSum == null && lSum == null) return null
    return (Number(bSum) || 0) - (Number(lSum) || 0)
  }
  if (g.key === 'diff_rate') {
    if (bSum == null || lSum == null || Number(lSum) === 0) return null
    return ((Number(bSum) - Number(lSum)) / Number(lSum)) * 100
  }
  return null
}

// ---------- 数字格式化 ----------
const formatValue = (v) =>
  v == null || v === '' ? '-' : Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formatPercent = (v) => (v == null || v === '' ? '-' : `${Number(v).toFixed(2)}%`)

// ---------- 可编辑单元格（预算数） ----------
const EditableCell = ({ editable, record, dataIndex, onSave, children, ...rest }) => {
  if (!editable) return <td {...rest}>{children}</td>
  return (
    <td {...rest}>
      <InputNumber
        size="small"
        style={{ width: '100%' }}
        value={record[dataIndex]}
        onChange={(v) => onSave(record, dataIndex, v)}
        precision={2}
        placeholder=""
      />
    </td>
  )
}

// ---------- 模拟数据（demo）：维度组合 × 上年预计完成数取数 ----------
const round2 = (v) => Math.round(v * 100) / 100
const rand = (min, max) => min + Math.random() * (max - min)

const MOCK_DIM_ROWS = [
  { mgmt_type: '南区', mgmt_team: '南一区', product_owner_hq: '张经理', province: '广东', salesman_lv1: '李建国', analysis_arch: '处方药-输液' },
  { mgmt_type: '南区', mgmt_team: '南二区', product_owner_hq: '张经理', province: '四川', salesman_lv1: '张伟明', analysis_arch: '处方药-非输液' },
  { mgmt_type: '北区', mgmt_team: '北一区', product_owner_hq: '王经理', province: '江苏', salesman_lv1: '王丽华', analysis_arch: '非处方药' },
  { mgmt_type: '北区', mgmt_team: '北二区', product_owner_hq: '王经理', province: '湖北', salesman_lv1: '陈志强', analysis_arch: '营养产品' },
]

// 示例填报值（demo）：第一行 1月=400、第二行 1月=300
const SAMPLE_BUDGET = { 0: { 1: 400 }, 1: { 1: 300 } }

const generateMockRows = (values) => {
  return MOCK_DIM_ROWS.map((d, idx) => {
    const row = { id: idx + 1, ...d }
    for (let m = 1; m <= 12; m++) {
      // 上年预计完成数：系统取数（demo 随机）
      row[`last_year_m${pad2(m)}`] = round2(rand(200, 500))
      // 预算数：已有填报值保留，其余待填
      row[`budget_m${pad2(m)}`] = (SAMPLE_BUDGET[idx] && SAMPLE_BUDGET[idx][m]) ?? null
    }
    return row
  })
}

// ---------- 页面组件 ----------
export default function TargetCompileTable() {
  const [form] = Form.useForm()
  const values = Form.useWatch([], form) || {}

  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [locked, setLocked] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)

  const mgmtTypeValue = values.mgmt_type

  // ---------- 动态列构建 ----------
  const columns = useMemo(() => {
    const cols = []

    // 维度列（左侧固定，不参与"销售量-转换后"分组）
    DIMENSION_FIELDS.forEach((f) => {
      cols.push({
        title: f.title,
        dataIndex: f.key,
        key: f.key,
        width: f.width,
        fixed: 'left',
        ellipsis: true,
        onCell: () => ({ className: 'readonly-cell' }),
      })
    })

    // 预算数 1-12 月 + 全年合计
    const budgetChildren = []
    for (let m = 1; m <= 12; m++) {
      const key = `budget_m${pad2(m)}`
      budgetChildren.push({
        title: `${m}月`,
        dataIndex: key,
        key,
        width: 90,
        align: 'right',
        render: (v, record) => formatValue(record[key]),
        onCell: (record) => ({
          editable: !locked,
          record,
          dataIndex: key,
          onSave: handleCellSave,
        }),
      })
    }
    budgetChildren.push({
      title: '全年合计',
      dataIndex: 'budget_annual',
      key: 'budget_annual',
      width: 100,
      align: 'right',
      render: (v, record) => formatValue(getAnnualValue({ key: 'budget' }, record)),
      onCell: () => ({ className: 'readonly-cell' }),
    })

    // 销售量-转换后（指标分组，跨预算数/上年预计完成数/增减数/增减率）
    cols.push({
      title: '销售量-转换后',
      children: [
        {
          title: '预算数',
          children: budgetChildren,
        },
        {
          title: '上年预计完成数',
          dataIndex: 'last_year_annual',
          key: 'last_year_annual',
          width: 120,
          align: 'right',
          render: (v, record) => formatValue(getAnnualValue({ key: 'last_year' }, record)),
          onCell: () => ({ className: 'readonly-cell' }),
        },
        {
          title: '增减数',
          dataIndex: 'diff_annual',
          key: 'diff_annual',
          width: 100,
          align: 'right',
          render: (v, record) => formatValue(getAnnualValue({ key: 'diff' }, record)),
          onCell: () => ({ className: 'readonly-cell' }),
        },
        {
          title: '增减率',
          dataIndex: 'diff_rate_annual',
          key: 'diff_rate_annual',
          width: 100,
          align: 'right',
          render: (v, record) => formatPercent(getAnnualValue({ key: 'diff_rate' }, record)),
          onCell: () => ({ className: 'readonly-cell' }),
        },
      ],
    })

    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked])

  // 单元格编辑（仅预算数）
  const handleCellSave = (record, dataIndex, value) => {
    setDataSource((prev) => prev.map((r) => (r.id === record.id ? { ...r, [dataIndex]: value } : r)))
  }

  // ---------- 查询 ----------
  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setDataSource(generateMockRows(values))
      setLoading(false)
      message.success('查询完成（demo 模拟数据）')
    }, 400)
  }

  // ---------- 保存 ----------
  const handleSave = () => {
    if (dataSource.length === 0) {
      message.warning('请先点击「查询」加载数据')
      return
    }
    message.success(`保存成功：共 ${dataSource.length} 条记录`)
  }

  // ---------- 提交锁定 ----------
  const handleLock = () => {
    if (dataSource.length === 0) {
      message.warning('请先点击「查询」加载数据')
      return
    }
    setLocked(true)
    message.success('提交锁定成功，目标数据已锁定不可编辑')
  }

  // ---------- 导出（当前查询结果全量 CSV） ----------
  const handleExport = () => {
    if (dataSource.length === 0) {
      message.warning('暂无数据可导出')
      return
    }
    const headers = [...DIMENSION_FIELDS.map((f) => f.title)]
    // 预算数 1-12 月 + 全年合计
    for (let m = 1; m <= 12; m++) headers.push(`预算数-${m}月`)
    headers.push('预算数-全年合计')
    // 上年预计完成数/增减数/增减率 全年合计
    headers.push('上年预计完成数-全年合计')
    headers.push('增减数-全年合计')
    headers.push('增减率-全年合计')

    const rows = dataSource.map((record) => {
      const vals = []
      DIMENSION_FIELDS.forEach((f) => vals.push(record[f.key] ?? ''))
      // 预算数 1-12 月 + 全年合计
      for (let m = 1; m <= 12; m++) {
        vals.push(record[`budget_m${pad2(m)}`] ?? '')
      }
      vals.push(getAnnualValue({ key: 'budget' }, record) ?? '')
      // 上年预计完成数/增减数/增减率 全年合计
      vals.push(getAnnualValue({ key: 'last_year' }, record) ?? '')
      vals.push(getAnnualValue({ key: 'diff' }, record) ?? '')
      const diffRate = getAnnualValue({ key: 'diff_rate' }, record)
      vals.push(diffRate != null ? `${Number(diffRate).toFixed(2)}%` : '')
      return vals
    })
    const BOM = '\uFEFF'
    const csvContent =
      BOM + [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `总部目标编制_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    message.success('导出成功')
  }

  // ---------- 筛选器渲染 ----------
  const renderFilterControl = (filter) => {
    switch (filter.type) {
      case 'year':
        return (
          <Select size="small" placeholder="请选择" showSearch className="filter-select">
            {YEAR_OPTIONS.map((y) => (
              <Select.Option key={y} value={y}>{y}年</Select.Option>
            ))}
          </Select>
        )
      case 'select':
        return (
          <Select size="small" placeholder="请选择" allowClear className="filter-select">
            {(filter.options || []).map((o) => (
              <Select.Option key={o} value={o}>{o}</Select.Option>
            ))}
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <div className="target-compile-page">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form
          form={form}
          layout="inline"
          className="search-fields"
          initialValues={{
            year: String(CURRENT_YEAR),
            period_type: '当期',
          }}
        >
          {FILTER_FIELDS.map((filter) => (
            <Form.Item key={filter.key} label={filter.label} name={filter.key} className="search-field-item">
              {filter.type === 'select' && filter.dependsOn === 'mgmt_type' ? (
                <Select size="small" placeholder="请选择" allowClear className="filter-select">
                  {(MGMT_TEAM_MAP[mgmtTypeValue] || []).map((t) => (
                    <Select.Option key={t} value={t}>{t}</Select.Option>
                  ))}
                </Select>
              ) : (
                renderFilterControl(filter)
              )}
            </Form.Item>
          ))}
        </Form>
        <div className="search-buttons">
          <Button size="small" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
          <Button size="small" icon={<LockOutlined />} disabled={locked} onClick={handleLock}>提交锁定</Button>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          <Button size="small" icon={<ImportOutlined />} onClick={() => setImportModalOpen(true)}>导入</Button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          components={{ body: { cell: EditableCell } }}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            size: 'small',
          }}
          scroll={{ x: 'max-content' }}
          size="small"
          bordered
          locale={{ emptyText: '暂无数据，请点击「查询」加载' }}
        />
      </div>

      {/* 导入弹窗 */}
      <Modal
        title="导入目标数据"
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={
          <Space>
            <Button size="small" icon={<LinkOutlined />} onClick={() => message.info('demo 阶段暂未开放模板下载')}>
              打开导入/导出模板
            </Button>
            <Button type="primary" size="small" onClick={() => setImportModalOpen(false)}>关闭</Button>
          </Space>
        }
        width={520}
      >
        <p className="import-tip">
          1. 请下载「总部目标编制」导入模板，按模板填写预算数；<br />
          2. 上传后系统将校验维度组合唯一性并写入预算数（仅允许修改未锁定数据）；<br />
          3. demo 阶段暂未开放上传。
        </p>
      </Modal>
    </div>
  )
}
