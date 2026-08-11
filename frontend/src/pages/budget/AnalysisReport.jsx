import { useState, useMemo } from 'react'
import { Card, Row, Col, Statistic, Table, Button, Select, Form, message, Tabs, Tag, Progress } from 'antd'
import {
  SearchOutlined, ExportOutlined, BarChartOutlined,
  ArrowUpOutlined, ArrowDownOutlined, DollarOutlined,
  PieChartOutlined, LineChartOutlined, FundOutlined,
} from '@ant-design/icons'

// KPI 指标卡配置
const KPI_CARDS = [
  {
    title: '销售收入（万元）',
    value: 128560.32,
    prefix: '¥',
    color: '#1677ff',
    trend: 12.5,
    icon: <DollarOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
    bg: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
  },
  {
    title: '预算完成率',
    value: 87.6,
    suffix: '%',
    color: '#52c41a',
    trend: 3.2,
    icon: <PieChartOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
    bg: 'linear-gradient(135deg, #f6ffed 0%, #fcffe6 100%)',
  },
  {
    title: '费用执行率',
    value: 72.4,
    suffix: '%',
    color: '#faad14',
    trend: -1.8,
    icon: <FundOutlined style={{ fontSize: 28, color: '#faad14' }} />,
    bg: 'linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%)',
  },
  {
    title: '毛利率',
    value: 63.8,
    suffix: '%',
    color: '#722ed1',
    trend: 0.5,
    icon: <LineChartOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
    bg: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
  },
]

// 销售预实对比模拟数据
const SALES_COMPARE_DATA = [
  { key: '1', month: '1月', budget: 9800, actual: 10200, diff: 400, rate: 104.1 },
  { key: '2', month: '2月', budget: 8500, actual: 8900, diff: 400, rate: 104.7 },
  { key: '3', month: '3月', budget: 11200, actual: 10800, diff: -400, rate: 96.4 },
  { key: '4', month: '4月', budget: 10500, actual: 11300, diff: 800, rate: 107.6 },
  { key: '5', month: '5月', budget: 12000, actual: 11500, diff: -500, rate: 95.8 },
  { key: '6', month: '6月', budget: 13500, actual: 14200, diff: 700, rate: 105.2 },
]

// 费用预实对比模拟数据
const EXPENSE_COMPARE_DATA = [
  { key: '1', month: '1月', budget: 3200, actual: 3050, diff: -150, rate: 95.3 },
  { key: '2', month: '2月', budget: 2800, actual: 2950, diff: 150, rate: 105.4 },
  { key: '3', month: '3月', budget: 3500, actual: 3380, diff: -120, rate: 96.6 },
  { key: '4', month: '4月', budget: 3100, actual: 3250, diff: 150, rate: 104.8 },
  { key: '5', month: '5月', budget: 3800, actual: 3600, diff: -200, rate: 94.7 },
  { key: '6', month: '6月', budget: 4000, actual: 4150, diff: 150, rate: 103.8 },
]

// 片区销售对比模拟数据
const REGION_COMPARE_DATA = [
  { key: '1', region: '南区', budget: 35000, actual: 37200, diff: 2200, rate: 106.3 },
  { key: '2', region: '北区', budget: 32000, actual: 30800, diff: -1200, rate: 96.3 },
  { key: '3', region: '东区', budget: 28000, actual: 29500, diff: 1500, rate: 105.4 },
  { key: '4', region: '西区', budget: 22000, actual: 21000, diff: -1000, rate: 95.5 },
  { key: '5', region: '数字营销', budget: 11560, actual: 10060, diff: -1500, rate: 87.0 },
]

// 产品TOP10模拟数据
const PRODUCT_TOP10 = [
  { key: '1', rank: 1, name: '注射用紫杉醇(白蛋白结合型)', sales: 8520, rate: 112.3 },
  { key: '2', rank: 2, name: '注射用吉西他滨', sales: 6340, rate: 98.7 },
  { key: '3', rank: 3, name: '奥沙利铂注射液', sales: 5890, rate: 105.2 },
  { key: '4', rank: 4, name: '注射用培美曲塞', sales: 5120, rate: 92.1 },
  { key: '5', rank: 5, name: '多西他赛注射液', sales: 4780, rate: 108.6 },
  { key: '6', rank: 6, name: '盐酸伊立替康注射液', sales: 4350, rate: 96.8 },
  { key: '7', rank: 7, name: '注射用伏美替尼', sales: 3920, rate: 115.4 },
  { key: '8', rank: 8, name: '醋酸阿比特龙片', sales: 3680, rate: 101.2 },
  { key: '9', rank: 9, name: '甲磺酸阿帕替尼片', sales: 3210, rate: 88.5 },
  { key: '10', rank: 10, name: '注射用卡瑞利珠单抗', sales: 2980, rate: 103.7 },
]

