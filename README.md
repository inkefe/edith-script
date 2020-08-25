# Edith 监控平台script

上报前端错误到Edith后台

---

## 安装

```bash
npm install @inke-design/edith-script -save
```

## 使用方式

```javascript
// entry.js

import Edith from '@inke-design/edith-script'

Edith.init({
  apiKey: 'apikey', // 用于区分不同项目
  slientDev: true, // 开发环境下不上报
  plugins: [ // 内置插件
    'breadcrumbs',
    'redo',
    'network'
  ]
})
```
