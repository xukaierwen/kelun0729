import { useState, useMemo } from 'react'
import { Table, Button, Select, Form, TreeSelect, Tag, Modal, Input, Timeline, message } from 'antd'
import {
  SearchOutlined,
  ExportOutlined,
  ReloadOutlined,
  LockOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { MGMT_TYPE_OPTIONS, MGMT_TEAM_MAP, SALESMAN_OPTIONS, ANALYSIS_ARCH_TREE } from './plannedCompleteDefs'
import './TargetReviewTable.css'

const CURRENT_YEAR = new Date().getFullYear()
// 年份：2021 到当前年份，单选
const YEAR_OPTS = Array.from({ length: CURRENT_YEAR - 2021 + 1 }, (_, i) => String(CURRENT_YEAR - i))
const pad2 = (n) => String(n).padStart(2, '0')
const round2 = (v) => Math.round(v * 100) / 100
const rand = (min, max) => min + Math.random() * (max - min)
const fmt = (v) => (v == null || v === '' ? '-' : Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const pct = (v) => (v == null || v === '' ? '-' : `${fmt(v)}%`)
const now = () => new Date().toLocaleString('zh-CN', { hour12: false })

// 审核状态配色
const STATUS_COLOR = {
  待提交: '#BFBFBF',
  审核中: '#1890FF',
  已通过: '#52C41A',
  已驳回: '#FF4D4F',
}

// ---------- mock 单据（覆盖 4 种审核状态） ----------
const genRow = (id, status) => {
  const budget = Array.from({ length: 12 }, () => round2(rand(100, 300)))
  const budgetTotal = round2(budget.reduce((s, v) => s + v, 0))
  const lastYear = round2(budgetTotal * rand(0.85, 1.05))
  const diff = round2(budgetTotal - lastYear)
  const diffRate = lastYear ? round2((diff / lastYear) * 100) : 0
  const planTotal = round2(budgetTotal * rand(0.9, 1.1))
  const actualCum = round2(budgetTotal * rand(0.3, 0.6))
  const row = {
    id,
    mgmt_type: ['处方药事业部', 'OTC事业部', '大健康事业部'][id % 3],
    mgmt_team: ['团队一', '团队二', '团队三'][id % 3],
    product_owner: '张经理',
    province: ['广东', '四川', '江苏', '湖南'][id % 4],
    salesman_lv1: '李建国',
    analysis_arch: '处方药-输液',
    status,
    budget_m: budget,
    budget_total: budgetTotal,
    last_year_total: lastYear,
    diff_total: diff,
    diff_rate: diffRate,
    plan_total: planTotal,
    annual_exec_rate: budgetTotal ? round2((planTotal / budgetTotal) * 100) : 0,
    actual_cum: actualCum,
    cum_exec_rate: budgetTotal ? round2((actualCum / budgetTotal) * 100) : 0,
    trace: [],
  }
  const t = (operator, type, comment, mins) => ({ operator, type, comment, time: new Date(Date.now() - mins * 60000).toLocaleString('zh-CN', { hour12: false }) })
  if (status === '审核中') row.trace = [t('编制人-王五', '提交锁定', '编制完成，提交审核', 60), t('审核员-赵六', '抄送', '抄送财务知悉', 30)]
  if (status === '已通过') row.trace = [t('编制人-王五', '提交锁定', '编制完成，提交审核', 200), t('审核员-赵六', '审核通过', '预算数合理，通过', 120)]
  if (status === '已驳回') row.trace = [t('编制人-王五', '提交锁定', '编制完成，提交审核', 300), t('审核员-赵六', '驳回', '12月预算数偏高，请复核后重新提交', 180)]
  if (status === '待提交') row.trace = [t('编制人-王五', '保存', '暂存草稿，未提交', 400)]
  return row
}

const buildMock = () => [genRow(1, '审核中'), genRow(2, '已通过'), genRow(3, '已驳回'), genRow(4, '待提交')]

// 维度固定列（浅蓝表头）
const DIM_COLS = [
  { key: 'mgmt_type', title: '总部管理类型', width: 110 },
  { key: 'mgmt_team', title: '总部管理团队', width: 110 },
  { key: 'product_owner', title: '产品负责人（总部）', width: 130 },
  { key: 'province', title: '省份', width: 90 },
  { key: 'salesman_lv1', title: '一级业务员', width: 110 },
  { key: 'analysis_arch', title: '产品分析架构', width: 120 },
]

export default function TargetReviewTable() {
  const [form] = Form.useForm()
  const values = Form.useWatch([], form) || {}
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [reviewModal, setReviewModal] = useState(null) // { type: 审核通过|驳回|抄送, record }
  const [comment, setComment] = useState('')
  const [searchExpanded, setSearchExpanded] = useState(false)

  const mgmtTypeValue = values.mgmt_type || []

  // ---------- 列配置 ----------
  const columns = useMemo(() => {
    const cols = DIM_COLS.map((c) => ({
      title: c.title,
      dataIndex: c.key,
      key: c.key,
      width: c.width,
      fixed: 'left',
      ellipsis: true,
      onHeaderCell: () => ({ className: 'tr-dim-col' }),
    }))

    // 销售量-转换后（三层表头，参照表模型图）
    cols.push({
      title: '销售量-转换后',
      key: 'sales_converted',
      children: [
        {
          title: '累计实际数',
          key: 'actual',
          children: [{ title: '1-X月', dataIndex: 'actual_cum', key: 'actual_cum', width: 100, align: 'right', render: fmt }],
        },
        {
          title: '预算数',
          key: 'budget',
          children: [{ title: '全年合计', dataIndex: 'budget_total', key: 'budget_total', width: 100, align: 'right', render: fmt }],
        },
        {
          title: '预计完成数',
          key: 'plan',
          children: [{ title: '全年合计', dataIndex: 'plan_total', key: 'plan_total', width: 100, align: 'right', render: fmt }],
        },
        {
          title: '全年预算执行率',
          key: 'annual_exec',
          children: [{ title: '全年合计', dataIndex: 'annual_exec_rate', key: 'annual_exec_rate', width: 110, align: 'right', render: pct }],
        },
        {
          title: '累计执行率',
          key: 'cum_exec',
          children: [{ title: '全年合计', dataIndex: 'cum_exec_rate', key: 'cum_exec_rate', width: 100, align: 'right', render: pct }],
        },
      ],
    })

    // 审核状态列
    cols.push({
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (s) => <Tag color={STATUS_COLOR[s] || '#BFBFBF'}>{s}</Tag>,
    })
    return cols
  }, [])

  // 预算数明细列（审核详情，只读）
  const detailCols = useMemo(() => {
    const cs = Array.from({ length: 12 }, (_, i) => ({
      title: `${i + 1}月`,
      dataIndex: ['budget_m', i],
      key: `budget_m${pad2(i + 1)}`,
      width: 86,
      align: 'right',
      render: fmt,
    }))
    cs.push(
      { title: '全年合计', dataIndex: 'budget_total', key: 'budget_total', width: 96, align: 'right', render: fmt },
      { title: '上年预计完成数-全年合计', dataIndex: 'last_year_total', key: 'last_year_total', width: 150, align: 'right', render: fmt },
      { title: '增减数-全年合计', dataIndex: 'diff_total', key: 'diff_total', width: 120, align: 'right', render: fmt },
      { title: '增减率-全年合计', dataIndex: 'diff_rate', key: 'diff_rate', width: 120, align: 'right', render: pct }
    )
    return cs
  }, [])

  // ---------- 查询 / 刷新 ----------
  const loadData = () => {
    setLoading(true)
    setTimeout(() => {
      setDataSource(buildMock())
      setExpandedKeys([])
      setLoading(false)
      message.success('查询完成（demo 模拟数据）')
    }, 400)
  }

  // ---------- 导出 ----------
  const handleExport = () => {
    if (dataSource.length === 0) {
      message.warning('暂无数据可导出')
      return
    }
    const headers = [...DIM_COLS.map((c) => c.title), '累计实际数-1-X月', '预算数-全年合计', '预计完成数-全年合计', '全年预算执行率-全年合计', '累计执行率-全年合计', '审核状态']
    const rows = dataSource.map((r) => [
      ...DIM_COLS.map((c) => r[c.key] ?? ''),
      r.actual_cum, r.budget_total, r.plan_total, r.annual_exec_rate, r.cum_exec_rate, r.status,
    ])
    const BOM = '\uFEFF'
    const csv = BOM + [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `预算数-总部目标审核_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    message.success('导出成功')
  }

  // ---------- 提交锁定（两次确认） ----------
  const submitLock = (record) => {
    Modal.confirm({
      title: '提交锁定（第一次确认）',
      content: '提交锁定后编制人不可再编辑当前单据，预算数进入审核中状态。是否继续？',
      onOk: () => {
        Modal.confirm({
          title: '提交锁定（第二次确认）',
          content: '请再次确认提交锁定当前预算数。',
          onOk: () => {
            setDataSource((prev) => prev.map((r) => (r.id === record.id ? {
              ...r,
              status: '审核中',
              trace: [{ operator: '编制人-王五', time: now(), type: '提交锁定', comment: '驳回后重新提交锁定' }, ...r.trace],
            } : r)))
            message.success('提交锁定成功，已进入审核中状态')
          },
        })
      },
    })
  }

  // ---------- 审核操作（意见必填） ----------
  const openReview = (type, record) => {
    setComment('')
    setReviewModal({ type, record })
  }

  const confirmReview = () => {
    if (!comment.trim()) {
      message.warning('请填写审核意见')
      return
    }
    const { type, record } = reviewModal
    setDataSource((prev) => prev.map((r) => {
      if (r.id !== record.id) return r
      const traceItem = { operator: '审核员-赵六', time: now(), type, comment: comment.trim() }
      if (type === '审核通过') return { ...r, status: '已通过', trace: [traceItem, ...r.trace] }
      if (type === '驳回') return { ...r, status: '已驳回', trace: [traceItem, ...r.trace] }
      return { ...r, trace: [traceItem, ...r.trace] } // 抄送不影响审核流
    }))
    message.success(type === '抄送' ? '抄送成功' : type === '审核通过' ? '审核通过，预算数已写入目标下达' : '已驳回，编制人可修改后重新提交')
    setReviewModal(null)
  }

  // ---------- 行展开：审核详情 ----------
  const expandedRowRender = (record) => (
    <div className="review-detail">
      <div className="review-detail-grid">
        <div className="review-detail-main">
          <h4>预算数明细（审核态只读）</h4>
          <Table
            size="small"
            bordered
            rowKey="id"
            pagination={false}
            dataSource={[record]}
            columns={detailCols}
            scroll={{ x: 1500 }}
          />
          <div className="review-actions">
            {record.status === '已驳回' && (
              <Button size="small" icon={<LockOutlined />} onClick={() => submitLock(record)}>提交锁定</Button>
            )}
            <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => openReview('审核通过', record)}>审核通过</Button>
            <Button size="small" danger icon={<CloseOutlined />} onClick={() => openReview('驳回', record)}>驳回</Button>
            <Button size="small" icon={<SendOutlined />} onClick={() => openReview('抄送', record)}>抄送</Button>
          </div>
        </div>
        <div className="review-detail-side">
          <h4>审批留痕（时间倒序）</h4>
          <div className="review-trace">
            {record.trace.length === 0 ? (
              <span style={{ color: '#999', fontSize: 12 }}>暂无审批记录</span>
            ) : (
              <Timeline>
                {record.trace.map((t, i) => (
                  <Timeline.Item key={i} color={STATUS_COLOR[t.type === '驳回' ? '已驳回' : t.type === '审核通过' ? '已通过' : t.type === '提交锁定' ? '审核中' : 'gray'] || 'blue'}>
                    <div style={{ fontSize: 12 }}>
                      <b>{t.type}</b> ｜ {t.operator} ｜ {t.time}
                      <div style={{ color: '#666' }}>意见：{t.comment}</div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="target-review-page">
      {/* 查询条件区（第一行 4 个筛选器，其余「更多」展开）+ 功能按钮居右 */}
      <div className="search-form">
        <Form form={form} layout="inline" className="search-fields" initialValues={{ year: String(CURRENT_YEAR), period_type: '当期' }}>
          <Form.Item label="年份" name="year" className="search-field-item">
            <Select size="small" placeholder="请选择">
              {YEAR_OPTS.map((y) => <Select.Option key={y} value={y}>{y}年</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="总部管理类型" name="mgmt_type" className="search-field-item">
            <Select size="small" mode="multiple" placeholder="可多选" allowClear maxTagCount={2}>
              {MGMT_TYPE_OPTIONS.map((o) => <Select.Option key={o} value={o}>{o}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="总部管理团队" name="mgmt_team" className="search-field-item">
            <Select size="small" mode="multiple" placeholder="可多选" allowClear maxTagCount={2}>
              {(mgmtTypeValue.flatMap((t) => MGMT_TEAM_MAP[t] || [])).map((o) => <Select.Option key={o} value={o}>{o}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="一级业务员" name="salesman_lv1" className="search-field-item">
            <Select size="small" mode="multiple" placeholder="可多选" allowClear maxTagCount={2}>
              {SALESMAN_OPTIONS.map((o) => <Select.Option key={o.name} value={o.name}>{o.name}</Select.Option>)}
            </Select>
          </Form.Item>
          {/* 第二行筛选器：点击「更多」展开 */}
          {searchExpanded && (
            <>
              <Form.Item label="当期/累计" name="period_type" className="search-field-item">
                <Select size="small" placeholder="请选择">
                  <Select.Option value="当期">当期</Select.Option>
                  <Select.Option value="累计">累计</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="产品分析架构" name="analysis_arch" className="search-field-item">
                <TreeSelect size="small" placeholder="请选择" allowClear showSearch treeDefaultExpandAll treeData={ANALYSIS_ARCH_TREE} />
              </Form.Item>
            </>
          )}
        </Form>
        <div className="search-buttons">
          <Button size="small" type="link" onClick={() => setSearchExpanded(!searchExpanded)}>
            {searchExpanded ? '收起' : '更多'} {searchExpanded ? <UpOutlined /> : <DownOutlined />}
          </Button>
          <Button size="small" icon={<ReloadOutlined />} onClick={loadData}>刷新</Button>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          <Button size="small" icon={<LockOutlined />} onClick={() => {
            const rejected = dataSource.find((r) => expandedKeys.includes(r.id) && r.status === '已驳回') || dataSource.find((r) => r.status === '已驳回')
            if (!rejected) {
              message.warning('当前无「已驳回」状态单据可提交锁定')
              return
            }
            submitLock(rejected)
          }}>提交锁定</Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={loadData}>查询</Button>
        </div>
      </div>

      {/* 3. 数据表格区（含审核状态列 + 行展开审核详情） */}
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20, showTotal: (t) => `共 ${t} 条`, showSizeChanger: true, size: 'small' }}
          scroll={{ x: 1600 }}
          size="small"
          bordered
          rowClassName={(_, index) => (index % 2 === 1 ? 'tr-zebra' : '')}
          expandable={{ expandedRowRender, expandedRowKeys: expandedKeys, onExpandedRowsChange: (keys) => setExpandedKeys(keys) }}
          locale={{ emptyText: '暂无数据，请点击「查询」加载' }}
        />
      </div>

      {/* 审核意见弹窗（意见必填） */}
      <Modal
        title={reviewModal ? `${reviewModal.type} - 填写审核意见` : ''}
        open={!!reviewModal}
        onCancel={() => setReviewModal(null)}
        onOk={confirmReview}
        okText="提交"
        cancelText="取消"
      >
        <Input.TextArea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="请填写审核意见（必填），提交后追加到审批留痕" />
      </Modal>
    </div>
  )
}
