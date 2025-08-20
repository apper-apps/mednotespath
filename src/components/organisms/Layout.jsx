import Header from "@/components/organisms/Header"
import AIChatBubble from "@/components/molecules/AIChatBubble"
const Layout = ({ children }) => {
  return (
<div className="min-h-screen bg-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <AIChatBubble />
    </div>
  )
}

export default Layout