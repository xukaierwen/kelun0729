import React from 'react';
import { Row, Col, Card, Statistic, Badge, List, Tag, Button } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './Workbench.css';

// 模拟数据 - 后续替换为真实API
const mockData = {
  role: 'headquarters', // headquarters, region, area
  metrics: {
    totalBudget: 1250000,
    completedRate: 68.5,
    pendingApprovals: 12,
    alerts: 5,
  },
  todos: [
    { id: 1, title: '华东区年度预算审核', type: 'approval', priority: 'high', time: '2小时前' },
    { id: 2, title: 'Q3预算调整审批', type: 'approval', priority: 'medium', time: '5小时前' },
    { id: 3, title: '产品线A预算驳回重填', type: 'rejection', priority: 'high', time: '1天前' },
    { id: 4, title: '集采价格更新通知', type: 'notification', priority: 'low', time: '1天前' },
  ],
  alerts: [
    { id: 1, message: '华北区预算超支15%', level: 'error', time: '30分钟前' },
    { id: 2, message: '产品X负毛利预警', level: 'warning', time: '2小时前' },
    { id: 3, message: '华南区上报进度延迟', level: 'warning', time: '3小时前' },
  ],
  quickActions: [
    { title: '预测查看', icon: '📊', path: '/forecast/execute' },
    { title: '预算填报', icon: '📝', path: '/budget/annual' },
    { title: '版本对比', icon: '🔍', path: '/budget/versions' },
    { title: '异常清单', icon: '⚠️', path: '/analysis/alerts' },
  ],
  progress: [
    { area: '华东区', progress: 85, status: 'normal' },
    { area: '华北区', progress: 62, status: 'warning' },
    { area: '华南区', progress: 45, status: 'delayed' },
    { area: '西南区', progress: 78, status: 'normal' },
  ],
};

function Workbench() {
  const { role, metrics, todos, alerts, quickActions, progress } = mockData;

  return (
    <div className="workbench">
      <div className="workbench-header">
        <h1>
          {role === 'headquarters' && '总部工作台'}
          {role === 'region' && '大区工作台'}
          {role === 'area' && '片区工作台'}
        </h1>
        <p className="workbench-subtitle">
          <ClockCircleOutlined /> 预算编制倒计时: 15天
        </p>
      </div>

      {/* 指标卡片 */}
      <Row gutter={[16, 16]} className="metrics-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="预算总额(万元)"
              value={metrics.totalBudget}
              precision={2}
              valueStyle={{ color: '#1677ff' }}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="完成率"
              value={metrics.completedRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="待审核单据"
              value={metrics.pendingApprovals}
              valueStyle={{ color: '#faad14' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="metric-card">
            <Statistic
              title="异常预警"
              value={metrics.alerts}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷入口 */}
      <Card title="快捷入口" className="quick-actions-card">
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={12} sm={6} key={index}>
              <Button
                type="default"
                block
                size="large"
                className="quick-action-btn"
                onClick={() => window.location.hash = action.path}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-title">{action.title}</span>
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 待办事项 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <FileTextOutlined /> 待办事项
                <Badge count={todos.length} style={{ marginLeft: 8 }} />
              </span>
            }
            className="todo-card"
          >
            <List
              itemLayout="horizontal"
              dataSource={todos}
              renderItem={(item) => (
                <List.Item className="todo-item">
                  <List.Item.Meta
                    title={
                      <div className="todo-title-row">
                        <span>{item.title}</span>
                        <Tag
                          color={
                            item.priority === 'high'
                              ? 'red'
                              : item.priority === 'medium'
                              ? 'orange'
                              : 'blue'
                          }
                        >
                          {item.priority === 'high'
                            ? '紧急'
                            : item.priority === 'medium'
                            ? '一般'
                            : '普通'}
                        </Tag>
                      </div>
                    }
                    description={item.time}
                  />
                  <Button type="link" size="small">
                    处理
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 异常预警 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <WarningOutlined style={{ color: '#ff4d4f' }} /> 异常预警
              </span>
            }
            className="alert-card"
          >
            <List
              dataSource={alerts}
              renderItem={(item) => (
                <List.Item className="alert-item">
                  <List.Item.Meta
                    avatar={
                      item.level === 'error' ? (
                        <Badge status="error" />
                      ) : (
                        <Badge status="warning" />
                      )
                    }
                    title={item.message}
                    description={item.time}
                  />
                  <Button type="link" size="small">
                    查看
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 上报进度 */}
      <Card title="片区上报进度" className="progress-card">
        <Row gutter={[16, 16]}>
          {progress.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div className="progress-item">
                <div className="progress-header">
                  <span className="progress-area">{item.area}</span>
                  <Tag
                    color={
                      item.status === 'normal'
                        ? 'green'
                        : item.status === 'warning'
                        ? 'orange'
                        : 'red'
                    }
                  >
                    {item.status === 'normal'
                      ? '正常'
                      : item.status === 'warning'
                      ? '延迟'
                      : '严重延迟'}
                  </Tag>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor:
                        item.status === 'normal'
                          ? '#52c41a'
                          : item.status === 'warning'
                          ? '#faad14'
                          : '#ff4d4f',
                    }}
                  />
                </div>
                <div className="progress-text">{item.progress}%</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}

export default Workbench;
