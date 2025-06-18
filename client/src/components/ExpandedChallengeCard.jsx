import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Chip, Divider } from '@mui/material';

const ExpandedChallengeCard = ({ challenge, isJoined, onJoin, isCoordinator = false }) => {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '240px', 
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '5px',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {/* Left side - Content */}
      <div style={{ 
        flex: '7',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden' 
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 12px 0',
            fontWeight: '600',
            fontSize: '26px' 
          }}>
            <Link 
              to={`/challenges/${challenge._id}`} 
              style={{ 
                color: 'black',
                textDecoration: 'none'
              }}
            >
              {challenge.title}
            </Link>
          </h2>

          <p style={{ 
            margin: '0 0 16px 0',
            fontSize: '20px' 
          }}>
            {challenge.description}
          </p>

          <Divider style={{ margin: '12px 0' }} />

          {challenge.longDescription && (
            <p style={{ 
              margin: '0 0 16px 0',
              color: '#666',
              fontSize: '16px', 
              maxHeight: '60px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {challenge.longDescription}
            </p>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip 
              label={`${challenge.totalDays} Days`} 
              style={{ fontSize: '14px' }} 
            />
            <Chip 
              label={`${challenge.participantCount} People`} 
              style={{ fontSize: '14px' }} 
            />
          </div>

          {isCoordinator ? (
            <Button
              component={Link}
              to={`/challenges/${challenge._id}`}
              variant="contained"
              style={{ 
                backgroundColor: 'black',
                color: 'white',
                minWidth: '120px',
                fontSize: '14px' 
              }}
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={() => !isJoined && onJoin(challenge._id)}
              variant={isJoined ? "outlined" : "contained"}
              disabled={isJoined}
              style={{ 
                backgroundColor: isJoined ? 'transparent' : 'black',
                color: isJoined ? 'black' : 'white',
                borderColor: 'black',
                minWidth: '120px',
                fontSize: '14px' 
              }}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div style={{ 
        flex: '3',
        minWidth: '150px',
        maxWidth: '200px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {challenge.imageUrl ? (
          <img
            src={challenge.imageUrl}
            alt={challenge.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <span style={{ color: '#999', fontSize: '16px' }}>No Image</span>
        )}
      </div>
    </div>
  );
};

export default ExpandedChallengeCard;
