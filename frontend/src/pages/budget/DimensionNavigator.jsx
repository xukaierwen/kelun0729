import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Select, AutoComplete, Button, Input, message, Typography, Tag, Space } from 'antd'
import {
  DatabaseOutlined, TableOutlined, SearchOutlined,
  SendOutlined, AppstoreOutlined,
} from '@ant-design/icons'
import { MASTER_DATA_DEFS, MAPPING_TABLE_DEFS } from '../../data/masterDataDefs'

const { Title, Text } = Typography

// 主数据 pageKey → 路由路径 映射
const MASTER_KEY_TO_ROUTE = {
  'md-mgmt-type': 'type',
  'md-mgmt-team': 'team',
  'md-business-mode': 'business-mode',
  'md-sales-mode': 'sales-mode',
  'md-province': 'province',
  'md-region': 'region',
  'md-entity': 'entity',
  'md-sales-group': 'sales-group',
  'md-sales-office': 'sales-office',
  'md-sales-officer-hq': 'sales-officer-hq',
  'md-region-dimension': 'region-dimension',
  'md-customer': 'customer',
  'md-product': 'product',
  'md-product-arch': 'product-arch',
  'md-department': 'department',
  'md-salesman-hn': 'salesman-hn',
  'md-flow-unit': 'flow-unit',
  'md-scenario': 'scenario',
  'md-data-scope': 'data-scope',
  'md-version': 'version',
  'md-year': 'year',
  'md-period': 'period',
  'md-account': 'account',
  'md-currency': 'currency',
}

// 映射表 pageKey → 路由路径 映射（key去掉 map- 前缀）
const MAPPING_KEY_TO_ROUTE = {}
Object.keys(MAPPING_TABLE_DEFS).forEach(key => {
  MAPPING_KEY_TO_ROUTE[key] = key.replace('map-', '')
})

// 类别选项
const CATEGORY_OPTIONS = [
  { value: 'master', label: '主数据管理', icon: <DatabaseOutlined />, count: Object.keys(MASTER_DATA_DEFS).length },
  { value: 'mapping', label: '映射表管理', icon: <TableOutlined />, count: Object.keys(MAPPING_TABLE_DEFS).length },
]

