import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = forwardRef(({ 
  title = "No items found", 
  message = "There are no items to display at the moment.",
  action,
  actionLabel = "Get Started",
  icon = "FileText",
  className, 
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )} 
      {...props}
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-8 h-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-3">
        {title}
      </h3>
      
      <p className="text-text-secondary mb-6 max-w-md">
        {message}
      </p>
      
      {action && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
})

Empty.displayName = "Empty"

export default Empty