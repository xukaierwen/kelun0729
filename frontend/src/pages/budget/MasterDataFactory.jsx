import { useState, useEffect, useCallback } from 'react'
import { message, Alert, Empty } from 'antd'
import MasterDataTable from '../../components/MasterDataTable'
import api, { checkBackendAvailable } from '../../api'
import { MASTER_DATA_DEFS, MAPPING_TABLE_DEFS } from '../../data/masterDataDefs'

// 通用页面生成器（支持主数据和映射表）
export function createMasterDataPage(pageKey, defSource = 'master') {
  return function DynamicMasterDataPage() {
    const defs = defSource === 'mapping' ? MAPPING_TABLE_DEFS : MASTER_DATA_DEFS
    const def = defs[pageKey]
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [backendDown, setBackendDown] = useState(false)

    if (!def) {
      return <div>页面配置错误: {pageKey}</div>
    }

    // 加载数据
    const loadData = useCallback(async () => {
      setLoading(true)
      try {
        // 先快速检查后端是否可用
        const available = await checkBackendAvailable()
        if (!available) {
          setBackendDown(true)
          setDataSource([])
          return
        }
        
        setBackendDown(false)
        const res = await api.get(`/master-data/${pageKey}`)
        const data = Array.isArray(res) ? res : (res.data || [])
        setDataSource(data)
      } catch (err) {
        // 只在非后端不可用情况下显示错误
        if (!backendDown) {
          message.error(`加载数据失败: ${err.message}`)
        }
      } finally {
        setLoading(false)
      }
    }, [pageKey, backendDown])

    // 添加
    const handleAdd = async (record) => {
      if (backendDown) {
        message.warning('后端服务不可用，无法新增数据')
        return
      }
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
      if (backendDown) {
        message.warning('后端服务不可用，无法编辑数据')
        return
      }
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
      if (backendDown) {
        message.warning('后端服务不可用，无法操作')
        return
      }
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

    // 后端不可用时显示友好提示
    if (backendDown) {
      return (
        <div style={{ padding: 24 }}>
          <Alert
            message="后端服务不可用"
            description={
              <div>
                <p>当前为静态部署模式，后端 API 服务未连接。</p>
                <p>页面结构已加载，但数据功能暂时不可用。</p>
                <p style={{ marginTop: 8, color: '#666' }}>
                  如需完整功能，请配置后端服务地址。
                </p>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <MasterDataTable
            tableName={def.name}
            columns={def.columns}
            dataSource={[]}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDisable={handleDisable}
            onRefresh={handleRefresh}
            loading={false}
            allowSearch={true}
            allowImportExport={true}
            rowKey="id"
          />
        </div>
      )
    }

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
