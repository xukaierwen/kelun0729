import { useState, useMemo, useEffect } from 'react'
import { Form, Select, Button, Space, Table, Input, Modal, InputNumber, TreeSelect, Tag, message } from 'antd'
import {
  SearchOutlined,
  SaveOutlined,
  ImportOutlined,
  ExportOutlined,
  LinkOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import {
  PLANNED_COMPLETE_SECTIONS,
  YEAR_OPTIONS,
  MGMT_TEAM_MAP,
  PERIOD_TYPE_OPTIONS,
  IMPORT_TEMPLATE_URL,
} from './plannedCompleteDefs'
import { MOCK_PRODUCTS } from './actualDataDefs'
import './ActualDataPage.css'

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)
const pad2 = (n) => String(n).padStart(2, '0')

// ---------- 显隐条件解析：showWhen = { field, includesAny: [...] } ----------
// 多选字段未选择（空）时展示全部
const resolveVisible = (cond, values) => {
  if (!cond) return true
  if (cond.field && Array.isArray(cond.includesAny)) {
    const v = values[cond.field]
    if (!v || v.length === 0) return true
    return v.some((x) => cond.includesAny.includes(x))
  }
  return true
}

// ---------- 数值读取 ----------
const num = (v) => (v == null || v === '' ? 0 : Number(v))
const round2 = (v) => Math.round(v * 100) / 100
const rand = (min, max) => min + Math.random() * (max - min)

// 格式展示
const formatValue = (v) => (v == null || v === '' ? '-' : Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

// ---------- 可编辑单元格（销售量-预计调整数（变化值）-12月） ----------
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
      />
    </td>
  )
}

