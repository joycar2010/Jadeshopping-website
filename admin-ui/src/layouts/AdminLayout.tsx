import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import StorefrontIcon from '@mui/icons-material/Storefront'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import CampaignIcon from '@mui/icons-material/Campaign'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ReplayIcon from '@mui/icons-material/Replay'
import PaymentIcon from '@mui/icons-material/Payment'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HistoryIcon from '@mui/icons-material/History'

const drawerWidth = 240

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  function logout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const navItems = [
    { label: '仪表盘', path: '/admin', icon: <DashboardIcon /> },
    { label: '用户管理', path: '/admin/users', icon: <PeopleIcon /> },
    { label: '商品管理', path: '/admin/products', icon: <StorefrontIcon /> },
    { label: '会员管理', path: '/admin/members', icon: <CardMembershipIcon /> },
    { label: '营销管理', path: '/admin/marketing', icon: <CampaignIcon /> },
    { label: '订单管理', path: '/admin/orders', icon: <ShoppingCartIcon /> },
    { label: '回购管理', path: '/admin/buyback', icon: <ReplayIcon /> },
    { label: '支付管理', path: '/admin/payments', icon: <PaymentIcon /> },
    { label: '发货管理', path: '/admin/shipping', icon: <LocalShippingIcon /> },
    { label: '网站服务管理', path: '/admin/services', icon: <MiscellaneousServicesIcon /> },
    { label: '操作员管理', path: '/admin/operators', icon: <AdminPanelSettingsIcon /> },
    { label: '操作日志', path: '/admin/logs', icon: <HistoryIcon /> },
  ]

  const drawer = (
    <Box role="navigation" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          后台管理
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path)
              setMobileOpen(false)
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {token ? (
          <Button fullWidth variant="contained" color="primary" onClick={logout}>
            退出登录
          </Button>
        ) : (
          <Button fullWidth variant="outlined" onClick={() => navigate('/admin/login')}>
            登录
          </Button>
        )}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isMdUp && (
            <IconButton edge="start" aria-label="menu" onClick={() => setMobileOpen((v) => !v)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            管理后台
          </Typography>
          {token ? (
            <Button color="primary" variant="contained" onClick={logout}>
              退出
            </Button>
          ) : (
            <Button color="primary" variant="outlined" onClick={() => navigate('/admin/login')}>
              登录
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* 侧边栏 */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {isMdUp ? (
          <Drawer variant="permanent" open sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      {/* 主内容 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}