export default function AnalysisReport() {
  const [searchForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('sales')

  // 查询
  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success('查询完成')
    }, 500)
  }

  // 导出
  const handleExport = () => {
    message.success('导出功能开发中')
  }

  // 销售对比列
  const salesColumns = useMemo(() => [
    { title: '月份', dataIndex: 'month', key: 'month', width: 80, fixed: 'left' },
    {
      title: '预算数（万元）', dataIndex: 'budget', key: 'budget', width: 130, align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: '实际数（万元）', dataIndex: 'actual', key: 'actual', width: 130, align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: '差异（万元）', dataIndex: 'diff', key: 'diff', width: 120, align: 'right',
      render: v => (
        <span style={{ color: v >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          {v >= 0 ? '+' : ''}{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: '完成率', dataIndex: 'rate', key: 'rate', width: 110, align: 'center',
      render: v => (
        <Tag color={v >= 100 ? 'green' : v >= 90 ? 'orange' : 'red'}>
          {v.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.rate - b.rate,
    },
  ], [])

  // 费用对比列
  const expenseColumns = useMemo(() => [
    { title: '月份', dataIndex: 'month', key: 'month', width: 80, fixed: 'left' },
    {
      title: '预算数（万元）', dataIndex: 'budget', key: 'budget', width: 130, align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: '实际数（万元）', dataIndex: 'actual', key: 'actual', width: 130, align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: '差异（万元）', dataIndex: 'diff', key: 'diff', width: 120, align: 'right',
      render: v => (
        <span style={{ color: v <= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          {v >= 0 ? '+' : ''}{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: '执行率', dataIndex: 'rate', key: 'rate', width: 110, align: 'center',
      render: v => (
        <Tag color={v <= 100 ? 'green' : 'orange'}>
          {v.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.rate - b.rate,
    },
  ], [])

  // 片区对比列
  const regionColumns = useMemo(() => [
    { title: '片区', dataIndex: 'region', key: 'region', width: 120, fixed: 'left' },
    {
      title: '预算数（万元）', dataIndex: 'budget', key: 'budget', width: 130, align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: '实际数（万元）', dataIndex: 'actual', key: 'actual', width: 130, align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: '差异（万元）', dataIndex: 'diff', key: 'diff', width: 120, align: 'right',
      render: v => (
        <span style={{ color: v >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
          {v >= 0 ? '+' : ''}{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: '完成率', dataIndex: 'rate', key: 'rate', width: 110, align: 'center',
      render: v => (
        <Tag color={v >= 100 ? 'green' : v >= 90 ? 'orange' : 'red'}>
          {v.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: '完成进度', dataIndex: 'rate', key: 'progress', width: 160,
      render: v => (
        <Progress
          percent={Math.min(v, 120)}
          size="small"
          strokeColor={v >= 100 ? '#52c41a' : v >= 90 ? '#faad14' : '#ff4d4f'}
          format={() => `${v.toFixed(1)}%`}
        />
      ),
    },
  ], [])

  // 产品TOP10列
  const productColumns = useMemo(() => [
    {
      title: '排名', dataIndex: 'rank', key: 'rank', width: 70, align: 'center',
      render: v => {
        const colors = { 1: '#f5222d', 2: '#fa8c16', 3: '#faad14' }
        return (
          <span style={{
            fontWeight: 700, fontSize: 14,
            color: colors[v] || '#8c8c8c',
          }}>
            {v <= 3 ? `TOP${v}` : v}
          </span>
        )
      },
    },
    { title: '产品名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '销售额（万元）', dataIndex: 'sales', key: 'sales', width: 130, align: 'right',
      render: v => v.toLocaleString(),
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: '预算完成率', dataIndex: 'rate', key: 'rate', width: 120, align: 'center',
      render: v => (
        <Tag color={v >= 100 ? 'green' : v >= 90 ? 'orange' : 'red'}>
          {v.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.rate - b.rate,
    },
  ], [])

  // 查询条件字段
  const queryFields = [
    { key: 'year', label: '年份', options: ['2025', '2026'] },
    { key: 'month', label: '月份', options: Array.from({ length: 12 }, (_, i) => `${i + 1}月`) },
    { key: 'manage_type', label: '管理类型', options: ['南区', '北区', '东区', '西区', '数字营销'] },
    { key: 'data_scope', label: '数据口径', options: ['考核口径', '报表口径'] },
  ]

  // Tab 项
  const tabItems = [
    {
      key: 'sales',
      label: <span><BarChartOutlined /> 销售预实对比</span>,
      children: (
        <Table
          columns={salesColumns}
          dataSource={SALES_COMPARE_DATA}
          loading={loading}
          pagination={false}
          scroll={{ x: 700 }}
          size="small"
          bordered
          summary={() => {
            const totalBudget = SALES_COMPARE_DATA.reduce((s, r) => s + r.budget, 0)
            const totalActual = SALES_COMPARE_DATA.reduce((s, r) => s + r.actual, 0)
            const totalDiff = totalActual - totalBudget
            const totalRate = (totalActual / totalBudget * 100)
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right"><strong>{totalBudget.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right"><strong>{totalActual.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong style={{ color: totalDiff >= 0 ? '#52c41a' : '#ff4d4f' }}>
                      {totalDiff >= 0 ? '+' : ''}{totalDiff.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">
                    <Tag color={totalRate >= 100 ? 'green' : 'orange'}>{totalRate.toFixed(1)}%</Tag>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      ),
    },
    {
      key: 'expense',
      label: <span><FundOutlined /> 费用预实对比</span>,
      children: (
        <Table
          columns={expenseColumns}
          dataSource={EXPENSE_COMPARE_DATA}
          loading={loading}
          pagination={false}
          scroll={{ x: 700 }}
          size="small"
          bordered
          summary={() => {
            const totalBudget = EXPENSE_COMPARE_DATA.reduce((s, r) => s + r.budget, 0)
            const totalActual = EXPENSE_COMPARE_DATA.reduce((s, r) => s + r.actual, 0)
            const totalDiff = totalActual - totalBudget
            const totalRate = (totalActual / totalBudget * 100)
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right"><strong>{totalBudget.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right"><strong>{totalActual.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong style={{ color: totalDiff <= 0 ? '#52c41a' : '#ff4d4f' }}>
                      {totalDiff >= 0 ? '+' : ''}{totalDiff.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">
                    <Tag color={totalRate <= 100 ? 'green' : 'orange'}>{totalRate.toFixed(1)}%</Tag>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      ),
    },
    {
      key: 'region',
      label: <span><PieChartOutlined /> 片区完成对比</span>,
      children: (
        <Table
          columns={regionColumns}
          dataSource={REGION_COMPARE_DATA}
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
          bordered
          summary={() => {
            const totalBudget = REGION_COMPARE_DATA.reduce((s, r) => s + r.budget, 0)
            const totalActual = REGION_COMPARE_DATA.reduce((s, r) => s + r.actual, 0)
            const totalDiff = totalActual - totalBudget
            const totalRate = (totalActual / totalBudget * 100)
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right"><strong>{totalBudget.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right"><strong>{totalActual.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong style={{ color: totalDiff >= 0 ? '#52c41a' : '#ff4d4f' }}>
                      {totalDiff >= 0 ? '+' : ''}{totalDiff.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="center">
                    <Tag color={totalRate >= 100 ? 'green' : 'orange'}>{totalRate.toFixed(1)}%</Tag>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )
          }}
        />
      ),
    },
    {
      key: 'product',
      label: <span><LineChartOutlined /> 产品TOP10</span>,
      children: (
        <Table
          columns={productColumns}
          dataSource={PRODUCT_TOP10}
          loading={loading}
          pagination={false}
          scroll={{ x: 600 }}
          size="small"
          bordered
        />
      ),
    },
  ]

  return (
    <div style={{ padding: 0 }}>
      {/* 查询条件区 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e8e8e8',
        background: '#fafafa',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: '8px 8px 0 0',
      }}>
        <Form form={searchForm} layout="inline" style={{ display: 'flex', flexWrap: 'wrap', flex: 1, gap: 0 }}>
          {queryFields.map(field => (
            <Form.Item key={field.key} label={field.label} name={field.key}
              style={{ width: 180, marginRight: 12, marginBottom: 8 }}>
              <Select placeholder="请选择" allowClear showSearch size="small">
                {field.options.map(opt => (
                  <Select.Option key={opt} value={opt}>{opt}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          ))}
        </Form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingBottom: 8 }}>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>导出</Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
        </div>
      </div>

      {/* KPI 指标卡 */}
      <div style={{ padding: '16px 16px 0', background: '#fff' }}>
        <Row gutter={[16, 16]}>
          {KPI_CARDS.map((kpi, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card
                size="small"
                style={{
                  background: kpi.bg,
                  border: `1px solid ${kpi.color}30`,
                  borderRadius: 10,
                }}
                bodyStyle={{ padding: '16px 20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>{kpi.title}</div>
                    <Statistic
                      value={kpi.value}
                      precision={kpi.suffix === '%' ? 1 : 2}
                      suffix={kpi.suffix}
                      prefix={kpi.prefix}
                      valueStyle={{ color: kpi.color, fontSize: 26, fontWeight: 700 }}
                    />
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: `${kpi.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {kpi.icon}
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                  <span style={{ color: kpi.trend >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 500 }}>
                    {kpi.trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' '}{Math.abs(kpi.trend)}%
                  </span>
                  <span style={{ marginLeft: 4 }}>同比</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 预实对比分析 Tab */}
      <div style={{ padding: '16px' }}>
        <Card
          title={<span><BarChartOutlined style={{ marginRight: 8 }} />预实对比分析</span>}
          size="small"
          style={{ borderRadius: 8 }}
          bodyStyle={{ padding: '0 12px 12px' }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="small"
          />
        </Card>
      </div>
    </div>
  )
}
