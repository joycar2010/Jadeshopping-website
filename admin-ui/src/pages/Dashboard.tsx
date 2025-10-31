import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AdminPermissionPanel from '../components/AdminPermissionPanel'

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>仪表盘</Typography>
      {/* 当前账户权限面板（统一样式） */}
      <AdminPermissionPanel />
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">这里将展示关键指标、订单与用户统计的概览。</Typography>
      </Paper>
    </Box>
  )
}