// ---------- 模拟数据生成（demo） ----------
const generateMockRows = (def) => {
  return MOCK_PRODUCTS.map((p, idx) => {
    const row = {
      id: idx + 1,
      entity: ['四川科伦药业', '科伦药物研究院', '四川科伦药业'][idx],
      belong_dept: '处方药事业部',
      product_owner_hq: '张经理',
      product_owner_region: '李经理',
      province: ['广东', '四川', '江苏'][idx],
      salesman_lv1: '李建国',
      sales_office: '广州销售办',
      sales_group: '华南一组',
      region_manage: '华南大区',
      salesman_hn: '刘芳',
      deliver_customer: '国药控股广东有限公司',
      pure_customer: '广州医药股份有限公司',
      flow_unit: '广州医药股份有限公司',
      customer_name: '国药控股广东有限公司',
      goods_class: '肠外营养类',
      sales_mode: '片区直营',
      delivery_mode: '基地直发',
      product_code: p.code,
      product_name: p.name,
      spec: p.spec,
      package_spec: p.package,
      product_type: p.type,
      package_class: p.type,
      unit: p.unit,
      approval_mfr: p.mfr,
      produce_mfr: p.mfr,
      analysis_arch: '处方药-输液',
      group_purchase_attr: '非集采',
      group_purchase_batch: '-',
      vat_rate: 0.13,
      min_spec_rate: 1,
      service_fee_coef: '0.08',
    }

    // 基准价
    const base = {
      bidPrice: rand(8, 15),
      salePrice: rand(10, 20),
      purchasePrice: rand(5, 10),
      pointPrice: rand(1, 3),
      serviceFeePrice: rand(2, 4),
      custFeePrice: rand(0.5, 1.5),
    }

    // 第一轮：生成销售量特殊结构（4 大分组）
    // 实际数-调整后：1-9 月 + 全年合计
    let actualTotal = 0
    for (let m = 1; m <= 9; m++) {
      const v = round2(rand(100, 300))
      row[`sales_volume_actual_m${pad2(m)}`] = v
      actualTotal += v
    }
    row.sales_volume_actual_total = round2(actualTotal)

    // 预算调整 6+6 数：1-6 月调整前 + 1-6 月调整后
    for (let m = 1; m <= 6; m++) {
      row[`sales_volume_budget_pre_m${pad2(m)}`] = round2(rand(100, 300))
      row[`sales_volume_budget_post_m${pad2(m)}`] = round2(rand(100, 300))
    }

    // 预计调整数（变化值）：1-12 月 + 全年合计
    const plan = []
    for (let m = 1; m <= 12; m++) {
      const v = round2(rand(100, 300))
      plan.push(v)
      row[`sales_volume_plan_m${pad2(m)}`] = v
    }
    row.sales_volume_plan_total = round2(plan.reduce((s, v) => s + v, 0))
    row.sales_volume_total = row.sales_volume_plan_total

    // 第二轮：按指标组生成其余指标
    def.metricGroups.forEach((g) => {
      if (g.structure === 'salesVolume' || g.structure === 'auto') return
      const isChange = g.structure === 'change' || g.structure === 'changeOnly'
      const hasTotal = g.structure === 'change' || g.structure === 'total'
      for (let m = 1; m <= 12; m++) {
        let v = null
        switch (g.key) {
          case 'convert_factor': v = 1; break
          case 'sales_volume_conv': v = round2(plan[m - 1] * 1); break
          case 'sales_volume_min_spec': v = round2(plan[m - 1] * 1); break
          case 'bid_price': v = round2(base.bidPrice * rand(0.95, 1.05)); break
          case 'bid_amount': v = round2(plan[m - 1] * base.bidPrice); break
          case 'unit_price_incl_pre': v = round2(base.salePrice * rand(0.95, 1.05)); break
          case 'revenue_incl_pre': v = round2(plan[m - 1] * base.salePrice); break
          case 'revenue_incl_disc': v = round2(plan[m - 1] * base.salePrice * 0.05); break
          case 'revenue_incl_post': v = round2(plan[m - 1] * base.salePrice * 0.95); break
          case 'revenue_excl_pre': v = round2((plan[m - 1] * base.salePrice) / 1.13); break
          case 'revenue_excl_disc': v = round2((plan[m - 1] * base.salePrice * 0.05) / 1.13); break
          case 'revenue_excl_post': v = round2((plan[m - 1] * base.salePrice * 0.95) / 1.13); break
          case 'purchase_price_incl': v = round2(base.purchasePrice * rand(0.95, 1.05)); break
          case 'purchase_amount_incl': v = round2(plan[m - 1] * base.purchasePrice); break
          case 'delivery_point_ratio': v = round2(rand(0.02, 0.08)); break
          case 'hq_region_point_ratio': case 'region_team_point_ratio': case 'hq_team_point_ratio':
            v = round2(rand(0.02, 0.05)); break
          case 'point_price': v = round2(base.pointPrice * rand(0.95, 1.05)); break
          case 'market_maintain_point': v = round2(plan[m - 1] * base.pointPrice); break
          case 'cust_point_fee': v = round2(base.pointPrice * rand(0.95, 1.05)); break
          case 'service_fee_price': v = round2(base.serviceFeePrice * rand(0.95, 1.05)); break
          case 'service_fee_amount': v = round2(plan[m - 1] * base.serviceFeePrice); break
          case 'service_fee_price_pre': case 'promo_fee_price_pre': case 'rebate_fee_price_pre':
            v = round2(base.custFeePrice * rand(0.95, 1.05)); break
          case 'service_fee_amount_pre': case 'promo_fee_amount_pre': case 'rebate_fee_amount_pre':
            v = round2(base.custFeePrice * plan[m - 1]); break
          case 'service_fee_amount_disc': case 'promo_fee_amount_disc': case 'rebate_fee_amount_disc':
            v = round2(base.custFeePrice * plan[m - 1] * 0.02); break
          case 'service_fee_amount_post': case 'promo_fee_amount_post': case 'rebate_fee_amount_post':
            v = round2(base.custFeePrice * plan[m - 1] * 0.98); break
          case 'market_maintain_cust_pre': v = round2(base.custFeePrice * plan[m - 1] * 3); break
          case 'market_maintain_cust_disc': v = round2(base.custFeePrice * plan[m - 1] * 3 * 0.02); break
          case 'market_maintain_cust_post': v = round2(base.custFeePrice * plan[m - 1] * 3 * 0.98); break
          case 'avg_assess_price_1': case 'latest_assess_price_1':
            v = round2(rand(8, 12)); break
          default: v = round2(rand(10, 50)); break
        }
        row[`${g.key}_m${pad2(m)}`] = v
        if (isChange) row[`${g.key}_change`] = 0
      }
      if (hasTotal) {
        row[`${g.key}_total`] = round2(MONTHS.reduce((s, m) => s + num(row[`${g.key}_m${pad2(m)}`]), 0))
      }
    })
    return row
  })
}

