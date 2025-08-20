import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'

function AccountPage() {
  const { user, updateUser, upgradeToPremium, logout, loading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsUpdating(true)
    
    try {
      await updateUser(formData)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    try {
      await upgradeToPremium()
      toast.success('Congratulations! You are now a Premium member!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (err) {
      toast.error('Error logging out')
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            My Account
          </h1>
          <p className="text-lg text-text-secondary">
            Manage your profile and subscription settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">
                  Profile Information
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user.name,
                          email: user.email
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Full Name
                    </label>
                    <p className="text-text-primary">{user.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Email Address
                    </label>
                    <p className="text-text-primary">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Member Since
                    </label>
                    <p className="text-text-primary">
                      {format(new Date(user.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Subscription Status
              </h3>
              
              <div className="text-center mb-6">
                {user.isPremium ? (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="Crown" className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="text-yellow-700 bg-yellow-100 border-yellow-200 mb-2">
                      Premium Member
                    </Badge>
                    <p className="text-sm text-text-secondary">
                      Upgraded on {format(new Date(user.premiumUpgradedAt), "MMM d, yyyy")}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="User" className="w-8 h-8 text-gray-500" />
                    </div>
                    <Badge variant="outline" className="mb-2">
                      Free Account
                    </Badge>
                    <p className="text-sm text-text-secondary">
                      Limited access to premium features
                    </p>
                  </>
                )}
              </div>

              {!user.isPremium && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </>
                  )}
                </Button>
              )}

              {user.isPremium && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <ApperIcon name="Check" className="w-4 h-4" />
                    Unlimited note access
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <ApperIcon name="Check" className="w-4 h-4" />
                    Advanced bookmarking
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <ApperIcon name="Check" className="w-4 h-4" />
                    Priority support
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/progress')}
                >
                  <ApperIcon name="TrendingUp" className="w-4 h-4 mr-3" />
                  View My Progress
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/library')}
                >
                  <ApperIcon name="BookOpen" className="w-4 h-4 mr-3" />
                  Browse Library
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <ApperIcon name="LogOut" className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountPage