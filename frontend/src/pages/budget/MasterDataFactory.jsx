import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import MasterDataTable from '../../components/MasterDataTable'
import api from '../../api'
import { MASTER_DATA_DEFS, MAPPING_TABLE_DEFS } from '../../data/masterDataDefs'

// 通用页面生成器（支持主数据和映射表）
export function createMasterDataPage(pageKey, defSource = 'master') {
  return function DynamicMasterDataPage() {
    const defs = defSource === 'mapping' ? MAPPING_TABLE_DEFS : MASTER_DATA_DEFS
    const def = defs[pageKey]
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)

    if (!def) {
      return <div>页面配置错误: {pageKey}</div>
    }

    // 加载数据
    const loadData = useCallback(async () => {
      setLoading(true)
      try {
        const res = await api.get(`/master-data/${pageKey}`)
        const data = Array.isArray(res) ? res : (res.data || [])
        setDataSource(data)
      } catch (err) {
        message.error(`加载数据失败: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }, [pageKey])

    // 添加
    const handleAdd = async (record) => {
      try {
        await api.post(`/master-data/${pageKey}`, record)
        message.success('新增成功')
        loadData()
      } catch (err) {
        message.error(`新增失败: ${err.message}`)
      }
    }

    // 编辑
    const handleEdit = async (record) => {
      try {
        await api.put(`/master-data/${pageKey}`, record)
        message.success('更新成功')
        loadData()
      } catch (err) {
        message.error(`更新失败: ${err.message}`)
      }
    }

    // 失效（修改状态为禁用）
    const handleDisable = async (record) => {
      try {
        const updatedRecord = { ...record, status: 0 }
        await api.put(`/master-data/${pageKey}`, updatedRecord)
        message.success('失效成功')
        loadData()
      } catch (err) {
        message.error(`失效失败: ${err.message}`)
      }
    }

    // 刷新
    const handleRefresh = () => {
      loadData()
    }

    useEffect(() => {
      loadData()
    }, [])

    return (
      <MasterDataTable
        tableName={def.name}
        columns={def.columns}
        dataSource={dataSource}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDisable={handleDisable}
        onRefresh={handleRefresh}
        loading={loading}
        allowSearch={true}
        allowImportExport={true}
        rowKey="id"
      />
    )
  }
}

// 生成所有主数据页面
const masterDataPages = {}
Object.keys(MASTER_DATA_DEFS).forEach(key => {
  masterDataPages[key] = createMasterDataPage(key, 'master')
})

// 生成所有映射表页面
const mappingTablePages = {}
Object.keys(MAPPING_TABLE_DEFS).forEach(key => {
  mappingTablePages[key] = createMasterDataPage(key, 'mapping')
})

export { mappingTablePages }
export default masterDataPages
