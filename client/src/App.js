import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import UserProfile from './components/UserProfile';
import ReviewForm from './components/ReviewForm';
import NavBar from './components/NavBar';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/review" element={<ReviewForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
