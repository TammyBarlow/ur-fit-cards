import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getAllChallenges, createChallenge } from "../services/api";
import ChallengeModal from "../components/ChallengeModal";
import ChallengeCard from "../components/ChallengeCard";
import strengthImg from "../assets/strengthImg.png";
import hydrationImg from "../assets/hydrationImg.png";
import stepsImg from "../assets/stepsImg.png";
import detoxImg from "../assets/digital_detox.png";
import sleepImg from "../assets/sleep_reset.png";
import healthyImg from "../assets/healthy_snack.png";
import stretchingImg from "../assets/morning_stretch.png";
import yogaImg from "../assets/yoga_beginners.png";

const imageMap = {
  "Strength and Gym Challenge": strengthImg,
  "Hydration Challenge": hydrationImg,
  "10K Steps Challenge": stepsImg,
  "Digital Hour Detox": detoxImg,
  "Sleep Reset Challenge": sleepImg,
  "Healthy Snack Swap": healthyImg,
  "Mindful Morning Stretch": stretchingImg,
  "Yoga for Beginners": yogaImg,
};

const CoordinatorChallenges = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;

  try {
    if (token) user = jwtDecode(token);
  } catch {
    user = null;
  }

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "coordinator") {
      navigate("/challenges");
      return;
    }
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const res = await getAllChallenges(token);
    const challengesWithImages = res.data.map(challenge => ({
      ...challenge,
      imageUrl: imageMap[challenge.title] || challenge.imageUrl
    }));
    setChallenges(challengesWithImages);
    setLoading(false);
  };

  const handleCreateChallenge = async (challengeData) => {
    try {
      await createChallenge(challengeData, token);
      setModalOpen(false);
      fetchChallenges();
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleEditChallenge = (challengeId) => {
    const challengeToEdit = challenges.find(c => c._id === challengeId);
    setCurrentChallenge(challengeToEdit);
    setEditModalOpen(true);
  };

  const handleUpdateChallenge = async (updatedData) => {
    try {
      // Add your API call to update the challenge here
      // await updateChallenge(currentChallenge._id, updatedData, token);
      setEditModalOpen(false);
      fetchChallenges();
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  };

  if (!user || user.role !== "coordinator") return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Navbar user={user} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Coordinator Dashboard
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setModalOpen(true)}
            sx={{
              backgroundColor: '#000',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
          >
            Create New Challenge
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            '@media (max-width: 1200px)': {
              gridTemplateColumns: 'repeat(3, 1fr)'
            },
            '@media (max-width: 900px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            '@media (max-width: 600px)': {
              gridTemplateColumns: '1fr'
            }
          }}>
            {challenges.length === 0 ? (
              <Grid item xs={12} sx={{ gridColumn: '1 / -1' }}>
                <Box textAlign="center" py={6}>
                  <Typography variant="h6" color="text.secondary">
                    No challenges created yet
                  </Typography>
                </Box>
              </Grid>
            ) : (
              challenges.map((challenge) => (
                <Box key={challenge._id} sx={{ width: '100%' }}>
                  <ChallengeCard
                    challenge={challenge}
                    isCoordinator={true}
                    onJoin={() => handleEditChallenge(challenge._id)}
                    isJoined={false}
                  />
                </Box>
              ))
            )}
          </Grid>
        )}

        {/* Create Challenge Modal */}
        <ChallengeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateChallenge}
        />
      </Container>
    </Box>
  );
};

export default CoordinatorChallenges;