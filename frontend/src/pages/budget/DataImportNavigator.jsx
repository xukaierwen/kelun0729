import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Select, Button, Typography, Row, Col } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

const { Title } = Typography

// 数据类型选项
const DATA_TYPES = [
  { label: '总部点位导入', value: 'point' },
  { label: '点位费单价导入', value: 'point-price' },
]

// 路由映射
const getRoutePath = (dataType) => {
  const routes = {
    point: '/budget/annual/import-point',
    'point-price': '/budget/annual/import-point-price',
  }
  return routes[dataType] || '/budget/annual/import-point'
}

export default function DataImportNavigator() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('point')

  const handleNavigate = () => {
    const path = getRoutePath(selectedType)
    navigate(path)
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800 }}>
      <Title level={5} style={{ marginBottom: 24 }}>基础数据导入</Title>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>数据类型</div>
            <Select
              value={selectedType}
              onChange={setSelectedType}
              options={DATA_TYPES}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
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
