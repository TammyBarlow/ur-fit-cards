import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import { getAllChallenges, createChallenge } from "../services/api";
import ChallengeModal from "../components/ChallengeModal";
import ChallengeCard from "../components/ChallengeCard";

const CoordinatorChallenges = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // This checks the user auth
  let user = null;
  try {
    if (token) user = jwtDecode(token);
  } catch {
    user = null;
  }

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
    setChallenges(res.data);
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

  if (!user || user.role !== "coordinator") return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <Navbar user={user} onLogout={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }} />

      <Container maxWidth="lg" style={{ padding: "32px 0" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "32px"
        }}>
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Coordinator Dashboard
          </Typography>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            style={{ backgroundColor: "#000" }}
          >
            Create New Challenge
          </Button>
        </div>

        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            padding: "80px 0" 
          }}>
            <CircularProgress size={60} />
          </div>
        ) : challenges.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "48px 0" 
          }}>
            <Typography style={{ color: "#666" }}>
              No challenges created yet
            </Typography>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge._id}
                challenge={challenge}
                isCoordinator={true}
                onJoin={() => {}}
                isJoined={false}
              />
            ))}
          </div>
        )}

        <ChallengeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateChallenge}
        />
      </Container>
    </div>
  );
};

export default CoordinatorChallenges;
