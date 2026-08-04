import { useState, useEffect } from 'react'
import { Table, Button, Input, Space, message, Tag, Row, Col, Card, Modal, Form, Upload, Select } from 'antd'
import { ReloadOutlined, SearchOutlined, DownloadOutlined, PlusOutlined, ImportOutlined, InboxOutlined } from '@ant-design/icons'
import api from '../../api'

const { Dragger } = Upload

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

// 显示的维度字段
const DIMENSION_FIELDS = [
  { name: 'year', label: '年份' },
  { name: 'product_owner_name', label: '产品负责人（总部）' },
  { name: 'salesman_lv1_code', label: '一级业务员编码' },
  { name: 'salesman_lv1_name', label: '一级业务员名称' },
  { name: 'sales_office_code', label: '销售办公室编码' },
  { name: 'sales_office_name', label: '销售办公室名称' },
  { name: 'customer_name', label: '客户名称' },
  { name: 'goods_class_name', label: '商品名分类' },
  { name: 'product_code', label: '产品编码' },
  { name: 'product_name', label: '产品名称' },
  { name: 'spec', label: '规格' },
  { name: 'package_spec', label: '包装规格' },
  { name: 'product_type', label: '类型' },
  { name: 'package_class', label: '包装分类' },
  { name: 'unit', label: '计量单位' },
  { name: 'approval_manufacturer', label: '批文厂家' },
  { name: 'produce_manufacturer', label: '生产厂家' },
  { name: 'analysis_arch', label: '分析架构' },
  { name: 'group_purchase_attr', label: '集采属性' },
  { name: 'group_purchase_batch', label: '集采批次' },
  { name: 'budget_entity_code', label: '预算编制实体编码' },
  { name: 'budget_entity_name', label: '预算编制实体名称' },
]

// 13组月度数据列
const MONTHLY_GROUPS = [
  { prefix: 'sales_volume', label: '销售量' },
  { prefix: 'sales_volume_conv', label: '销售量-转换后' },
  { prefix: 'sales_volume_min_spec', label: '销售量-最小规格' },
  { prefix: 'bid_price', label: '中标价/交易价' },
  { prefix: 'bid_amount', label: '中标/交易金额' },
  { prefix: 'unit_price_incl_pre', label: '销售单价-含税（折前）' },
  { prefix: 'revenue_incl_pre', label: '销售收入-含税（折前）' },
  { prefix: 'revenue_incl_disc', label: '销售收入-含税（折扣）' },
  { prefix: 'revenue_incl_post', label: '销售收入-含税（折后）' },
  { prefix: 'vat_rate', label: '增值税销项税率' },
  { prefix: 'revenue_excl_pre', label: '销售收入-不含税（折前）' },
  { prefix: 'revenue_excl_disc', label: '销售收入-不含税（折扣）' },
  { prefix: 'revenue_excl_post', label: '销售收入-不含税（折后）' },
]

// 筛选字段
const FILTER_FIELDS = [
  { name: 'year', label: '年份', placeholder: '输入年份' },
  { name: 'product_owner_name', label: '产品负责人（总部）', placeholder: '输入产品负责人' },
  { name: 'salesman_lv1_name', label: '一级业务员（总部）', placeholder: '输入一级业务员' },
  { name: 'sales_office_name', label: '销售办公室', placeholder: '输入销售办公室' },
  { name: 'product_name', label: '产品名称', placeholder: '输入产品名称' },
]

// 业务模式选项
const BUSINESS_MODE_OPTIONS = [
  { label: '数字营销', value: '数字营销' },
  { label: '城市连锁', value: '城市连锁' },
]

