import { useState, useMemo } from 'react'
import { Table, Button, Select, Form, message } from 'antd'
import { SearchOutlined, ExportOutlined, SaveOutlined, ImportOutlined, SendOutlined } from '@ant-design/icons'
import '../budget/ActualDataTable.css'

// 月份列表
const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
const MONTH_COLUMNS = [...MONTHS, '全年合计', '上年预计完成数 - 全年合计', '差异 - 全年合计', '差异率 - 全年合计']

// 维度字段
const DIMENSION_FIELDS = [
  { key: 'product_owner', title: '产品负责人（总部）', width: 120 },
  { key: 'province', title: '省份', width: 100 },
  { key: 'salesman', title: '一级业务员', width: 120 },
  { key: 'analysis_arch', title: '产品分析架构', width: 120 },
]

export default function TargetCompileTable() {
  const [searchForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 生成表格列配置
  const columns = useMemo(() => {
    const cols = []

    // 维度字段列
    DIMENSION_FIELDS.forEach(field => {
      cols.push({
        title: field.title,
        dataIndex: field.key,
        key: field.key,
        width: field.width,
        fixed: 'left',
        ellipsis: true,
      })
    })

    // 销售量 - 转换后（按月份展开）
    cols.push({
      title: '销售量 - 转换后',
      children: MONTH_COLUMNS.map(month => ({
        title: month,
        dataIndex: `sales_converted_${month.replace(/月/g, '').replace(/ - /g, '_').replace(/全年合计/g, 'total').replace(/上年预计完成数/g, 'last_year').replace(/差异/g, 'diff').replace(/差异率/g, 'diff_rate')}`,
        key: `sales_converted_${month.replace(/月/g, '').replace(/ - /g, '_').replace(/全年合计/g, 'total').replace(/上年预计完成数/g, 'last_year').replace(/差异/g, 'diff').replace(/差异率/g, 'diff_rate')}`,
        width: 100,
        align: 'right',
      })),
    })

    return cols
  }, [])

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

  // 保存
  const handleSave = () => {
    message.success('保存功能开发中')
  }

  // 导入
  const handleImport = () => {
    message.success('导入功能开发中')
  }

  // 提交
  const handleSubmit = () => {
    message.success('提交功能开发中')
  }

  // 查询条件字段
  const queryFields = [
    { key: 'year', label: '年份' },
    { key: 'manage_type', label: '总部管理类型' },
    { key: 'manage_team', label: '总部管理团队' },
    { key: 'business_model', label: '业务模式' },
    { key: 'sales_mode', label: '销售模式' },
    { key: 'budget_entity', label: '预算编制实体' },
  ]

  return (
    <div className="actual-data-table">
      {/* 查询条件区 */}
      <div className="search-form">
        <Form form={searchForm} layout="inline" className="search-fields">
          {queryFields.map(field => (
            <Form.Item key={field.key} label={field.label} name={field.key} className="search-field-item">
              <Select placeholder="请选择" allowClear showSearch size="small">
                <Select.Option value="test">测试数据</Select.Option>
              </Select>
            </Form.Item>
          ))}
        </Form>
        <div className="search-buttons">
          <Button size="small" icon={<ImportOutlined />} onClick={handleImport}>
            导入
          </Button>
          <Button size="small" icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
          <Button size="small" icon={<SaveOutlined />} onClick={handleSave}>
            保存
          </Button>
          <Button size="small" icon={<SendOutlined />} onClick={handleSubmit}>
            提交
          </Button>
          <Button type="primary" size="small" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={[]}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            size: 'small',
          }}
          scroll={{ x: 2000 }}
          size="small"
          bordered
          locale={{
            emptyText: '暂无数据',
          }}
        />
      </div>
    </div>
  )
}
