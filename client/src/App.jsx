import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import ViewRecipe from './components/ViewRecipe/ViewRecipe';
import ViewMealPlan from './components/ViewMealPlan/ViewMealPlan';
import Navbar from './components/Navbar/Navbar';
import AuthModal from './components/AuthForm/AuthForm';
import Search from './components/Search/Search';
import Recipes from './components/Recipes/Recipes';
import MealPlans from './components/MealPlans/MealPlans';
import Dashboard from './components/Dashboard/Dashboard';
import NewRecipe from './components/NewRecipe/NewRecipe';
import NewMealPlan from './components/NewMealPlan/NewMealPlan';
import EditRecipe from './components/EditRecipe/EditRecipe';
import EditMealPlan from './components/EditMealPlan/EditMealPlan';

import { UserProvider } from './UserContext';

import './index.css';
import EditProfile from './components/EditProfile/EditProfile';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState('login');

  const openAuthModal = (type) => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <UserProvider>
      <Router>
        <Navbar openAuthModal={openAuthModal} />

        <Routes>

          {/* Home */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Recipes */}
          <Route path="/recipes" element={<Recipes />} />

          {/* Meal Plans */}
          <Route path="/mealplans" element={<MealPlans />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* New Recipe */}
          <Route path="/new-recipe" element={<NewRecipe />} />

          {/* New Meal Plan */}
          <Route path="/new-meal-plan" element={<NewMealPlan />} />

          {/* Edit Recipe */}
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />

          {/* Edit Meal Plan */}
          <Route path="/edit-meal-plan/:id" element={<EditMealPlan />} />

          {/* Edit Profile */}
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Recipe View */}
          <Route path="/recipe/:id" element={<ViewRecipe />} />

          {/* Recipe View */}
          <Route path="/meal-plan/:id" element={<ViewMealPlan />} />

          {/* Search */}
          <Route path="/search/:query" element={<Search />} />
        </Routes>

        {isAuthModalOpen && <AuthModal type={authModalType} closeModal={closeAuthModal} />}
      </Router>
    </UserProvider>
  );
}

export default App;
