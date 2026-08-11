import { useState, useEffect } from 'react'
import { Modal, Table, Pagination, message } from 'antd'

// 生成59条模拟数据
const generateMockData = () => {
  const data = []
  const entities = [
    { code: '3280-total', name: '销售公司合计', parentCode: 'Group03', parentName: '集团' },
    { code: 'Group03', name: '集团', parentCode: 'Entity', parentName: '集团' },
    { code: '1010', name: '四川科伦-总部', parentCode: 'Group03', parentName: '集团' },
    { code: '101001', name: '四川科伦-总部', parentCode: '1010', parentName: '四川科伦' },
    { code: '101002', name: '四川科伦-新都', parentCode: '1010', parentName: '四川科伦' },
    { code: '1020', name: '广安分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1030', name: '仁寿分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1040', name: '成都分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1050', name: '重庆分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1060', name: '北京分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1070', name: '上海分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1080', name: '广州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1090', name: '深圳分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1100', name: '武汉分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1110', name: '西安分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1120', name: '南京分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1130', name: '杭州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1140', name: '天津分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1150', name: '苏州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1160', name: '无锡分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1170', name: '青岛分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1180', name: '大连分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1190', name: '沈阳分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1200', name: '哈尔滨分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1210', name: '长春分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1220', name: '济南分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1230', name: '郑州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1240', name: '长沙分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1250', name: '福州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1260', name: '合肥分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1270', name: '南昌分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1280', name: '昆明分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1290', name: '贵阳分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1300', name: '南宁分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1310', name: '海口分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1320', name: '兰州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1330', name: '银川分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1340', name: '西宁分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1350', name: '乌鲁木齐分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1360', name: '拉萨分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1370', name: '呼和浩特分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1380', name: '石家庄分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1390', name: '太原分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1400', name: '宁波分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1410', name: '厦门分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1420', name: '东莞分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1430', name: '佛山分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1440', name: '珠海分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1450', name: '中山分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1460', name: '烟台分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1470', name: '潍坊分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1480', name: '温州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1490', name: '常州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1500', name: '徐州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1510', name: '扬州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1520', name: '泰州分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1530', name: '镇江分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1540', name: '盐城分公司', parentCode: 'Group03', parentName: '集团' },
    { code: '1550', name: '淮安分公司', parentCode: 'Group03', parentName: '集团' },
  ]
  
  for (let i = 0; i < 59; i++) {
    const entity = entities[i] || {
      code: `ENT${String(i + 1).padStart(4, '0')}`,
      name: `测试实体${i + 1}`,
      parentCode: 'Group03',
      parentName: '集团',
    }
    data.push({
      key: entity.code,
      entityCode: entity.code,
      entityName: entity.name,
      parentCode: entity.parentCode,
      parentName: entity.parentName,
    })
  }
  return data
}

const ALL_DATA = generateMockData()

export default function ParentSelectorDialog({ open, onClose, onSelect }) {
  const [selectedRow, setSelectedRow] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(59)

  // 模拟加载数据
  useEffect(() => {
    if (open) {
      setLoading(true)
      // 模拟接口请求延迟
      setTimeout(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        setData(ALL_DATA.slice(start, end))
        setTotal(ALL_DATA.length)
        setLoading(false)
      }, 300)
    }
  }, [open, currentPage, pageSize])

  // 重置选中状态
  useEffect(() => {
    if (open) {
      setSelectedRow(null)
      setCurrentPage(1)
    }
  }, [open])

  // 表格列配置
  const columns = [
    {
      title: '实体编码',
      dataIndex: 'entityCode',
      key: 'entityCode',
      width: 140,
    },
    {
      title: '实体名称',
      dataIndex: 'entityName',
      key: 'entityName',
      width: 180,
    },
    {
      title: '父级实体编码',
      dataIndex: 'parentCode',
      key: 'parentCode',
      width: 140,
    },
    {
      title: '父级实体名称',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 140,
    },
  ]

  // 行点击选中
  const onRowClick = (record) => {
    setSelectedRow(record)
  }

  // 确定
  const handleOk = () => {
    if (!selectedRow) {
      message.warning('请选择一条记录')
      return
    }
    onSelect?.({
      parentCode: selectedRow.entityCode,
      parentName: selectedRow.entityName,
    })
    onClose()
  }

  // 取消
  const handleCancel = () => {
    onClose()
  }

  // 分页变化
  const handlePageChange = (page, size) => {
    setCurrentPage(page)
    setPageSize(size)
  }

  return (
    <Modal
      title="父级"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      width={720}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showSizeChanger
            showTotal={(t) => `共 ${t} 条`}
            size="small"
          />
          <div>
            <button
              onClick={handleCancel}
              style={{ marginRight: 8, padding: '4px 16px', cursor: 'pointer' }}
            >
              取消
            </button>
            <button
              onClick={handleOk}
              style={{ padding: '4px 16px', cursor: 'pointer', background: '#1677ff', color: 'white', border: 'none', borderRadius: 4 }}
            >
              确定
            </button>
          </div>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        size="small"
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRow ? [selectedRow.key] : [],
          onChange: (_, selectedRows) => {
            setSelectedRow(selectedRows[0])
          },
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: 'pointer' },
        })}
        scroll={{ y: 400 }}
      />
    </Modal>
  )
}
