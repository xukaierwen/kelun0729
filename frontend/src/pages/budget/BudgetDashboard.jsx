import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Tag, Typography, Timeline, Empty } from 'antd'
import {
  TeamOutlined, ShopOutlined, DollarOutlined, FileTextOutlined,
  ClockCircleOutlined, CheckCircleOutlined, AlertOutlined,
} from '@ant-design/icons'
import api from '../../api'

const { Text, Title } = Typography

export default function BudgetDashboard() {
  const [stats, setStats] = useState({
    salesBudgetCount: 0,
    operationBudgetCount: 0,
    salesTotalAmount: 0,
    operationTotalAmount: 0,
    masterDataCount: 0,
    mappingCount: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    // 加载统计数据
    const loadStats = async () => {
      try {
        const res = await api.get('/dashboard/stats')
        setStats(res.data || stats)
      } catch (err) {
        // 使用默认值
        console.log('统计数据加载失败，使用默认值')
      }
    }
    loadStats()
  }, [])

  return (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>预算系统概览</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="销售预算记录"
              value={stats.salesBudgetCount}
              prefix={<FileTextOutlined style={{ color: '#1677ff' }} />}
              suffix="条"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="销售预算总额"
              value={stats.salesTotalAmount}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="运营费用记录"
              value={stats.operationBudgetCount}
              prefix={<AlertOutlined style={{ color: '#faad14' }} />}
              suffix="条"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="运营费用总额"
              value={stats.operationTotalAmount}
              prefix={<DollarOutlined style={{ color: '#ff4d4f' }} />}
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="主数据表"
              value={stats.masterDataCount}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              suffix="张"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="映射表"
              value={stats.mappingCount}
              prefix={<ShopOutlined style={{ color: '#13c2c2' }} />}
              suffix="张"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="虚拟产品"
              value={0}
              prefix={<AlertOutlined style={{ color: '#eb2f96' }} />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="产品映射"
              value={0}
              prefix={<CheckCircleOutlined style={{ color: '#1677ff' }} />}
              suffix="条"
            />
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
