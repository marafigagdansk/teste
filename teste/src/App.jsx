// src/App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import PatientsList from './components/PatientsList';
import AddPatient from './components/AddPatient';
import PatientDetail from './components/PatientDetail';
import AddExam from './components/AddExam';
import CustomCalendar from './components/CustomCalendar';
import ExamDetail from './components/ExamDetail';
import ExerciseList from './components/ExerciseList';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ConfirmModal from './components/ConfirmModal';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const initialPatients = [
  {
    id: 1,
    image: 'https://via.placeholder.com/100',
    name: 'John Doe',
    age: 30,
    gender: 'male',
    date: new Date(),
    exams: [],
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/100',
    name: 'Jane Smith',
    age: 25,
    gender: 'female',
    date: new Date(),
    exams: [],
  },
];

const App = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      const defaultUser = {
        username: 'admin',
        password: 'admin123'
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);

  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem('patients');
    return savedPatients ? JSON.parse(savedPatients) : initialPatients;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  const addPatient = (patient) => {
    setPatients([...patients, { ...patient, exams: [] }]);
  };

  const updatePatient = (updatedPatient) => {
    setPatients(
      patients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };

  const deletePatient = (id) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };

  const addExam = (patientId, exam) => {
    setPatients(
      patients.map(patient =>
        patient.id === patientId ? { ...patient, exams: [...(patient.exams || []), exam] } : patient
      )
    );
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteSelected = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteSelected = () => {
    setPatients(patients.filter(patient => !selectedIds.includes(patient.id)));
    setSelectedIds([]);
    setShowConfirmModal(false);
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <div className="main-content">
                <Sidebar />
                <div className="content">
                  <SearchBar setSearchTerm={setSearchTerm} />
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <div className="filters">
                            <button onClick={() => setIsSelectionMode(!isSelectionMode)}>
                              {isSelectionMode ? 'Cancel' : 'Selection Mode'}
                            </button>
                          </div>
                          <PatientsList
                            patients={filteredPatients}
                            isSelectionMode={isSelectionMode}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                            onDeleteSelected={handleDeleteSelected}
                          />
                        </>
                      }
                    />
                    <Route path="/add-patient" element={<AddPatient addPatient={addPatient} />} />
                    <Route path="/patient/:id" element={<PatientDetail patients={patients} updatePatient={updatePatient} deletePatient={deletePatient} />} />
                    <Route path="/patient/:patientId/add-exam" element={<AddExam addExam={addExam} />} />
                    <Route path="/patient/:patientId/exam/:examId" element={<ExamDetail patients={patients} />} />
                    <Route path="/calendar" element={<CustomCalendar patients={patients} addPatient={addPatient} />} />
                    <Route path="/exercises" element={<ExerciseList />} />
                  </Routes>
                  <Link to="/add-patient">
                    <button className="add-patient-button">+</button>
                  </Link>
                </div>
              </div>
              <ConfirmModal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDeleteSelected}
              />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
