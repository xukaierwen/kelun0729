import { useState, useMemo } from 'react'
import { Form, Select, Button, Space, Table, Input, Modal, InputNumber, Switch, Tag, message } from 'antd'
import {
  SearchOutlined,
  SaveOutlined,
  ImportOutlined,
  ExportOutlined,
  SettingOutlined,
  LinkOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import {
  ACTUAL_DATA_SECTIONS,
  ACTION_BUTTONS,
  IMPORT_TEMPLATE_URL,
  YEAR_OPTIONS,
  MGMT_TYPE_OPTIONS,
  MGMT_TEAM_MAP,
  DATA_SCOPE_OPTIONS,
  PERIOD_TYPE_OPTIONS,
  MOCK_PRODUCTS,
} from './actualDataDefs'
import './ActualDataPage.css'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const pad2 = (n) => String(n).padStart(2, '0')

// ---------- 显隐条件解析：showWhen = { field, in: [...] } ----------
const resolveVisible = (cond, values) => {
  if (!cond) return true
  if (cond.field && Array.isArray(cond.in)) return cond.in.includes(values[cond.field])
  return true
}

// ---------- 数值读取：调整前 / 调整 / 调整后 ----------
const getBase = (record, key, m) => record[`${key}_m${pad2(m)}`]
const getAdj = (record, key, m) => record[`${key}_m${pad2(m)}_adj`]
// 调整后 = 调整前 + 调整
const getPost = (record, key, m) => {
  const b = getBase(record, key, m)
  const a = getAdj(record, key, m)
  if ((b == null || b === '') && (a == null || a === '')) return null
  return (Number(b) || 0) + (Number(a) || 0)
}

// 累计求和（空值视为 0；全部为空返回 null）
const sumRange = (getter, record, key, to) => {
  let hasVal = false
  let sum = 0
  for (let m = 1; m <= to; m++) {
    const v = getter(record, key, m)
    if (v != null && v !== '') {
      hasVal = true
      sum += Number(v)
    }
  }
  return hasVal ? sum : null
}

// ---------- 数字格式化 ----------
const formatValue = (v, group) => {
  if (v == null || v === '') return '-'
  const n = Number(v)
  if (group.isPercent) return `${n.toFixed(2)}%`
  const p = group.precision ?? 2
  return n.toLocaleString('zh-CN', { minimumFractionDigits: p, maximumFractionDigits: p })
}

// 单元格展示值（当期/累计 × 调整前/调整/调整后）
const getCellValue = (group, m, record, dataScope, periodType) => {
  const getter = dataScope === '调整' ? getAdj : dataScope === '调整后' ? getPost : getBase
  if (periodType === '累计') {
    return sumRange(getter, record, group.key, m)
  }
  return getter(record, group.key, m)
}

// 全年合计 / 全年平均列展示值
const getAnnualValue = (group, record, dataScope, periodType) => {
  const getter = dataScope === '调整' ? getAdj : dataScope === '调整后' ? getPost : getBase
  const total = sumRange(getter, record, group.key, 12)
  if (total == null) return null
  if (group.suffix === 'avg') {
    // 全年平均 = 12 个月算术平均（含空的月份按 0）
    return Math.round((total / 12) * 100) / 100
  }
  return total
}

// ---------- 可编辑单元格 ----------
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
        placeholder="调整"
      />
    </td>
  )
}

// ---------- 模拟数据（demo）：量×价公式联动 ----------
const round2 = (v) => Math.round(v * 100) / 100
const rand = (min, max) => min + Math.random() * (max - min)

