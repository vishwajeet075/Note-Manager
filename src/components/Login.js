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
  Fade,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../css/Login.css';
import { useEffect } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = { email, password, rememberMe };
  
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
  
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };
  

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth={false} disableGutters className="login-container">
      <Zoom in={true} timeout={500}>
        <Box className="login-box">
          <Fade in={true} timeout={800}>
            <Box>
              <Typography component="h1" variant="h4" className="login-title">
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" className="login-subtitle">
                Enter your credentials to access your account
              </Typography>
              <Box component="form" noValidate className="login-form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  variant="outlined"
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
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  className="remember-me"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="login-button"
                >
                  Log In
                </Button>
                <Divider className="login-divider">Or continue with</Divider>
                <Typography variant="body2" align="center" className="signup-link">
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    variant="body2"
                    className="signup-link-text"
                  >
                    Sign up
                  </Link>
                </Typography>
                <Typography variant="body2" align="center" className="forgot-password">
                  <Link href="/" className="forgot-password-link">
                    Forgot your password?
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Zoom>
    </Container>
  );
};

export default Login;