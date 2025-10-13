import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { perfumesAPI } from '../services/api';
import { Perfume } from '../types';
import { 
  formatPrice, 
  getConcentrationLabel, 
  getConcentrationColor, 
  getTargetAudienceIcon
} from '../utils/helpers';

export const HomePage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const response = await perfumesAPI.getAllPerfumes();
      setPerfumes(response.data.data.perfumes);
    } catch (err: any) {
      setError('Failed to fetch perfumes');
      console.error('Error fetching perfumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const filteredPerfumes = perfumes.filter(perfume =>
    perfume.perfumeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perfume.brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePerfumeClick = (perfumeId: string) => {
    navigate(`/perfumes/${perfumeId}`);
  };

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🌸 Perfume Collection
      </Typography>
      
      {/* Search Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <TextField
          sx={{ maxWidth: 400, width: '100%' }}
          label="Search perfumes..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Perfumes Grid */}
      {!loading && (
        <>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 3,
              mt: 3
            }}
          >
            {filteredPerfumes.map((perfume) => (
              <Card 
                key={perfume._id}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => handlePerfumeClick(perfume._id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={perfume.uri}
                  alt={perfume.perfumeName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2" 
                    noWrap
                    title={perfume.perfumeName}
                  >
                    {perfume.perfumeName}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {perfume.brand.brandName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={getConcentrationLabel(perfume.concentration)}
                      size="small"
                      sx={{
                        backgroundColor: getConcentrationColor(perfume.concentration),
                        color: 'white',
                        fontWeight: perfume.concentration === 'Extrait' ? 'bold' : 'normal',
                        animation: perfume.concentration === 'Extrait' ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                          '100%': { transform: 'scale(1)' },
                        },
                      }}
                    />
                    <Chip
                      label={`${getTargetAudienceIcon(perfume.targetAudience)} ${perfume.targetAudience}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(perfume.price)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {perfume.volume}ml
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* No Results */}
          {filteredPerfumes.length === 0 && !loading && (
            <Box textAlign="center" sx={{ mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No perfumes found matching your search
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};