import React from "react";
import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import { ToastContainer } from 'react-toastify';
import '../styles/app.scss';
import 'react-toastify/dist/ReactToastify.css';
import CoffeeCard from './CoffeeBatch/CoffeeCard';
import Company from './Company';
import Dashboard from './Dashboard';
import Loading from './Loading';
import Login from './Login';
import { Profile, List as FarmerList } from './Farmer/index';
import Signup from './Signup';
import { useAuthContext } from '../states/AuthContext';
import RequiredAuth from '../states/RequiredAuth';
import { Create, List, PublicList } from './CoffeeBatch';
import Landing from './CoffeeBatch/Landing';
import Cupping from './Cupping';
import Certification from './Certification';
import { NewList } from './Farmer/NewList';
import { FarmsNewList } from './Farm';
import { CoffeBatchNewList } from './CoffeeBatch/NewList';
import CoffeeBatchId from './CoffeeBatch/CoffeBatchID';
import { FarmsModule } from './Cafepsa/FarmsModule';
import { CertificationsModule } from './Cafepsa/CertificationsModule';
import { FarmersModules } from './Cafepsa/FarmersModules';
import { BatchesModule } from './Cafepsa/BatchesModule';
import NewBatchId from './Cafepsa/NewBatchId';
import { FarmerProfileModule } from './Cafepsa/FarmerProfile';
import { AdminModule } from './Admin';

const Home = () => {
  const { authState, authContext } = useAuthContext();
  const [state] = authState;
  const CurrentLocalhost: string | null = localStorage.getItem('host');
  const location = window.location.host;
  if (
    location.match(`${CurrentLocalhost}`) !== null &&
    state.isLoggedIn !== true
  ) {
  } else {
    if (state.isLoggedIn !== false) {
      authContext.signOut();
    } else {
    }
  }

  if (state.isLoading || state.isSigningIn) {
    return <Loading label="" className="loading-wrapper" />;
  }

  return (
    <div className="">
      <ToastContainer limit={4} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/list"
          element={
            <RequiredAuth>
              <Dashboard>
                <CoffeBatchNewList />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequiredAuth>
              <Dashboard>
                <AdminModule />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequiredAuth>
              <Dashboard>
                <Create />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/farmers"
          element={
            <RequiredAuth>
              <Dashboard>
                <NewList />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/farmers-module"
          element={
            <RequiredAuth>
              <Dashboard>
                <FarmersModules />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/farms-module"
          element={
            <RequiredAuth>
              <Dashboard>
                <FarmsModule />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/batches-module"
          element={
            <RequiredAuth>
              <Dashboard>
                <BatchesModule />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/certification-module"
          element={
            <RequiredAuth>
              <Dashboard>
                <CertificationsModule />
              </Dashboard>
            </RequiredAuth>
          }
        />

        <Route
          path="/farms"
          element={
            <RequiredAuth>
              <Dashboard>
                <FarmsNewList />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/cupping"
          element={
            <RequiredAuth>
              <Dashboard>
                <Cupping />
              </Dashboard>
            </RequiredAuth>
          }
        />
        <Route
          path="/certification"
          element={
            <RequiredAuth>
              <Dashboard>
                <Certification />
              </Dashboard>
            </RequiredAuth>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/batch/:batchId" element={<CoffeeBatchId />} />
        <Route path="/newbatch/:batchId" element={<NewBatchId />} />
        <Route path="/coffeebatches" element={<PublicList />} />

        <Route path="/farmer/:farmerId" element={<Profile />} />
        <Route
          path="/newfarmer/:newfarmerId"
          element={<FarmerProfileModule />}
        />
        <Route path="/company/:companyId" element={<Company />} />
      </Routes>
    </div>
  );
};

export default Home;
