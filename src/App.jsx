import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import HomePage from "@/components/pages/HomePage"
import LibraryPage from "@/components/pages/LibraryPage"
import NoteViewerPage from "@/components/pages/NoteViewerPage"
import PremiumPage from "@/components/pages/PremiumPage"
import ProgressPage from "@/components/pages/ProgressPage"
import AdminDashboardPage from "@/components/pages/AdminDashboardPage"
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Layout>
<Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/:subject" element={<LibraryPage />} />
            <Route path="/note/:noteId" element={<NoteViewerPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App