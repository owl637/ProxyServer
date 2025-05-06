const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const PORT = process.env.PORT || 5000

// アクセス数制限の設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 3, // 最大リクエスト数
  message: "リクエストが多すぎます。しばらく待ってから再度お試しください。",
})
// app.use(limiter)

app.listen(PORT, () => {
  console.log(`localhostのポート${PORT}でリッスンしています`)
})

// ミドルウェア
// プロキシサーバーの設定
app.use("/corona-tracker-world-data", limiter, (req, res, next) => {
  createProxyMiddleware({
      target: process.env.BASE_API_URL_CORONA_WORLD,
      changeOrigin: true,
      pathRewrite: {
          [`^/corona-tracker-world-data`]: "",
      },
  })(req, res, next)
})

// ルーティング
// GETリクエストを受け取る
app.get('/', (req, res) => {
  res.send('Hello World!')
})
