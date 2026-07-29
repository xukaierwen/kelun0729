import React from 'react';
import { Form, Input, InputNumber, Switch, Button, Card, Row, Col, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

function SystemParams() {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      // TODO: 调用API保存参数
      console.log('保存系统参数:', values);
      message.success('系统参数保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          seasonCoefficient: 1.0,
          priceAlertThreshold: 10,
          enableNegativeGrossProfit: false,
          enableConversionValidation: true,
          budgetCycleMonth: 10,
        }}
      >
        <h3 style={{ marginBottom: 24 }}>预测默认参数</h3>
        
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="季节系数默认值"
              name="seasonCoefficient"
              rules={[{ required: true, message: '请输入季节系数' }]}
            >
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="价差预警阈值(%)"
              name="priceAlertThreshold"
              rules={[{ required: true, message: '请输入预警阈值' }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: '100%' }}
                addonAfter="%"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="允许负毛利"
              name="enableNegativeGrossProfit"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="转换系数校验"
              name="enableConversionValidation"
              valuePropName="checked"
            >
              <Switch defaultChecked />
            </Form.Item>
          </Col>
        </Row>

        <h3 style={{ marginBottom: 24, marginTop: 32 }}>预算周期配置</h3>
        
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="年度预算启动月份"
              name="budgetCycleMonth"
              rules={[{ required: true, message: '请选择月份' }]}
            >
              <InputNumber
                min={1}
                max={12}
                style={{ width: '100%' }}
                addonAfter="月"
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="半年度调整月份"
              name="halfYearCycleMonth"
              initialValue={7}
              rules={[{ required: true, message: '请选择月份' }]}
            >
              <InputNumber
                min={1}
                max={12}
                style={{ width: '100%' }}
                addonAfter="月"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default SystemParams;
