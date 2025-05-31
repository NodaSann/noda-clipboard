// 数据库配置模板，社区版请根据实际环境修改
module.exports = {
    ip: process.env.DB_IP || '127.0.0.1',
    port: process.env.DB_PORT || 27017,
    path: process.env.DB_NAME || 'local_clipboard'
}
// 如需部署到生产环境，请设置环境变量 DB_IP、DB_PORT、DB_NAME
