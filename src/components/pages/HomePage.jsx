import { useNavigate } from "react-router-dom"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const HomePage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: "BookOpen",
      title: "Comprehensive Notes",
      description: "Access detailed study materials for Anatomy, Histology, and Embryology"
    },
    {
      icon: "Smartphone",
      title: "Study Anywhere",
      description: "Responsive design works perfectly on phones, tablets, and laptops"
    },
    {
      icon: "Bookmark",
      title: "Save Progress",
      description: "Bookmark pages and continue reading where you left off"
    },
    {
      icon: "Zap",
      title: "Fast Access",
      description: "Quick search and organized categories for efficient studying"
    }
  ]

  const subjects = [
    {
      name: "Anatomy",
      icon: "User",
      description: "Human body structure and systems",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Histology", 
      icon: "Microscope",
      description: "Tissue structure and function",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Embryology",
      icon: "Dna",
      description: "Development and formation",
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Stethoscope" className="w-10 h-10 text-white" />
              </div>
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              <span>MedNotes</span>
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent ml-2">
                Pro
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-text-secondary mb-4 font-medium">
              Study Anywhere, Anytime
            </p>
            
            <p className="text-lg text-text-secondary mb-12 max-w-2xl mx-auto">
              Access comprehensive medical study notes for Anatomy, Histology, and Embryology. 
              Designed for medical students who need reliable, organized content on any device.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="xl"
                onClick={() => navigate("/library")}
                className="w-full sm:w-auto"
              >
                <ApperIcon name="BookOpen" className="w-5 h-5 mr-2" />
                Browse Notes
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={() => navigate("/premium")}
                className="w-full sm:w-auto"
              >
                <ApperIcon name="Crown" className="w-5 h-5 mr-2" />
                View Premium
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary-light/20 to-transparent rounded-full blur-3xl"></div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Study Materials
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Comprehensive notes covering the essential subjects for medical education
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                onClick={() => navigate(`/library/${subject.name.toLowerCase()}`)}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-gray-100"
              >
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br",
                  subject.color
                )}>
                  <ApperIcon name={subject.icon} className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {subject.name}
                </h3>
                
                <p className="text-text-secondary mb-6">
                  {subject.description}
                </p>
                
                <div className="flex items-center text-primary font-medium">
                  <span>Explore Notes</span>
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Why Choose MedNotes Pro?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Built specifically for medical students with features that enhance your learning experience
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary-light/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to Start Studying?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Join thousands of medical students who trust MedNotes Pro for their studies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/library")}
            >
              <ApperIcon name="BookOpen" className="w-5 h-5 mr-2" />
              Start Learning
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/premium")}
            >
              <ApperIcon name="Crown" className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage