import axios from 'axios';

// 检测是否为 Cloudflare Pages 环境（静态部署，无后端）
const isStaticDeploy = !import.meta.env.VITE_API_BASE_URL && 
  window.location.hostname.includes('pages.dev');

// 创建axios实例
const api = axios.create({
  // 生产环境使用配置的后端地址，开发环境使用 /api
  baseURL: import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : '/api',
  // Cloudflare Pages 静态部署时使用短超时（3秒），快速失败
  timeout: isStaticDeploy ? 3000 : 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 后端连接状态缓存（避免重复检查）
let backendAvailable = null;
let backendCheckTime = 0;

// 快速检测后端是否可用
export async function checkBackendAvailable() {
  // 5分钟内不重复检查
  if (backendAvailable !== null && Date.now() - backendCheckTime < 300000) {
    return backendAvailable;
  }
  
  try {
    await api.get('/health', { timeout: 3000 });
    backendAvailable = true;
    backendCheckTime = Date.now();
    return true;
  } catch {
    backendAvailable = false;
    backendCheckTime = Date.now();
    return false;
  }
}

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('没有权限访问');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('请求失败:', error.response.data);
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // 超时错误 - 标记后端不可用
      backendAvailable = false;
      backendCheckTime = Date.now();
    }
    return Promise.reject(error);
  }
);

export default api;
