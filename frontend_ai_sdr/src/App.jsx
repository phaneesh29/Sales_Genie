import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import NotFound from './pages/NotFound'
import AdminRegister from './pages/AdminRegister'
import AdminDashboard from './pages/AdminDashboard'
import AdminSettings from './pages/AdminSettings'
import AllAdmins from './pages/AllAdmins'
import UploadLeads from './pages/UploadLeads'
import AddLead from './pages/AddLead'
import LeadDetails from './pages/LeadDetails'
import LandingPage from './pages/LandingPage'
import LeadSearch from './pages/LeadSearch'
import AllMeetings from './pages/AllMeetings'
import ReadyForMeeting from './pages/ReadyForMeeting'
import EditWorkFlow from './pages/EditWorkFlow'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/all" element={<AllAdmins />} />
        <Route path="/lead/upload" element={<UploadLeads />} />
        <Route path="/lead/add" element={<AddLead />} />
        <Route path="/lead/:id" element={<LeadDetails />} />
        <Route path="/lead/search" element={<LeadSearch />} />
        <Route path="/lead/meeting/all" element={<AllMeetings />} />
        <Route path="/meeting/ready/:id" element={<ReadyForMeeting />} />
        <Route path="/edit/workflow" element={<EditWorkFlow />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  )
}

export default App