const generateMockRows = (def, values) => {
  return MOCK_PRODUCTS.map((p, idx) => {
    const row = {
      id: idx + 1,
      entity: ['四川科伦药业', '科伦药物研究院', '四川科伦药业'][idx],
      product_code: p.code,
      product_name: p.name,
      spec: p.spec,
      package_spec: p.package,
      product_type: p.type,
      package_class: p.type,
      unit: p.unit,
      approval_mfr: p.mfr,
      produce_mfr: p.mfr,
      province: ['广东', '四川', '江苏'][idx],
      salesman_lv1: values.salesman_lv1 || '李建国',
      product_owner_hq: '张经理',
      product_owner_region: '李经理',
      analysis_arch: '处方药-输液',
      group_purchase_attr: '非集采',
      group_purchase_batch: '-',
      vat_rate: '13%',
      min_spec_rate: '1',
      sales_mode: values.sales_mode || '',
      business_model: values.business_model || '',
      delivery_mode: '基地直发',
      sales_office: '广州销售办',
      sales_group: '华南一组',
      region_manage: '华南大区',
      salesman_hn: '刘芳',
      deliver_customer: '国药控股广东有限公司',
      pure_customer: '广州医药股份有限公司',
      flow_unit: '广州医药股份有限公司',
      belong_dept: '处方药事业部',
      customer_name: '国药控股广东有限公司',
      goods_class: '肠外营养类',
      hq_promo_pay: '按销量结算',
      hq_rebate_pay: '季度返利',
      service_fee_coef: '0.08',
    }

    // 行级基准价（量×价公式：金额 = 单价 × 销量）
    const base = {
      bidPrice: rand(8, 15),
      salePrice: rand(10, 20),
      purchasePrice: rand(5, 10),
      pointPrice: rand(1, 3),
      serviceFeePrice: rand(2, 4),
      custFeePrice: rand(0.5, 1.5),
    }

    // 第一轮：生成销售量
    const sv = {}
    for (let m = 1; m <= 12; m++) {
      sv[m] = round2(rand(100, 300))
    }

    // 第二轮：按公式生成其余指标
    def.metricGroups.forEach((g) => {
      if (g.key === 'sales_volume') {
        for (let m = 1; m <= 12; m++) {
          row[`sales_volume_m${pad2(m)}`] = sv[m]
          row[`sales_volume_m${pad2(m)}_adj`] = null
        }
        return
      }
      if (g.suffix === 'auto') {
        // 已有值（如增值税销项税率/最小规格转换率/支付口径）保留，否则显示自动取数
        if (row[g.key] == null || row[g.key] === '') row[g.key] = '自动取数'
        return
      }
      for (let m = 1; m <= 12; m++) {
        const key = `${g.key}_m${pad2(m)}`
        let v = null
        const s = sv[m]
        switch (g.key) {
          case 'convert_factor': v = 1; break
          case 'sales_volume_conv': v = round2(s * 1); break
          case 'sales_volume_min_spec': v = round2(s * 1); break
          case 'bid_price': v = round2(base.bidPrice * rand(0.95, 1.05)); break
          case 'bid_amount': v = round2(base.bidPrice * s); break
          case 'unit_price_incl_pre': v = round2(base.salePrice * rand(0.95, 1.05)); break
          case 'revenue_incl_pre': v = round2(base.salePrice * s); break
          case 'revenue_incl_disc': v = round2(base.salePrice * s * 0.05); break
          case 'revenue_incl_post': v = round2(base.salePrice * s * 0.95); break
          case 'revenue_excl_pre': v = round2((base.salePrice * s) / 1.13); break
          case 'revenue_excl_disc': v = round2((base.salePrice * s * 0.05) / 1.13); break
          case 'revenue_excl_post': v = round2((base.salePrice * s * 0.95) / 1.13); break
          case 'purchase_price_incl': v = round2(base.purchasePrice * rand(0.95, 1.05)); break
          case 'purchase_amount_incl': v = round2(base.purchasePrice * s); break
          case 'delivery_point_ratio': v = round2(rand(0.02, 0.08)); break
          case 'hq_region_point_ratio': v = round2(rand(0.02, 0.05)); break
          case 'region_team_point_ratio': v = round2(rand(0.02, 0.05)); break
          case 'point_price': v = round2(base.pointPrice * rand(0.95, 1.05)); break
          case 'market_maintain_point': v = round2(base.pointPrice * s); break
          case 'service_fee_price': v = round2(base.serviceFeePrice * rand(0.95, 1.05)); break
          case 'service_fee_amount': v = round2(base.serviceFeePrice * s); break
          case 'market_maintain_service': v = round2(base.serviceFeePrice * s); break
          case 'avg_assess_price_1': v = round2(rand(8, 12)); break
          case 'latest_assess_price_1': v = round2(rand(8, 12)); break
          case 'service_fee_price_pre': case 'promo_fee_price_pre': case 'rebate_fee_price_pre':
            v = round2(base.custFeePrice * rand(0.95, 1.05)); break
          case 'service_fee_amount_pre': case 'promo_fee_amount_pre': case 'rebate_fee_amount_pre':
            v = round2(base.custFeePrice * s); break
          case 'service_fee_amount_disc': case 'promo_fee_amount_disc': case 'rebate_fee_amount_disc':
            v = round2(base.custFeePrice * s * 0.02); break
          case 'service_fee_amount_post': case 'promo_fee_amount_post': case 'rebate_fee_amount_post':
            v = round2(base.custFeePrice * s * 0.98); break
          case 'market_maintain_cust_pre': v = round2(base.custFeePrice * s * 3); break
          case 'market_maintain_cust_disc': v = round2(base.custFeePrice * s * 3 * 0.02); break
          case 'market_maintain_cust_post': v = round2(base.custFeePrice * s * 3 * 0.98); break
          default: v = round2(rand(10, 50)); break
        }
        row[key] = v
        row[`${key}_adj`] = null
      }
    })
    return row
  })
}

