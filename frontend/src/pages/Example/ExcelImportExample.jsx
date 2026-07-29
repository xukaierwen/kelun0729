import React from 'react';
import { Card, message } from 'antd';
import ExcelImportExport from '../../components/ExcelImportExport';

// 示例:产品主数据导入导出
function ProductImportExample() {
  // 列配置
  const columns = [
    { title: '物料编码', dataIndex: 'materialCode', required: true },
    { title: '通用名', dataIndex: 'genericName', required: true },
    { title: '规格', dataIndex: 'specification', required: true },
    { title: '包装', dataIndex: 'packaging', required: false },
    { title: '生产基地', dataIndex: 'productionBase', required: true },
    { title: '批文', dataIndex: 'approvalNumber', required: false },
    { title: '集采属性', dataIndex: 'collectionAttribute', required: true },
    { title: '医保属性', dataIndex: 'insuranceAttribute', required: false },
  ];

  // 校验规则
  const validateRules = {
    required: ['materialCode', 'genericName', 'specification'],
  };

  // 导入成功回调
  const handleImportSuccess = (data) => {
    console.log('导入的数据:', data);
    message.success(`成功导入 ${data.length} 条产品数据`);
    // TODO: 调用API保存到数据库
  };

  // 模拟导出数据
  const exportData = [
    {
      materialCode: 'P001',
      genericName: '阿莫西林胶囊',
      specification: '0.25g*24粒',
      packaging: '盒',
      productionBase: '成都基地',
      approvalNumber: '国药准字H20000001',
      collectionAttribute: '集采',
      insuranceAttribute: '甲类',
    },
  ];

  return (
    <Card title="产品主数据 - Excel导入导出示例">
      <ExcelImportExport
        templateName="产品主数据"
        columns={columns}
        onImportSuccess={handleImportSuccess}
        exportData={exportData}
        validateRules={validateRules}
      />
    </Card>
  );
}

export default ProductImportExample;
