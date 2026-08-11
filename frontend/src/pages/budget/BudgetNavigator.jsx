import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography } from 'antd'
import {
  EditOutlined, BarChartOutlined,
  ImportOutlined, ToolOutlined,
} from '@ant-design/icons'

const { Title } = Typography

// 预算编制子功能入口
const BUDGET_ENTRIES = [
  {
    title: '年度预算编制',
    desc: '销售预算、运营费用预算、成本预算等年度编制',
    icon: <EditOutlined style={{ fontSize: 36, color: '#1677ff' }} />,
    color: '#1677ff',
    bg: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
    border: '#91caff',
    path: '/budget/annual/nav',
  },
  {
    title: '实际数补录',
    desc: '销售实际数、费用实际数等数据录入与汇总',
    icon: <BarChartOutlined style={{ fontSize: 36, color: '#52c41a' }} />,
    color: '#52c41a',
    bg: 'linear-gradient(135deg, #f6ffed 0%, #fcffe6 100%)',
    border: '#b7eb8f',
    path: '/budget/actual-sales-digital',
  },
  {
    title: '12月手工调整量',
    desc: '年末手工调整数据录入与审核',
    icon: <ToolOutlined style={{ fontSize: 36, color: '#fa8c16' }} />,
    color: '#fa8c16',
    bg: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)',
    border: '#ffd591',
    path: '/budget/adjust-plan',
  },
  {
    title: '基础数据导入',
    desc: '总部点位、点位费单价等基础数据导入',
    icon: <ImportOutlined style={{ fontSize: 36, color: '#722ed1' }} />,
    color: '#722ed1',
    bg: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
    border: '#d3adf7',
    path: '/budget/import/nav',
  },
]

export default function BudgetNavigator() {
  const navigate = useNavigate()

  return (
    <div>
      <Title level={5} style={{ marginBottom: 20 }}>预算编制</Title>
      <Row gutter={[24, 24]}>
        {BUDGET_ENTRIES.map((entry, idx) => (
          <Col xs={24} sm={12} key={idx}>
            <Card
              hoverable
              onClick={() => navigate(entry.path)}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 12,
                background: entry.bg,
                border: `1px solid ${entry.border}`,
                padding: '24px 0',
              }}
              bodyStyle={{ padding: '32px 24px' }}
            >
              {entry.icon}
              <div style={{ fontSize: 20, fontWeight: 600, color: entry.color, marginTop: 12 }}>
                {entry.title}
              </div>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 8 }}>
                {entry.desc}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
