import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from "react-router-dom";

import Home from './components/Home'
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Request from './components/Request';
import Payment from './components/Payment'
import Pay from './components/Pay';
import Feedback from './components/Feedback'
import History  from './components/History'
import Staffdashboard from './components/Staffdashboard';
import Admindashboard from './components/Admindashboard';
import Tracking from './components/Tracking'
import Booking from './components/Booking'
import Complaint from './components/Complaint'


function App() {

  return (
    


    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/home" />} />
        <Route path='/home' element={<Home />} />
        <Route path='/sign' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/request' element={<Request />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/pay' element={<Pay />} />
        <Route path='/feed' element={<Feedback />} />
        <Route path='/history' element={<History />} />
        <Route path='/staff' element={<Staffdashboard/>} />
        <Route path='/admindash' element={<Admindashboard />} />
        <Route path='/track' element={<Tracking/>} />
        <Route path='/booking' element={<Booking/>} />
        <Route path='/complaint' element={<Complaint/>} />
        
      </Routes>
    </BrowserRouter>

  )
}

export default App
