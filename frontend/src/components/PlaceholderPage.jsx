import { Card, Empty } from 'antd'

export default function PlaceholderPage({ title, description }) {
  return (
    <Card
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 500,
      }}
    >
      <Empty
        description={description || '功能开发中，敬请期待'}
        style={{ marginBottom: 24 }}
      />
      <div style={{ textAlign: 'center', color: '#999', marginTop: 16 }}>
        <p>【{title || '功能模块'}】</p>
        <p style={{ fontSize: 12 }}>该功能暂未开放，请稍候...</p>
      </div>
    </Card>
  )
}
