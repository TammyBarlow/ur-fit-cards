import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  Grid,
  Container
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getAllChallenges,
  getJoinedChallenges,
  joinChallenge,
} from "../services/api";
import ChallengeCard from "../components/ChallengeCard";

const Challenges = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;

  try {
    if (token) user = jwtDecode(token);
  } catch {
    user = null;
  }

  const [tab, setTab] = useState(0);
  const [allChallenges, setAllChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const res = await getAllChallenges(token);
    setAllChallenges(res.data);
    setLoading(false);
  };

  const fetchJoined = async () => {
    setLoading(true);
    const res = await getJoinedChallenges(token);
    setJoinedChallenges(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "coordinator") {
      navigate("/coordinator-challenges");
      return;
    }
    fetchAll();
    fetchJoined();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleJoin = async (challengeId) => {
    await joinChallenge(challengeId, token);
    fetchAll();
    fetchJoined();
  };

  const isJoined = (challengeId) =>
    joinedChallenges.some((c) => c._id === challengeId);

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Navbar user={user} onLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 3,
          }}
        >
          Wellness Challenges
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                backgroundColor: "black", // Black indicator
              },
            }}
          >
            <Tab
              label="All Challenges"
              sx={{
                py: 2.5,
                fontWeight: 500,
                color: tab === 0 ? "black" : "text.secondary",
                "&.Mui-selected": {
                  color: "black", // Black when selected
                },
              }}
            />
            <Tab
              label="My Challenges"
              sx={{
                py: 2.5,
                fontWeight: 500,
                color: tab === 1 ? "black" : "text.secondary",
                "&.Mui-selected": {
                  color: "black", // Black when selected
                },
              }}
            />
          </Tabs>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <Grid
            container
            spacing={4}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
              "@media (max-width: 1200px)": {
                gridTemplateColumns: "repeat(3, 1fr)",
              },
              "@media (max-width: 900px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              "@media (max-width: 600px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {tab === 0 ? (
              allChallenges.length === 0 ? (
                <Grid item xs={12} sx={{ gridColumn: "1 / -1" }}>
                  <Box textAlign="center" py={6}>
                    <Typography variant="h6" color="text.secondary">
                      No challenges available at the moment
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                allChallenges
                  .filter((challenge) => !isJoined(challenge._id))
                  .map((challenge) => (
                    <Box key={challenge._id} sx={{ width: "100%" }}>
                      <ChallengeCard
                        challenge={challenge}
                        isJoined={isJoined(challenge._id)}
                        onJoin={handleJoin}
                      />
                    </Box>
                  ))
              )
            ) : (
              joinedChallenges.length === 0 ? (
                <Grid item xs={12} sx={{ gridColumn: "1 / -1" }}>
                  <Box textAlign="center" py={6}>
                    <Typography variant="h6" color="text.secondary">
                      You haven't joined any challenges yet
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                joinedChallenges.map((challenge) => (
                  <Box key={challenge._id} sx={{ width: "100%" }}>
                    <ChallengeCard
                      challenge={challenge}
                      isJoined={true}
                      onJoin={handleJoin}
                    />
                  </Box>
                ))
              )
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Challenges;
