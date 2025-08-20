import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "@/contexts/AuthContext"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("annual")

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited access to all notes",
        "Download notes for offline reading",
        "Advanced bookmark features",
        "Priority customer support"
      ]
    },
    {
      id: "annual",
      name: "Annual",
      price: "$79.99",
      period: "per year",
      originalPrice: "$119.88",
      savings: "Save 33%",
      popular: true,
      features: [
        "Everything in Monthly",
        "2 months free",
        "Exclusive study guides",
        "Early access to new content"
      ]
    }
  ]

  const benefits = [
    {
      icon: "BookOpen",
      title: "Complete Access",
      description: "Read all pages of every note without restrictions"
    },
    {
      icon: "Download",
      title: "Offline Reading",
      description: "Download notes to study without internet connection"
    },
    {
      icon: "Bookmark",
      title: "Advanced Bookmarks",
      description: "Create multiple bookmarks and organize your progress"
    },
    {
      icon: "Zap",
      title: "Premium Features",
      description: "Access to exclusive study tools and content"
    },
    {
      icon: "Shield",
      title: "Secure & Reliable",
      description: "Your progress is always saved and synchronized"
    },
    {
      icon: "Headphones",
      title: "Priority Support",
      description: "Get help when you need it with priority assistance"
    }
  ]

const handleUpgrade = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/premium' } } })
      return
    }

    if (user.isPremium) {
      toast.info("You're already a Premium member!")
      return
    }

    try {
      await upgradeToPremium()
      toast.success("Congratulations! Welcome to Premium!")
    } catch (err) {
      toast.error("Error processing upgrade. This is a demo!")
    }
  }

  const { user, upgradeToPremium } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-primary-light/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Crown" className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Upgrade to
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent ml-2">
              Premium
            </span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Unlock unlimited access to comprehensive medical study notes and advanced features 
            designed to accelerate your learning.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer",
                  selectedPlan === plan.id
                    ? "border-primary shadow-lg shadow-primary/20 transform scale-[1.02]"
                    : "border-gray-200 hover:border-primary/50 hover:shadow-lg"
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-text-secondary">
                      {plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className="mt-2">
                      <span className="text-text-secondary line-through mr-2">
                        {plan.originalPrice}
                      </span>
                      <span className="text-green-600 font-medium">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <ApperIcon name="Check" className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
<div className="text-center mt-8">
            <Button 
              size="xl"
              onClick={handleUpgrade}
              className="w-full sm:w-auto px-12"
              disabled={user?.isPremium}
            >
              <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
              {user?.isPremium ? 'Already Premium!' : user ? 'Start Premium Now' : 'Sign In to Upgrade'}
            </Button>
            <p className="text-sm text-text-secondary mt-4">
              {user?.isPremium ? 'Thank you for being a Premium member!' : '30-day money-back guarantee • Cancel anytime'}
            </p>
            {!user && (
              <p className="text-sm text-primary mt-2">
                <button 
                  onClick={() => navigate('/signup')}
                  className="underline hover:no-underline"
                >
                  Create a free account
                </button> to get started
              </p>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-text-secondary">
              Premium features designed specifically for medical students
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ApperIcon name={benefit.icon} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-text-primary mb-6 text-center">
              Secure Payment Options
            </h3>
            
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="flex items-center gap-3">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-primary" />
                <span className="text-text-secondary">Credit Card</span>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Smartphone" className="w-6 h-6 text-primary" />
                <span className="text-text-secondary">M-Pesa</span>
              </div>
              <div className="flex items-center gap-3">
                <ApperIcon name="Shield" className="w-6 h-6 text-primary" />
                <span className="text-text-secondary">Secure</span>
              </div>
            </div>
            
            <p className="text-center text-text-secondary text-sm">
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PremiumPage