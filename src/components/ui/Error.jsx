import { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = forwardRef(({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content. Please try again.", 
  onRetry,
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
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-3">
        {title}
      </h3>
      
      <p className="text-text-secondary mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
})

Error.displayName = "Error"

export default Error