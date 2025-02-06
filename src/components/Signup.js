import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  InputAdornment, 
  IconButton, 
  Divider,
  Link,
  Zoom,
  Fade
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../css/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = { email, password };
  
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  

  return (
    <Container component="main" maxWidth={false} disableGutters className="signup-container">
      <Zoom in={true} timeout={500}>
        <Box className="signup-box">
          <Fade in={true} timeout={800}>
            <Box>
              <Typography component="h1" variant="h4" className="signup-title">
                Sign Up
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" className="signup-subtitle">
                Let's get started with your 30 days of free trial
              </Typography>
              <Box component="form" noValidate className="signup-form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="signup-button"
                >
                  Sign Up
                </Button>
                <Divider className="signup-divider">Or continue with</Divider>
                <Typography variant="body2" align="center" className="login-link">
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    className="login-link-text"
                  >
                    Log in
                  </Link>
                </Typography>
                <Typography variant="body2" align="center" className="terms-text">
                  By signing up, you agree to our{' '}
                  <Link href="/" className="terms-link">Terms of Service</Link> and{' '}
                  <Link href="/" className="terms-link">Privacy Policy</Link>.
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Zoom>
    </Container>
  );
};

export default Signup;