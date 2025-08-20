import { cn } from "@/utils/cn"

const Loading = ({ variant = "default", className, ...props }) => {
  if (variant === "cards") {
    return (
      <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)} {...props}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-surface rounded-lg p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4 shimmer"></div>
            <div className="h-6 bg-gray-200 rounded mb-3 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 shimmer"></div>
            <div className="h-10 bg-gray-200 rounded shimmer"></div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "pdf") {
    return (
      <div className={cn("bg-white rounded-lg shadow-lg overflow-hidden", className)} {...props}>
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32 shimmer"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded shimmer"></div>
              <div className="h-8 w-8 bg-gray-200 rounded shimmer"></div>
              <div className="h-8 w-8 bg-gray-200 rounded shimmer"></div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="h-96 bg-gray-200 rounded-lg mb-4 shimmer"></div>
            <div className="flex justify-center">
              <div className="h-10 bg-gray-200 rounded w-24 shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)} {...props}>
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-text-secondary">Loading...</span>
      </div>
    </div>
  )
}

export default Loading