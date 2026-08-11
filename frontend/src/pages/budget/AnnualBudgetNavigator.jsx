import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Select, Button, Typography, Space, Row, Col } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

const { Title } = Typography

// 编制项目选项
const BUDGET_ITEMS = [
  { label: '版本管理', value: 'version' },
  { label: '目标管理', value: 'target' },
  { label: '销售预算', value: 'sales' },
  { label: '运营费用', value: 'expense' },
  { label: '成本预算', value: 'cost' },
]

// 模式选项
const MODES = [
  { label: '数字营销&城市连锁', value: 'digital' },
  { label: '费用制片区-片区直营', value: 'direct' },
  { label: '费用制片区-片区招商', value: 'investment' },
  { label: '费用制片区-片区城市连锁', value: 'chain' },
  { label: '代理制片区&总代', value: 'agent' },
  { label: '总部直营', value: 'hq' },
]

// 路由映射
const getRoutePath = (item, mode) => {
  // 版本管理
  if (item === 'version') {
    return '/budget/annual/overview'
  }
  // 目标管理
  if (item === 'target') {
    return '/budget/annual/target-compile'
  }
  // 销售预算 - 根据模式选择
  if (item === 'sales') {
    const salesRoutes = {
      digital: '/budget/annual/sales-digital',
      direct: '/budget/annual/sales-direct',
      investment: '/budget/annual/sales-investment',
      chain: '/budget/annual/sales-chain',
      agent: '/budget/annual/sales-agent',
      hq: '/budget/annual/sales-hq',
    }
    return salesRoutes[mode] || '/budget/annual/sales-digital'
  }
  // 运营费用 - 根据模式选择
  if (item === 'expense') {
    const expenseRoutes = {
      digital: '/budget/annual/expense-check',
      direct: '/budget/annual/expense-check',
      investment: '/budget/annual/expense-check',
      chain: '/budget/annual/expense-check',
      agent: '/budget/annual/expense-check',
      hq: '/budget/annual/expense-check',
    }
    return expenseRoutes[mode] || '/budget/annual/expense-check'
  }
  // 成本预算
  if (item === 'cost') {
    return '/budget/annual/cost-budget'
  }
  return '/budget/annual/overview'
}

export default function AnnualBudgetNavigator() {
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState('target')
  const [selectedMode, setSelectedMode] = useState('digital')

  const handleNavigate = () => {
    const path = getRoutePath(selectedItem, selectedMode)
    navigate(path)
  }

  // 判断是否需要选择模式（销售预算和运营费用需要）
  const needMode = selectedItem === 'sales' || selectedItem === 'expense'

  return (
    <div style={{ padding: '24px', maxWidth: 800 }}>
      <Title level={5} style={{ marginBottom: 24 }}>年度预算编制</Title>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>编制项目</div>
            <Select
              value={selectedItem}
              onChange={setSelectedItem}
              options={BUDGET_ITEMS}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>

          {needMode && (
            <Col span={24}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>模式</div>
              <Select
                value={selectedMode}
                onChange={setSelectedMode}
                options={MODES}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
          )}
        </Row>
      </Card>

      <div style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={handleNavigate}
          style={{ minWidth: 120 }}
        >
          进入
        </Button>
      </div>
    </div>
  )
}