// ---------- 页面组件 ----------
export default function ActualDataPage({ sectionKey }) {
  const def = ACTUAL_DATA_SECTIONS[sectionKey]
  const [form] = Form.useForm()
  const values = Form.useWatch([], form) || {}

  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [periods, setPeriods] = useState({})
  const [periodModalOpen, setPeriodModalOpen] = useState(false)
  const [searchModal, setSearchModal] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  const dataScope = values.data_scope
  const periodType = values.period_type

  // 筛选器分两行：第一行显示 4 个，其余点击「更多」展开
  const FIRST_ROW_COUNT = 4
  const firstRowFilters = def.filters.slice(0, FIRST_ROW_COUNT)
  const hiddenFilters = def.filters.slice(FIRST_ROW_COUNT)
  const hasHiddenFilters = hiddenFilters.length > 0

  // 保存按钮可用条件：数据口径=调整 且 当期/累计=当期
  const canSave = dataScope === '调整' && periodType === '当期'

  // 弹窗查询选项过滤（模糊）
  const searchOptions = useMemo(() => {
    if (!searchModal) return []
    const list = searchModal.filter.options || []
    const kw = (searchKeyword || '').trim().toLowerCase()
    if (!kw) return list
    return list.filter((o) => JSON.stringify(o).toLowerCase().includes(kw))
  }, [searchModal, searchKeyword])

  // ---------- 动态列构建（业务模式/销售模式切换时一次性重渲染） ----------
  const columns = useMemo(() => {
    const cols = []
    // 固定列（含条件显隐）
    def.fixedColumns
      .filter((c) => resolveVisible(c.showWhen, values))
      .forEach((c) => {
        cols.push({ title: c.title, dataIndex: c.key, key: c.key, width: c.width, ellipsis: true })
      })

    // 月度指标组（含条件显隐）
    def.metricGroups
      .filter((g) => resolveVisible(g.showWhen, values))
      .forEach((g) => {
        // 自动取数：单列展示
        if (g.suffix === 'auto') {
          cols.push({
            title: g.title,
            dataIndex: g.key,
            key: g.key,
            width: g.width || 110,
            align: 'right',
            render: (v) => v ?? '-',
          })
          return
        }
        const children = []
        for (let m = 1; m <= 12; m++) {
          const key = `${g.key}_m${pad2(m)}`
          const editable = g.editable && dataScope === '调整' && periodType === '当期' && !!periods[m]
          children.push({
            title: `${m}月`,
            dataIndex: key,
            key,
            width: 86,
            align: 'right',
            render: (v, record) => formatValue(getCellValue(g, m, record, dataScope, periodType), g),
            onCell: g.editable
              ? (record) => ({
                  editable,
                  record,
                  dataIndex: `${key}_adj`,
                  onSave: handleCellSave,
                })
              : undefined,
          })
        }
        children.push({
          title: g.suffix === 'avg' ? '全年平均' : '全年合计',
          dataIndex: `${g.key}_annual`,
          key: `${g.key}_annual`,
          width: 96,
          align: 'right',
          render: (v, record) => formatValue(getAnnualValue(g, record, dataScope, periodType), g),
        })
        cols.push({ title: g.title, key: g.key, children })
      })
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, values, dataScope, periodType, periods])

  // 单元格编辑（仅「销售量-调整」列，且期间打开）
  const handleCellSave = (record, dataIndex, value) => {
    setDataSource((prev) => prev.map((r) => (r.id === record.id ? { ...r, [dataIndex]: value } : r)))
  }

  // ---------- 查询 ----------
  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setDataSource(generateMockRows(def, values))
      setLoading(false)
      message.success('查询完成（demo 模拟数据）')
    }, 400)
  }

  // ---------- 保存（仅打开期间；调整后=调整前+调整 由展示层实时计算） ----------
  const handleSave = () => {
    if (!canSave) return
    const opened = MONTHS.filter((m) => periods[m])
    if (opened.length === 0) {
      message.warning('当前没有打开的期间，请先点击「期间设置」打开月份后再保存')
      return
    }
    if (dataSource.length === 0) {
      message.warning('请先点击「查询」加载数据')
      return
    }
    message.success(
      `保存成功：共 ${dataSource.length} 条记录 × ${opened.length} 个打开期间（${opened.map((m) => `${m}月`).join('、')}）`
    )
  }

  // ---------- 导出（当前查询结果全量 CSV） ----------
  const handleExport = () => {
    if (dataSource.length === 0) {
      message.warning('暂无数据可导出')
      return
    }
    const visibleFixed = def.fixedColumns.filter((c) => resolveVisible(c.showWhen, values))
    const visibleGroups = def.metricGroups.filter((g) => resolveVisible(g.showWhen, values))

    const headers = []
    visibleFixed.forEach((c) => headers.push(c.title))
    visibleGroups.forEach((g) => {
      if (g.suffix === 'auto') {
        headers.push(g.title)
        return
      }
      for (let m = 1; m <= 12; m++) headers.push(`${g.title}-${m}月`)
      headers.push(`${g.title}-${g.suffix === 'avg' ? '全年平均' : '全年合计'}`)
    })

    const rows = dataSource.map((record) => {
      const vals = []
      visibleFixed.forEach((c) => vals.push(record[c.key] ?? ''))
      visibleGroups.forEach((g) => {
        if (g.suffix === 'auto') {
          vals.push(record[g.key] ?? '')
          return
        }
        for (let m = 1; m <= 12; m++) {
          vals.push(formatValue(getCellValue(g, m, record, dataScope, periodType), g))
        }
        vals.push(formatValue(getAnnualValue(g, record, dataScope, periodType), g))
      })
      return vals
    })

    const BOM = '\uFEFF'
    const csvContent =
      BOM + [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${def.title}_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    message.success('导出成功')
  }

  // ---------- 期间设置 ----------
  const openedCount = MONTHS.filter((m) => periods[m]).length

  // ---------- 弹窗查询 ----------
  const openSearchModal = (filter) => {
    setSearchKeyword('')
    setSearchModal(filter)
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
      case 'select': {
        // 2.2/2.3/2.4 业务模式锁定
        if (filter.locked) {
          return <Select size="small" value={filter.defaultValue} disabled className="filter-select" />
        }
        return (
          <Select size="small" placeholder="请选择" allowClear className="filter-select">
            {(filter.options || []).map((o) => (
              <Select.Option key={o} value={o}>{o}</Select.Option>
            ))}
          </Select>
        )
      }
      case 'modalSearch':
        return (
          <Space.Compact style={{ width: '100%' }}>
            <Input size="small" readOnly value={values[filter.key] || ''} placeholder={`请选择${filter.label}`} />
            <Button size="small" icon={<SearchOutlined />} onClick={() => openSearchModal(filter)} />
          </Space.Compact>
        )
      default:
        return null
    }
  }

  // 总部管理团队联动
  const mgmtTypeValue = values.mgmt_type

  return (
    <div className="actual-data-page">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form
          form={form}
          layout="inline"
          className="search-fields"
          initialValues={{
            year: String(new Date().getFullYear()),
            data_scope: '调整前',
            period_type: '当期',
            ...def.filters
              .filter((f) => f.defaultValue !== undefined)
              .reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue }), {}),
          }}
        >
          {firstRowFilters.map((filter) => (
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
          {/* 隐藏筛选器：点击「更多」展开 */}
          {searchExpanded && hiddenFilters.map((filter) => (
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
          {/* 更多/收起按钮 */}
          {hasHiddenFilters && (
            <Button size="small" type="link" onClick={() => setSearchExpanded(!searchExpanded)}>
              {searchExpanded ? '收起' : '更多'}
              {searchExpanded ? <UpOutlined /> : <DownOutlined />}
            </Button>
          )}
          <Button size="small" icon={<SettingOutlined />} onClick={() => setPeriodModalOpen(true)}>
            期间设置{openedCount > 0 && <Tag color="green" style={{ marginLeft: 4 }}>{openedCount}月开</Tag>}
          </Button>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          <Button size="small" icon={<ImportOutlined />} onClick={() => setImportModalOpen(true)}>导入</Button>
          <Button size="small" icon={<SaveOutlined />} disabled={!canSave} onClick={handleSave}>保存</Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
        </div>
      </div>

      {/* 章节标识 */}
      <div className="section-bar">
        <Tag color="blue">第 {def.section} 章 {def.title}</Tag>
        {def.section === '2.5' && (
          <span className="section-tip">数字营销模式与城市连锁模式共用本页面，业务模式字段在筛选条件中切换，列集合随业务模式动态显隐</span>
        )}
        {def.section === '2.1' && (
          <span className="section-tip">片区直营与片区招商/城市连锁的「点位费类 / 客户费用类」指标列互斥显隐</span>
        )}
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

      {/* 期间设置弹窗 */}
      <Modal
        title="期间设置（维护实际数期间）"
        open={periodModalOpen}
        onCancel={() => setPeriodModalOpen(false)}
        footer={
          <Button type="primary" size="small" onClick={() => setPeriodModalOpen(false)}>确定</Button>
        }
        width={560}
      >
        <p className="period-tip">
          维护实际数期间默认<b>关闭</b>；打开某月后，对应月份的「销售量-调整」列才允许编辑（需配合 数据口径=调整、当期/累计=当期）。
        </p>
        <div className="period-grid">
          {MONTHS.map((m) => (
            <div key={m} className={`period-item ${periods[m] ? 'opened' : ''}`}>
              <span className="period-month">{m}月</span>
              <Switch
                size="small"
                checked={!!periods[m]}
                onChange={(v) => setPeriods((p) => ({ ...p, [m]: v }))}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* 弹窗查询（一级业务员 / 一级客商） */}
      <Modal
        title={`选择${searchModal ? searchModal.label : ''}`}
        open={!!searchModal}
        onCancel={() => setSearchModal(null)}
        footer={null}
        width={520}
      >
        <Input.Search
          placeholder={`输入关键字模糊查询${searchModal ? searchModal.label : ''}`}
          allowClear
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Table
          size="small"
          rowKey="id"
          dataSource={searchOptions}
          pagination={{ pageSize: 5, size: 'small' }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: searchModal && values[searchModal.key] ? searchOptions.filter((o) => o.name === values[searchModal.key]).map((o) => o.id) : [],
            onChange: (keys, rows) => {
              if (rows.length > 0) {
                form.setFieldValue(searchModal.key, rows[0].name)
                setSearchModal(null)
                message.success(`已选择：${rows[0].name}`)
              }
            },
          }}
          columns={[
            { title: '编码', dataIndex: 'id', width: 90 },
            { title: '名称', dataIndex: 'name' },
            ...(searchModal && searchModal.filter.key === 'salesman_lv1'
              ? [{ title: '实体', dataIndex: 'entity', width: 130 }, { title: '省份', dataIndex: 'province', width: 80 }]
              : []),
          ]}
        />
      </Modal>

      {/* 导入弹窗：模板在共享飞书表格 */}
      <Modal
        title="导入实际数"
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={
          <Space>
            <Button size="small" icon={<LinkOutlined />} onClick={() => window.open(IMPORT_TEMPLATE_URL, '_blank')}>
              打开导入/导出模板（飞书表格）
            </Button>
            <Button type="primary" size="small" onClick={() => setImportModalOpen(false)}>关闭</Button>
          </Space>
        }
        width={520}
      >
        <p className="import-tip">
          1. 请前往共享飞书表格「导入/导出模板」下载对应章节模板；<br />
          2. 按模板填写数据后上传 Excel；系统将校验并<b>仅更新打开期间的数据</b>；<br />
          3. demo 阶段暂未开放上传，模板下载请点击右下角按钮。
        </p>
      </Modal>
    </div>
  )
}