// ---------- 保存自动计算（22 条逻辑；仅对当前 Tab 存在的字段生效） ----------
const applyCalcRules = (record) => {
  const plan = (m) => num(record[`sales_volume_plan_m${pad2(m)}`])
  // 重新计算全年合计（含编辑后的 12 月），并同步销售量-全年合计
  const planTotal = MONTHS.reduce((s, m) => s + plan(m), 0)
  const row = {
    ...record,
    sales_volume_plan_total: round2(planTotal),
    sales_volume_total: round2(planTotal),
  }

  // 全年平均单价（1-12 月算术平均，用于单价类 monthly 字段）
  const avgMonthly = (key) => {
    let sum = 0
    for (let m = 1; m <= 12; m++) sum += num(row[`${key}_m${pad2(m)}`])
    return sum / 12
  }
  // 折扣单价 = 1-12 月金额 / 1-12 月销量（平均价）
  const discPrice = (key) => {
    let amount = 0
    let vol = 0
    for (let m = 1; m <= 12; m++) {
      amount += num(row[`${key}_m${pad2(m)}`])
      vol += num(row[`sales_volume_m${pad2(m)}`])
    }
    return vol > 0 ? amount / vol : 0
  }

  const bidPrice = num(row.bid_price_total)
  const unitPrice = num(row.unit_price_incl_pre_total)
  const pointPrice = num(row.point_price_total)
  const purchasePrice = num(row.purchase_price_incl_total)
  const vatRate = num(row.vat_rate)
  const minSpecRate = num(row.min_spec_rate)

  // 基准变化值（12 月 + 全年合计）
  const convM12 = plan(12) * num(row.convert_factor_m12)
  const convTotal = MONTHS.reduce((s, m) => s + plan(m) * num(row[`convert_factor_m${pad2(m)}`]), 0)

  const calcChange = (key, m12Val, totalVal) => {
    row[`${key}_change`] = 0
    row[`${key}_m12`] = round2(m12Val)
    row[`${key}_total`] = round2(totalVal)
  }

  // 销售量-转换后 / 销售量-最小规格
  calcChange('sales_volume_conv', convM12, convTotal)
  calcChange('sales_volume_min_spec', plan(12) * minSpecRate, planTotal * minSpecRate)

  // 中标/交易金额
  calcChange('bid_amount', plan(12) * bidPrice, planTotal * bidPrice)

  // 销售收入-含税（折前）
  calcChange('revenue_incl_pre', plan(12) * unitPrice, planTotal * unitPrice)
  // 销售收入-含税（折后）= 折前 + 折扣
  calcChange(
    'revenue_incl_post',
    num(row.revenue_incl_pre_m12) + num(row.revenue_incl_disc_m12),
    num(row.revenue_incl_pre_total) + num(row.revenue_incl_disc_total)
  )
  // 销售收入-不含税（折前）= 含税折前 / (1+税率)
  calcChange(
    'revenue_excl_pre',
    num(row.revenue_incl_pre_m12) / (1 + vatRate),
    num(row.revenue_incl_pre_total) / (1 + vatRate)
  )
  // 销售收入-不含税（折后）= 不含税折前 + 不含税折扣
  calcChange(
    'revenue_excl_post',
    num(row.revenue_excl_pre_m12) + num(row.revenue_excl_disc_m12),
    num(row.revenue_excl_pre_total) + num(row.revenue_excl_disc_total)
  )

  // 市场维护费-点位费（销量 × 全年合计/平均点位费单价）
  if (row.market_maintain_point_total != null) {
    calcChange('market_maintain_point', plan(12) * pointPrice, planTotal * pointPrice)
  }

  // 客户费用（片区招商/城市连锁限定）
  const feeKeys = ['service_fee', 'promo_fee', 'rebate_fee']
  feeKeys.forEach((fee) => {
    const pre = `${fee}_amount_pre`
    const disc = `${fee}_amount_disc`
    const post = `${fee}_amount_post`
    if (row[`${pre}_total`] != null) {
      // 折前：销量 × 全年平均单价-折前
      const avgPre = avgMonthly(`${fee}_price_pre`)
      calcChange(pre, plan(12) * avgPre, planTotal * avgPre)
      // 折扣：销量 × 折扣单价（1-12 月金额/1-12 月销量平均价）
      const dPrice = discPrice(disc)
      calcChange(disc, plan(12) * dPrice, planTotal * dPrice)
      // 折后 = 折前 + 折扣
      calcChange(post, num(row[`${pre}_m12`]) + num(row[`${disc}_m12`]), num(row[`${pre}_total`]) + num(row[`${disc}_total`]))
    }
    if (row[`market_maintain_cust_pre_total`] != null) {
      const sum = (suffix, m12Getter, totalGetter) => {
        const m12 = feeKeys.reduce((s, f) => s + num(row[`${f}_amount_${suffix}_m12`]), 0)
        const total = feeKeys.reduce((s, f) => s + num(row[`${f}_amount_${suffix}_total`]), 0)
        return { m12, total }
      }
      calcChange(`market_maintain_cust_pre`, sum('pre').m12, sum('pre').total)
      calcChange(`market_maintain_cust_disc`, sum('disc').m12, sum('disc').total)
      calcChange(`market_maintain_cust_post`, sum('post').m12, sum('post').total)
    }
  })

  // 采购金额-含税（销量 × 全年合计采购单价-含税）
  if (row.purchase_amount_incl_total != null) {
    calcChange('purchase_amount_incl', plan(12) * purchasePrice, planTotal * purchasePrice)
  }

  return row
}

