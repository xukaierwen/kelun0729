import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Timeline, Empty, Tag } from 'antd'
import {
  ClockCircleOutlined, EditOutlined, BarChartOutlined,
  DatabaseOutlined, PieChartOutlined,
  LineChartOutlined, ImportOutlined, ToolOutlined,
} from '@ant-design/icons'
import api from '../../api'
import './BudgetDashboard.css'

const { Text, Title } = Typography

// 预算编制悬浮快捷入口
const BUDGET_QUICK_CARDS = [
  { title: '年度预算', icon: <EditOutlined />, color: '#1677ff', path: '/budget/annual/nav' },
  { title: '实际数补录', icon: <LineChartOutlined />, color: '#52c41a', path: '/budget/actual-sales-digital' },
  { title: '手工调整', icon: <ToolOutlined />, color: '#fa8c16', path: '/budget/adjust-plan' },
  { title: '基础导入', icon: <ImportOutlined />, color: '#722ed1', path: '/budget/import/nav' },
]

export default function BudgetDashboard() {
  const navigate = useNavigate()
  const [recentActivities, setRecentActivities] = useState([])
  const [budgetCardHover, setBudgetCardHover] = useState(false)

  useEffect(() => {
    // 加载最近活动
  }, [])

  return (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>预算系统概览</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <div
            className="budget-card-wrapper"
            onMouseEnter={() => setBudgetCardHover(true)}
            onMouseLeave={() => setBudgetCardHover(false)}
          >
            <Card
              className={`budget-main-card ${budgetCardHover ? 'hovered' : ''}`}
              style={{
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
                border: '1px solid #91caff',
                padding: '24px 0',
              }}
              bodyStyle={{ padding: '32px 24px' }}
            >
              <EditOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 12 }} />
              <div style={{ fontSize: 20, fontWeight: 600, color: '#1677ff' }}>预算编制</div>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 8 }}>销售预算、运营费用预算编制与录入</div>
            </Card>
            {/* 悬浮时显示的4个小卡片 */}
            {budgetCardHover && (
              <div className="budget-quick-overlay">
                {BUDGET_QUICK_CARDS.map((card, idx) => (
                  <div
                    key={idx}
                    className="budget-quick-card"
                    onClick={() => navigate(card.path)}
                    style={{ borderLeft: `3px solid ${card.color}` }}
                  >
                    <span className="budget-quick-card-icon" style={{ color: card.color }}>{card.icon}</span>
                    <span className="budget-quick-card-title">{card.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => navigate('/budget/actual-sales-summary')}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f6ffed 0%, #fcffe6 100%)',
              border: '1px solid #b7eb8f',
              padding: '24px 0',
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <BarChartOutlined style={{ fontSize: 40, color: '#52c41a', marginBottom: 12 }} />
            <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>审核锁定</div>
            <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 8 }}>预算数据审核、校验与锁定确认</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => navigate('/dimension')}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)',
              border: '1px solid #ffd591',
              padding: '24px 0',
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <DatabaseOutlined style={{ fontSize: 40, color: '#fa8c16', marginBottom: 12 }} />
            <div style={{ fontSize: 20, fontWeight: 600, color: '#fa8c16' }}>维度管理</div>
            <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 8 }}>主数据维护、映射表配置与维度管理</div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => navigate('/budget/analysis')}
            style={{
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
              border: '1px solid #d3adf7',
              padding: '24px 0',
            }}
            bodyStyle={{ padding: '32px 24px' }}
          >
            <PieChartOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 12 }} />
            <div style={{ fontSize: 20, fontWeight: 600, color: '#722ed1' }}>分析报表</div>
            <div style={{ fontSize: 13, color: '#8c8c8c', marginTop: 8 }}>预实对比、片区分析与产品TOP排行</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="最近活动" size="small">
            {recentActivities.length === 0 ? (
              <Empty description="暂无活动记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Timeline
                items={recentActivities.map(a => ({
                  dot: <ClockCircleOutlined style={{ color: a.type === 'sales' ? '#1677ff' : '#faad14' }} />,
                  children: (
                    <div>
                      <Text>{a.content}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>{a.time}</Text>
                    </div>
                  ),
                }))}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="系统说明" size="small">
            <div style={{ lineHeight: 2, fontSize: 13 }}>
              <div><Tag color="blue">主数据管理</Tag> 查看客户、产品、部门等主数据，支持CRUD操作</div>
              <div><Tag color="green">配置表管理</Tag> 管理业务模式、产品负责人等基础配置</div>
              <div><Tag color="orange">预算编制</Tag> 编制销售预算和运营费用预算，支持多版本管理</div>
              <div><Tag color="purple">预算分析</Tag> 汇总统计、趋势分析、预算执行对比</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
