import React from 'react';
import { Tabs } from 'antd';
import SystemParams from './SystemParams';
import WorkflowConfig from './WorkflowConfig';
import DictionaryManage from './DictionaryManage';

const items = [
  {
    key: 'params',
    label: '系统参数配置',
    children: <SystemParams />,
  },
  {
    key: 'workflow',
    label: '审批流程配置',
    children: <WorkflowConfig />,
  },
  {
    key: 'dictionary',
    label: '字典管理',
    children: <DictionaryManage />,
  },
];

function SystemConfig() {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统公共配置</h2>
      <Tabs defaultActiveKey="params" items={items} />
    </div>
  );
}

export default SystemConfig;