// ---------- 页面组件 ----------
export default function PlannedCompleteTable({ sectionKey }) {
  const def = PLANNED_COMPLETE_SECTIONS[sectionKey]
  const [form] = Form.useForm()
  const values = Form.useWatch([], form) || {}

  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [searchModal, setSearchModal] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedSalesman, setSelectedSalesman] = useState([])
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  // 默认筛选值（挂载 / Tab 切换时应用）
  const defaultValues = {
    year: String(new Date().getFullYear()),
    period_type: '当期',
    sales_mode: [],
    ...def.filters
      .filter((f) => f.defaultValue !== undefined)
      .reduce((acc, f) => ({ ...acc, [f.key]: f.defaultValue }), {}),
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(defaultValues)
    setLoading(false)
    setDataSource([])
    setSearchModal(null)
    setSearchKeyword('')
    setSelectedSalesman([])
    setImportModalOpen(false)
    setSearchExpanded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey])

  // 筛选器分两行：第一行显示 4 个，其余点击「更多」展开
  const FIRST_ROW_COUNT = 4
  const firstRowFilters = def.filters.slice(0, FIRST_ROW_COUNT)
  const hiddenFilters = def.filters.slice(FIRST_ROW_COUNT)
  const hasHiddenFilters = hiddenFilters.length > 0

  // 弹窗查询选项过滤（模糊）
  const searchOptions = useMemo(() => {
    if (!searchModal) return []
    const list = searchModal.options || []
    const kw = (searchKeyword || '').trim().toLowerCase()
    if (!kw) return list
    return list.filter((o) => JSON.stringify(o).toLowerCase().includes(kw))
  }, [searchModal, searchKeyword])

  // ---------- 动态列构建 ----------
  const columns = useMemo(() => {
    const cols = []
    // 固定列（单列展示，含条件显隐）
    def.fixedColumns
      .filter((c) => resolveVisible(c.showWhen, values))
      .forEach((c) => {
        cols.push({ title: c.title, dataIndex: c.key, key: c.key, width: c.width, ellipsis: true })
      })

    def.metricGroups
      .filter((g) => resolveVisible(g.showWhen, values))
      .forEach((g) => {
        // 销售量特殊结构（4 大分组）
        if (g.structure === 'salesVolume') {
          cols.push({
            title: g.title,
            key: g.key,
            children: [
              {
                title: '实际数-调整后',
                key: 'actual',
                children: [
                  ...Array.from({ length: 9 }, (_, i) => ({
                    title: `${i + 1}月`,
                    dataIndex: `sales_volume_actual_m${pad2(i + 1)}`,
                    key: `sales_volume_actual_m${pad2(i + 1)}`,
                    width: 76,
                    align: 'right',
                    render: formatValue,
                  })),
                  { title: '全年合计', dataIndex: 'sales_volume_actual_total', key: 'sales_volume_actual_total', width: 90, align: 'right', render: formatValue },
                ],
              },
              {
                title: '预算调整 6+6 数',
                key: 'budget',
                children: [
                  ...Array.from({ length: 6 }, (_, i) => ({
                    title: `${i + 1}月-调整前`,
                    dataIndex: `sales_volume_budget_pre_m${pad2(i + 1)}`,
                    key: `sales_volume_budget_pre_m${pad2(i + 1)}`,
                    width: 92,
                    align: 'right',
                    render: formatValue,
                  })),
                  ...Array.from({ length: 6 }, (_, i) => ({
                    title: `${i + 1}月-调整后`,
                    dataIndex: `sales_volume_budget_post_m${pad2(i + 1)}`,
                    key: `sales_volume_budget_post_m${pad2(i + 1)}`,
                    width: 92,
                    align: 'right',
                    render: formatValue,
                  })),
                ],
              },
              {
                title: '预计调整数（变化值）',
                key: 'plan',
                children: [
                  ...Array.from({ length: 12 }, (_, i) => {
                    const m = i + 1
                    const dataIndex = `sales_volume_plan_m${pad2(m)}`
                    const editable = m === 12
                    return {
                      title: `${m}月`,
                      dataIndex,
                      key: dataIndex,
                      width: 76,
                      align: 'right',
                      render: formatValue,
                      onCell: editable ? (record) => ({ editable, record, dataIndex, onSave: handleCellSave }) : undefined,
                    }
                  }),
                  { title: '全年合计', dataIndex: 'sales_volume_plan_total', key: 'sales_volume_plan_total', width: 90, align: 'right', render: formatValue },
                ],
              },
              {
                title: '全年合计',
                key: 'total',
                children: [
                  { title: '全年合计', dataIndex: 'sales_volume_total', key: 'sales_volume_total', width: 90, align: 'right', render: formatValue },
                ],
              },
            ],
          })
          return
        }

        // 自动取数：单列展示
        if (g.structure === 'auto') {
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

        // 月度指标：1-12 月 + 可选「变化值」 + 可选「全年合计」
        const isChange = g.structure === 'change' || g.structure === 'changeOnly'
        const hasTotal = g.structure === 'change' || g.structure === 'total'
        const children = MONTHS.map((m) => ({
          title: `${m}月`,
          dataIndex: `${g.key}_m${pad2(m)}`,
          key: `${g.key}_m${pad2(m)}`,
          width: 76,
          align: 'right',
          render: formatValue,
        }))
        if (isChange) {
          children.push({
            title: '变化值',
            dataIndex: `${g.key}_change`,
            key: `${g.key}_change`,
            width: 86,
            align: 'right',
            render: formatValue,
          })
        }
        if (hasTotal) {
          children.push({
            title: '全年合计',
            dataIndex: `${g.key}_total`,
            key: `${g.key}_total`,
            width: 90,
            align: 'right',
            render: formatValue,
          })
        }
        cols.push({ title: g.title, key: g.key, children })
      })
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, values])

  // 单元格编辑（销售量-预计调整数（变化值）-12月）
  const handleCellSave = (record, dataIndex, value) => {
    setDataSource((prev) => prev.map((r) => (r.id === record.id ? { ...r, [dataIndex]: value } : r)))
  }

  // ---------- 查询 ----------
  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setDataSource(generateMockRows(def))
      setLoading(false)
      message.success('查询完成（demo 模拟数据）')
    }, 400)
  }

  // ---------- 保存（按 22 条/8 条计算逻辑联动） ----------
  const handleSave = () => {
    if (dataSource.length === 0) {
      message.warning('请先点击「查询」加载数据')
      return
    }
    const updated = dataSource.map((r) => applyCalcRules(r))
    setDataSource(updated)
    message.success(`保存成功：共 ${updated.length} 条记录，已按计算逻辑更新「预计调整数-12月」及「全年合计」列`)
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
      if (g.structure === 'auto') {
        headers.push(g.title)
        return
      }
      if (g.structure === 'salesVolume') {
        headers.push('销售量-实际数-调整后-1月', ...Array.from({ length: 8 }, (_, i) => `销售量-实际数-调整后-${i + 2}月`), '销售量-实际数-调整后-全年合计')
        headers.push(...Array.from({ length: 6 }, (_, i) => `销售量-预算调整-${i + 1}月-调整前`), ...Array.from({ length: 6 }, (_, i) => `销售量-预算调整-${i + 1}月-调整后`))
        headers.push(...Array.from({ length: 12 }, (_, i) => `销售量-预计调整数-${i + 1}月`), '销售量-预计调整数-全年合计')
        headers.push('销售量-全年合计')
        return
      }
      for (let m = 1; m <= 12; m++) headers.push(`${g.title}-${m}月`)
      if (g.structure === 'change' || g.structure === 'changeOnly') headers.push(`${g.title}-变化值`)
      if (g.structure === 'change' || g.structure === 'total') headers.push(`${g.title}-全年合计`)
    })

    const rows = dataSource.map((record) => {
      const vals = []
      visibleFixed.forEach((c) => vals.push(record[c.key] ?? ''))
      visibleGroups.forEach((g) => {
        if (g.structure === 'auto') {
          vals.push(record[g.key] ?? '')
          return
        }
        if (g.structure === 'salesVolume') {
          for (let m = 1; m <= 9; m++) vals.push(record[`sales_volume_actual_m${pad2(m)}`] ?? '')
          vals.push(record.sales_volume_actual_total ?? '')
          for (let m = 1; m <= 6; m++) vals.push(record[`sales_volume_budget_pre_m${pad2(m)}`] ?? '')
          for (let m = 1; m <= 6; m++) vals.push(record[`sales_volume_budget_post_m${pad2(m)}`] ?? '')
          for (let m = 1; m <= 12; m++) vals.push(record[`sales_volume_plan_m${pad2(m)}`] ?? '')
          vals.push(record.sales_volume_plan_total ?? '')
          vals.push(record.sales_volume_total ?? '')
          return
        }
        for (let m = 1; m <= 12; m++) vals.push(record[`${g.key}_m${pad2(m)}`] ?? '')
        if (g.structure === 'change' || g.structure === 'changeOnly') vals.push(record[`${g.key}_change`] ?? '')
        if (g.structure === 'change' || g.structure === 'total') vals.push(record[`${g.key}_total`] ?? '')
      })
      return vals
    })

    const BOM = '\uFEFF'
    const csvContent =
      BOM + [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `预计完成数-${def.title}_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    message.success('导出成功')
  }

  // ---------- 弹窗查询（一级业务员，多选） ----------
  const openSearchModal = (filter) => {
    setSearchKeyword('')
    setSelectedSalesman(values[filter.key] || [])
    setSearchModal(filter)
  }

  const confirmSalesman = () => {
    form.setFieldValue(searchModal.key, selectedSalesman)
    message.success(`已选择 ${selectedSalesman.length} 个一级业务员`)
    setSearchModal(null)
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
        if (filter.locked) {
          return <Select size="small" value={filter.defaultValue} disabled className="filter-select" />
        }
        const mode = filter.multiple ? 'multiple' : undefined
        const props = filter.multiple ? { maxTagCount: 2, allowClear: true } : { allowClear: true }
        return (
          <Select size="small" placeholder={filter.multiple ? '可多选' : '请选择'} mode={mode} {...props} className="filter-select">
            {(filter.options || []).map((o) => (
              <Select.Option key={o} value={o}>{o}</Select.Option>
            ))}
          </Select>
        )
      }
      case 'treeSelect':
        return (
          <TreeSelect
            size="small"
            placeholder="请选择"
            allowClear
            showSearch
            treeDefaultExpandAll
            treeData={filter.options}
            className="filter-select"
            style={{ minWidth: 160 }}
          />
        )
      case 'modalSearch':
        return (
          <Space.Compact style={{ width: '100%' }}>
            <Input size="small" readOnly value={((values[filter.key] || [])).join('、')} placeholder={`请选择${filter.label}`} style={{ minWidth: 120 }} />
            <Button size="small" icon={<SearchOutlined />} onClick={() => openSearchModal(filter)} />
          </Space.Compact>
        )
      default:
        return null
    }
  }

  const mgmtTypeValue = values.mgmt_type

  return (
    <div className="actual-data-page">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form
          form={form}
          layout="inline"
          className="search-fields"
          initialValues={defaultValues}
        >
          {firstRowFilters.map((filter) => (
            <Form.Item key={filter.key} label={filter.label} name={filter.key} className="search-field-item">
              {filter.type === 'select' && filter.dependsOn === 'mgmt_type' ? (
                <Select
                  size="small"
                  placeholder="可多选"
                  mode={filter.multiple ? 'multiple' : undefined}
                  maxTagCount={2}
                  allowClear
                  className="filter-select"
                >
                  {((mgmtTypeValue || []).flatMap((t) => MGMT_TEAM_MAP[t] || [])).map((t) => (
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
                <Select
                  size="small"
                  placeholder="可多选"
                  mode={filter.multiple ? 'multiple' : undefined}
                  maxTagCount={2}
                  allowClear
                  className="filter-select"
                >
                  {((mgmtTypeValue || []).flatMap((t) => MGMT_TEAM_MAP[t] || [])).map((t) => (
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
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          <Button size="small" icon={<ImportOutlined />} onClick={() => setImportModalOpen(true)}>导入</Button>
          <Button size="small" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
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

      {/* 弹窗查询（一级业务员，多选） */}
      <Modal
        title={`选择${searchModal ? searchModal.label : ''}（可多选）`}
        open={!!searchModal}
        onCancel={() => setSearchModal(null)}
        footer={
          <Space>
            <Button size="small" onClick={() => setSearchModal(null)}>取消</Button>
            <Button type="primary" size="small" onClick={confirmSalesman}>确定</Button>
          </Space>
        }
        width={560}
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
            type: 'checkbox',
            selectedRowKeys: searchModal ? selectedSalesman.map((name) => (searchModal.options.find((o) => o.name === name) || {}).id) : [],
            onChange: (keys) => {
              const rows = (searchModal.options || []).filter((o) => keys.includes(o.id))
              setSelectedSalesman(rows.map((o) => o.name))
            },
          }}
          columns={[
            { title: '编码', dataIndex: 'id', width: 90 },
            { title: '名称', dataIndex: 'name' },
            { title: '实体', dataIndex: 'entity', width: 130 },
            { title: '省份', dataIndex: 'province', width: 80 },
          ]}
        />
      </Modal>

      {/* 导入弹窗：模板在共享飞书表格 */}
      <Modal
        title="导入预计完成数"
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
          1. 请前往共享飞书表格「导入/导出模板」下载对应模式模板；<br />
          2. 按模板填写数据后上传 Excel；系统将校验并<b>仅更新「预计调整数（变化值）-12月」及联动列</b>；<br />
          3. demo 阶段暂未开放上传，模板下载请点击右下角按钮。
        </p>
      </Modal>
    </div>
  )
}
