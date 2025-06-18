import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from '@mui/material';

const ChallengeCard = ({ challenge, isJoined, onJoin, isCoordinator = false }) => {
  return (
    <Card style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Image Section */}
      <div style={{
        height: '160px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {challenge.imageUrl && (
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      {/* Content Section */}
      <CardContent style={{ flex: 1 }}>
        <Typography variant="h6" component="h3" style={{ marginBottom: '12px', fontWeight: '600' }}>
          <Link to={`/challenges/${challenge._id}`} style={{ 
            color: '#000',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}>
            {challenge.title}
          </Link>
        </Typography>

        <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
          {challenge.description}
        </Typography>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Typography variant="caption">{challenge.totalDays} days</Typography>
          <Typography variant="caption">{challenge.participantCount} participants</Typography>
        </div>
      </CardContent>

      {/* Button Section */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        {isCoordinator ? (
          <Button
            fullWidth
            variant="contained"
            component={Link}
            to={`/challenges/${challenge._id}`}
            style={{ height: '42px', backgroundColor: '#000' }}
          >
            Edit Challenge
          </Button>
        ) : (
          <Button
            fullWidth
            variant={isJoined ? "outlined" : "contained"}
            onClick={() => !isJoined && onJoin(challenge._id)}
            disabled={isJoined}
            style={{ 
              height: '42px',
              backgroundColor: isJoined ? 'transparent' : '#000',
              color: isJoined ? '#000' : '#fff',
              borderColor: '#000'
            }}
          >
            {isJoined ? 'Already Joined' : 'Join Challenge'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ChallengeCard;