export default function DimensionNavigator() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('master')
  const [selectedTable, setSelectedTable] = useState(null)
  const [searchText, setSearchText] = useState('')

  // 根据类别构建表名列表
  const tableOptions = useMemo(() => {
    const defs = category === 'master' ? MASTER_DATA_DEFS : MAPPING_TABLE_DEFS
    const items = Object.entries(defs).map(([key, def]) => ({
      value: key,
      label: def.name,
      key,
    }))
    return items
  }, [category])

  // 模糊过滤后的选项
  const filteredOptions = useMemo(() => {
    if (!searchText) return tableOptions
    const lower = searchText.toLowerCase()
    return tableOptions.filter(item =>
      item.label.toLowerCase().includes(lower) ||
      item.value.toLowerCase().includes(lower)
    )
  }, [tableOptions, searchText])

  // 切换类别时清空选择
  const handleCategoryChange = (val) => {
    setCategory(val)
    setSelectedTable(null)
    setSearchText('')
  }

  // 选择表名
  const handleSelect = (value) => {
    setSelectedTable(value)
    const defs = category === 'master' ? MASTER_DATA_DEFS : MAPPING_TABLE_DEFS
    setSearchText(defs[value]?.name || '')
  }

  // 跳转
  const handleNavigate = () => {
    if (!selectedTable) {
      message.warning('请先选择表名')
      return
    }
    const routeMap = category === 'master' ? MASTER_KEY_TO_ROUTE : MAPPING_KEY_TO_ROUTE
    const routeKey = routeMap[selectedTable]
    if (!routeKey) {
      message.error('未找到对应的路由配置')
      return
    }
    const path = category === 'master'
      ? `/dimension/master/${routeKey}`
      : `/dimension/mapping/${routeKey}`
    navigate(path)
  }

  // 当前选中的表名信息
  const selectedDef = useMemo(() => {
    if (!selectedTable) return null
    const defs = category === 'master' ? MASTER_DATA_DEFS : MAPPING_TABLE_DEFS
    return defs[selectedTable] || null
  }, [selectedTable, category])

  return (
    <div style={{ padding: 0 }}>
      <Title level={5} style={{ marginBottom: 16 }}>维度管理</Title>

      <Card
        style={{ borderRadius: 8, marginBottom: 16 }}
        bodyStyle={{ padding: '24px' }}
      >
        {/* 筛选区 */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* 类别筛选 */}
          <div style={{ minWidth: 240 }}>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#333', fontWeight: 500 }}>
              <AppstoreOutlined style={{ marginRight: 6 }} />类别
            </div>
            <Select
              value={category}
              onChange={handleCategoryChange}
              style={{ width: '100%' }}
              size="large"
              options={CATEGORY_OPTIONS.map(opt => ({
                value: opt.value,
                label: (
                  <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{opt.icon} {opt.label}</span>
                    <Tag color={opt.value === 'master' ? 'blue' : 'green'} style={{ marginLeft: 8 }}>
                      {opt.count}张表
                    </Tag>
                  </span>
                ),
              }))}
            />
          </div>

          {/* 表名筛选 */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ marginBottom: 8, fontSize: 13, color: '#333', fontWeight: 500 }}>
              <SearchOutlined style={{ marginRight: 6 }} />表名
            </div>
            <AutoComplete
              value={searchText}
              onChange={setSearchText}
              onSelect={handleSelect}
              style={{ width: '100%' }}
              options={filteredOptions.map(item => ({
                value: item.value,
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: selectedTable === item.value ? 600 : 400 }}>
                      {item.label}
                    </span>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.value}</Text>
                  </div>
                ),
              }))}
              size="large"
              placeholder="输入表名模糊搜索..."
              filterOption={false}
              allowClear
              onClear={() => { setSelectedTable(null); setSearchText('') }}
            />
          </div>
        </div>

        {/* 选中信息展示 */}
        {selectedDef && (
          <div style={{
            marginTop: 20, padding: '12px 16px',
            background: '#f6f8fa', borderRadius: 6,
            border: '1px solid #e8e8e8',
          }}>
            <Space split={<span style={{ color: '#d9d9d9' }}>|</span>} size="middle">
              <span>
                <Text type="secondary">类别：</Text>
                <Tag color={category === 'master' ? 'blue' : 'green'}>
                  {category === 'master' ? '主数据管理' : '映射表管理'}
                </Tag>
              </span>
              <span>
                <Text type="secondary">表名：</Text>
                <strong>{selectedDef.name}</strong>
              </span>
              <span>
                <Text type="secondary">字段数：</Text>
                <span>{selectedDef.columns.length}个</span>
              </span>
            </Space>
          </div>
        )}

        {/* 右下角跳转按钮 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={handleNavigate}
            disabled={!selectedTable}
            style={{ minWidth: 140 }}
          >
            跳转页面
          </Button>
        </div>
      </Card>

      {/* 快捷入口 - 常用表 */}
      <Card
        title="快捷入口"
        size="small"
        style={{ borderRadius: 8 }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(MASTER_DATA_DEFS).slice(0, 8).map(([key, def]) => (
            <Button
              key={key}
              size="small"
              icon={<DatabaseOutlined />}
              onClick={() => {
                setCategory('master')
                setSelectedTable(key)
                setSearchText(def.name)
                const routeKey = MASTER_KEY_TO_ROUTE[key]
                if (routeKey) navigate(`/dimension/master/${routeKey}`)
              }}
            >
              {def.name}
            </Button>
          ))}
          <span style={{ lineHeight: '24px', color: '#8c8c8c', fontSize: 12, marginLeft: 4 }}>...</span>
        </div>
      </Card>
    </div>
  )
}
