import React, { useState } from 'react';
import { Button, Upload, message, Table, Modal, Space } from 'antd';
import { UploadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './ExcelImportExport.css';

/**
 * Excel导入导出公共组件
 * @param {Object} props
 * @param {string} props.templateName - 模板名称
 * @param {Array} props.columns - 列配置
 * @param {Function} props.onImportSuccess - 导入成功回调
 * @param {Array} props.exportData - 导出数据
 * @param {Object} props.validateRules - 校验规则配置
 */
function ExcelImportExport({
  templateName = '数据模板',
  columns = [],
  onImportSuccess,
  exportData = [],
  validateRules = {},
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [importedFile, setImportedFile] = useState(null);

  // 下载模板
  const downloadTemplate = () => {
    const templateColumns = columns.map(col => ({
      title: col.title,
      key: col.dataIndex,
    }));

    // 创建空数据
    const data = [{}];
    columns.forEach(col => {
      data[0][col.dataIndex] = '';
    });

    const ws = XLSX.utils.json_to_sheet(data, {
      header: columns.map(col => col.dataIndex),
    });

    // 设置表头
    const headerRow = columns.map(col => col.title);
    XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '模板');
    XLSX.writeFile(wb, `${templateName}_模板.xlsx`);
    message.success('模板下载成功');
  };

  // 导出数据
  const exportExcel = () => {
    if (!exportData || exportData.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '数据');
    XLSX.writeFile(wb, `${templateName}_${new Date().getTime()}.xlsx`);
    message.success('导出成功');
  };

  // 处理导入文件
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 数据校验
        const validationResult = validateData(jsonData);
        if (!validationResult.success) {
          message.error(validationResult.message);
          return;
        }

        setImportedFile(file.name);
        setPreviewData(jsonData);
        message.success(`成功读取 ${jsonData.length} 条数据`);

        // 调用成功回调
        if (onImportSuccess) {
          onImportSuccess(jsonData);
        }
      } catch (error) {
        message.error('文件解析失败,请检查文件格式');
        console.error('Excel解析错误:', error);
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // 阻止自动上传
  };

  // 数据校验
  const validateData = (data) => {
    if (!data || data.length === 0) {
      return { success: false, message: '导入数据为空' };
    }

    // 必填字段校验
    if (validateRules.required) {
      for (let i = 0; i < data.length; i++) {
        for (const field of validateRules.required) {
          if (!data[i][field]) {
            return {
              success: false,
              message: `第 ${i + 1} 行缺少必填字段: ${field}`,
            };
          }
        }
      }
    }

    return { success: true, message: '校验通过' };
  };

  // 预览数据
  const showPreview = () => {
    if (previewData.length === 0) {
      message.warning('请先导入数据');
      return;
    }
    setPreviewVisible(true);
  };

  // 预览表格列
  const previewColumns = columns.map(col => ({
    title: col.title,
    dataIndex: col.dataIndex,
    key: col.dataIndex,
    ellipsis: true,
  }));

  return (
    <div className="excel-import-export">
      <Space className="toolbar">
        <Upload
          accept=".xlsx,.xls"
          showUploadList={false}
          beforeUpload={handleFileUpload}
        >
          <Button icon={<UploadOutlined />}>导入Excel</Button>
        </Upload>

        <Button
          icon={<DownloadOutlined />}
          onClick={downloadTemplate}
        >
          下载模板
        </Button>

        <Button
          icon={<DownloadOutlined />}
          onClick={exportExcel}
          disabled={exportData.length === 0}
        >
          导出数据
        </Button>

        <Button
          icon={<EyeOutlined />}
          onClick={showPreview}
          disabled={previewData.length === 0}
        >
          预览数据
        </Button>

        {importedFile && (
          <span className="file-info">
            已导入: {importedFile}
          </span>
        )}
      </Space>

      {/* 数据预览弹窗 */}
      <Modal
        title="数据预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={1200}
      >
        <Table
          columns={previewColumns}
          dataSource={previewData}
          rowKey={(record, index) => index}
          size="small"
          scroll={{ x: true }}
          pagination={{ pageSize: 20 }}
        />
      </Modal>
    </div>
  );
}

export default ExcelImportExport;
