import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getAllUsers, getAllChallenges, userEnrollment, getChallengeById } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const EnrollUser = () => {
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [enrolledUserIds, setEnrolledUserIds] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'coordinator') {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [token, navigate]);

  
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const usersData = await getAllUsers(token);
        const challengesData = await getAllChallenges(token);
        setUsers(usersData.data);
        setChallenges(challengesData.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [token]);

  
  useEffect(() => {
    if (!selectedChallenge || !token) return;

    const loadEnrolled = async () => {
      try {
        const challenge = await getChallengeById(selectedChallenge, token);
        const ids = challenge.participants?.map(u => 
          typeof u === 'string' ? u : String(u._id)
        ) || [];
        setEnrolledUserIds(ids);
      } catch (error) {
        console.error('Failed to load enrolled users:', error);
      }
    };
    loadEnrolled();
  }, [selectedChallenge, token]);

  const handleEnroll = async (userId) => {
    if (!selectedChallenge || !token) {
      alert('Please select a challenge first');
      return;
    }

    try {
      await userEnrollment({ userId, challengeId: selectedChallenge }, token);
      const updatedChallenge = await getChallengeById(selectedChallenge, token);
      const updatedIds = updatedChallenge.participants?.map(u => 
        typeof u === 'string' ? u : String(u._id)
      ) || [];
      setEnrolledUserIds(updatedIds);
      alert('Enrollment successful!');
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>User Enrollment</h1>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        alignItems: 'center' 
      }}>
        <TextField
          label="Search users"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px' }}
        />

        <Select
          value={selectedChallenge}
          onChange={(e) => setSelectedChallenge(e.target.value)}
          displayEmpty
          variant="outlined"
          style={{ minWidth: '300px' }}
        >
          <MenuItem value=""><em>Select a challenge</em></MenuItem>
          {challenges.map(challenge => (
            <MenuItem key={challenge._id} value={challenge._id}>
              {challenge.title}
            </MenuItem>
          ))}
        </Select>
      </div>

      <Table style={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <TableHead style={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map(user => (
            <TableRow key={user._id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {enrolledUserIds.includes(String(user._id)) ? (
                  <span style={{ color: '#4caf50' }}>Enrolled</span>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEnroll(user._id)}
                    style={{ 
                      backgroundColor: '#000',
                      color: '#fff',
                      textTransform: 'none'
                    }}
                  >
                    Enroll
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnrollUser;