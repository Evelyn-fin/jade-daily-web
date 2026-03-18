import express from "express";
import cors from "cors";
import dailyQuoteRoutes from "./routes/daily-quotes.js";
import todoRoutes from "./routes/todos.js";
import inspirationRoutes from "./routes/inspirations.js";
import { db } from "./db/index.js";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors({
  origin: '*', // 允许所有来源，实际部署时建议改为具体域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// 路由
app.use('/api/v1/daily-quotes', dailyQuoteRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/inspirations', inspirationRoutes);

// 启动服务器
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
  console.log(`API Base URL: http://localhost:${port}/api/v1`);
});