export default function DigitalMarketingTable() {
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/actual-sales/digital-marketing')
      setAllData(res.data || [])
    } catch (err) {
      setAllData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // 前端筛选
  const filteredData = allData.filter(row => {
    const textMatch = FILTER_FIELDS.every(f => {
      const filterVal = filters[f.name]
      if (!filterVal || !filterVal.trim()) return true
      const rowVal = String(row[f.name] || '')
      return rowVal.toLowerCase().includes(filterVal.trim().toLowerCase())
    })
    if (!textMatch) return false
    // 业务模式筛选
    const businessMode = filters.business_mode
    if (businessMode) {
      const rowMode = String(row.business_mode || '')
      if (rowMode !== businessMode) return false
    }
    return true
  })

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setFilters({})
  }

  // 新增记录
  const handleAdd = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      await api.post('/actual-sales/digital-marketing', values)
      message.success('新增成功')
      setAddModalOpen(false)
      form.resetFields()
      loadData()
    } catch (err) {
      if (err.errorFields) return
      message.error(`新增失败: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  // CSV导入
  const handleImport = async (file) => {
    setImporting(true)
    try {
      const text = await file.text()
      const content = text.replace(/^\uFEFF/, '')
      const lines = content.split(/\r?\n/).filter(l => l.trim())
      if (lines.length < 2) {
        message.error('CSV文件为空或格式不正确')
        setImporting(false)
        return false
      }

      // 解析表头
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
      const records = []
      
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const record = {}
        headers.forEach((h, idx) => {
          if (vals[idx] !== undefined && vals[idx] !== '') {
            record[h] = vals[idx]
          }
        })
        if (Object.keys(record).length > 0) {
          records.push(record)
        }
      }

      if (records.length === 0) {
        message.error('没有解析到有效数据')
        setImporting(false)
        return false
      }

      // 批量提交
      await api.post('/actual-sales/digital-marketing/batch', { data: records })
      message.success(`导入成功：${records.length} 条`)
      setImportModalOpen(false)
      loadData()
    } catch (err) {
      message.error(`导入失败: ${err.message}`)
    } finally {
      setImporting(false)
    }
    return false
  }

  // 构建表格列
  const buildColumns = () => {
    const cols = []

    // 维度列
    DIMENSION_FIELDS.forEach(f => {
      cols.push({
        title: f.label,
        dataIndex: f.name,
        key: f.name,
        width: 130,
        fixed: ['year', 'product_code'].includes(f.name) ? 'left' : undefined,
        ellipsis: true,
      })
    })

    // 13组月度数据列
    MONTHLY_GROUPS.forEach(g => {
      cols.push({
        title: g.label,
        key: `${g.prefix}_group`,
        align: 'center',
        children: MONTHS.map((m, i) => ({
          title: m,
          dataIndex: `${g.prefix}_m${String(i + 1).padStart(2, '0')}`,
          key: `${g.prefix}_m${String(i + 1).padStart(2, '0')}`,
          width: 90,
          align: 'right',
          render: (val) => val != null && val !== 0 ? Number(val).toLocaleString() : '-',
        })),
      })
    })

    return cols
  }

  // 导出 CSV
  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning('没有数据可导出')
      return
    }

    const header1 = []
    const header2 = []

    DIMENSION_FIELDS.forEach(f => {
      header1.push(f.label)
      header2.push('')
    })

    MONTHLY_GROUPS.forEach(g => {
      header1.push(g.label)
      MONTHS.forEach(m => header2.push(m))
    })

    const rows = filteredData.map(row => {
      const vals = []
      DIMENSION_FIELDS.forEach(f => {
        vals.push(row[f.name] || '')
      })
      MONTHLY_GROUPS.forEach(g => {
        for (let i = 1; i <= 12; i++) {
          const key = `${g.prefix}_m${String(i).padStart(2, '0')}`
          vals.push(row[key] || '')
        }
      })
      return vals
    })

    const BOM = '\uFEFF'
    const csvContent = BOM + [
      header1.join(','),
      header2.join(','),
      ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `数字营销_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    message.success('导出成功')
  }

  return (
    <div>
      {/* 筛选区域 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col key="business_mode" span={4}>
            <Space.Compact style={{ width: '100%' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 8px', background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: '6px 0 0 6px', whiteSpace: 'nowrap', fontSize: 14 }}>业务模式</span>
              <Select
                placeholder="请选择"
                value={filters.business_mode || undefined}
                onChange={value => handleFilterChange('business_mode', value || '')}
                allowClear
                style={{ flex: 1 }}
                options={BUSINESS_MODE_OPTIONS}
              />
            </Space.Compact>
          </Col>
          {FILTER_FIELDS.map(f => (
            <Col key={f.name} span={4}>
              <Input
                placeholder={f.placeholder}
                value={filters[f.name] || ''}
                onChange={e => handleFilterChange(f.name, e.target.value)}
                allowClear
                addonBefore={f.label}
              />
            </Col>
          ))}
          <Col span={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据统计 + 操作按钮 */}
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Tag color="blue">共 {filteredData.length} 条数据</Tag>
          {filteredData.length !== allData.length && (
            <Tag color="orange">筛选前 {allData.length} 条</Tag>
          )}
        </Space>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>新增</Button>
          <Button icon={<ImportOutlined />} onClick={() => setImportModalOpen(true)}>导入</Button>
          <Button icon={<ReloadOutlined />} onClick={loadData} size="small">刷新</Button>
        </Space>
      </div>

      {/* 数据表格 */}
      <Table
        dataSource={filteredData}
        columns={buildColumns()}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        size="small"
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        bordered
      />

      {/* 新增弹窗 */}
      <Modal
        title="新增数字营销记录"
        open={addModalOpen}
        onOk={handleAdd}
        onCancel={() => { setAddModalOpen(false); form.resetFields() }}
        confirmLoading={submitting}
        width={900}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
          {/* 维度字段 */}
          <Row gutter={16}>
            {DIMENSION_FIELDS.map(f => (
              <Col key={f.name} span={8}>
                <Form.Item name={f.name} label={f.label}>
                  <Input placeholder={`请输入${f.label}`} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          {/* 月度数据字段 */}
          {MONTHLY_GROUPS.slice(0, 3).map(g => (
            <div key={g.prefix} style={{ marginBottom: 16 }}>
              <Tag color="blue" style={{ marginBottom: 8 }}>{g.label}</Tag>
              <Row gutter={8}>
                {MONTHS.map((m, i) => (
                  <Col key={m} span={4}>
                    <Form.Item
                      name={`${g.prefix}_m${String(i + 1).padStart(2, '0')}`}
                      label={m}
                      style={{ marginBottom: 4 }}
                    >
                      <Input placeholder={m} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Form>
      </Modal>

      {/* 导入弹窗 */}
      <Modal
        title="导入数字营销数据"
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={null}
        width={600}
      >
        <p style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
          请上传 CSV 文件，格式需与导出格式一致。
        </p>
        <Dragger
          accept=".csv"
          showUploadList={false}
          beforeUpload={handleImport}
          disabled={importing}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{importing ? '正在导入...' : '点击或拖拽CSV文件到此区域'}</p>
          <p className="ant-upload-hint">仅支持 .csv 文件，请确保文件为 UTF-8 编码</p>
        </Dragger>
      </Modal>
    </div>
  )
}
