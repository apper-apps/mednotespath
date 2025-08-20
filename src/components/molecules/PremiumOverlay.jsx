import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const PremiumOverlay = ({ onUpgrade, className, ...props }) => {
  return (
    <div className={cn("premium-overlay rounded-lg p-8 text-center", className)} {...props}>
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="Crown" className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-3">
        Upgrade to Premium
      </h3>
      
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        Unlock unlimited access to complete notes in Anatomy, Histology, and Embryology. 
        Continue your medical education without limits.
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
          <span>Full access to all pages</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
          <span>Download notes offline</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ApperIcon name="Check" className="w-4 h-4 text-green-500" />
          <span>Advanced bookmark features</span>
        </div>
      </div>
      
      <Button onClick={onUpgrade} size="lg" className="w-full sm:w-auto">
        <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
        Upgrade Now
      </Button>
    </div>
  )
}

export default PremiumOverlay