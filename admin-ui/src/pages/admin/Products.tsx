import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AdminPermissionPanel from '../../components/AdminPermissionPanel'

export default function Products() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>商品管理</Typography>
      {/* 当前账户权限面板（统一样式） */}
      <AdminPermissionPanel />
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">占位：分类、商品信息、上下架、图片管理。</Typography>
      </Paper>
    </Box>
  )
}