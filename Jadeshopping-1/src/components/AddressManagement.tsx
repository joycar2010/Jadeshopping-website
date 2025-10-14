import React, { useState, useEffect } from 'react'
import { Plus, MapPin, Edit2, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import AddressForm, { type AddressFormData } from './AddressForm'
import { UserService } from '@/services/userService'
import type { UserAddress } from '@/types'

interface AddressManagementProps {
  userId: string
}

const AddressManagement: React.FC<AddressManagementProps> = ({ userId }) => {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [userId])

  const loadAddresses = async () => {
    try {
      setLoading(true)
      const userAddresses = await UserService.getUserAddresses(userId)
      setAddresses(userAddresses)
    } catch (error) {
      console.error('Failed to load addresses:', error)
      toast.error('加载地址失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData: AddressFormData) => {
    try {
      setFormLoading(true)
      
      if (editingAddress) {
        // Update existing address
        await UserService.updateUserAddress({
          id: editingAddress.id,
          user_id: userId,
          ...formData
        })
        toast.success('地址更新成功')
      } else {
        // Add new address
        await UserService.addUserAddress({
          user_id: userId,
          ...formData
        })
        toast.success('地址添加成功')
      }
      
      setShowForm(false)
      setEditingAddress(null)
      await loadAddresses()
    } catch (error) {
      console.error('Address operation failed:', error)
      toast.error(editingAddress ? '地址更新失败' : '地址添加失败')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('确定要删除这个地址吗？')) {
      return
    }

    try {
      setActionLoading(addressId)
      await UserService.deleteUserAddress(addressId)
      toast.success('地址删除成功')
      await loadAddresses()
    } catch (error) {
      console.error('Failed to delete address:', error)
      toast.error('地址删除失败')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      setActionLoading(addressId)
      await UserService.setDefaultAddress(userId, addressId)
      toast.success('默认地址设置成功')
      await loadAddresses()
    } catch (error) {
      console.error('Failed to set default address:', error)
      toast.error('设置默认地址失败')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">收货地址管理</h3>
        <button
          onClick={handleAddAddress}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加地址
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">暂无收货地址</p>
          <button
            onClick={handleAddAddress}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            添加第一个地址
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-900">{address.name}</span>
                    <span className="ml-3 text-gray-600">{address.phone}</span>
                    {address.is_default && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="w-3 h-3 mr-1" />
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {address.province} {address.city} {address.district}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{address.address}</p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={actionLoading === address.id}
                      className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                    >
                      {actionLoading === address.id ? '设置中...' : '设为默认'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-gray-600 hover:text-gray-800"
                    title="编辑地址"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={actionLoading === address.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    title="删除地址"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressForm
          address={editingAddress}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingAddress(null)
          }}
          isLoading={formLoading}
        />
      )}
    </div>
  )
}

export default AddressManagement