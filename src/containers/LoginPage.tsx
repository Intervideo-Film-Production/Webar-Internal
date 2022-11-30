import { Grid, InputAdornment, TextField, IconButton, Toolbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AppGrid, AppButton } from 'src/components';
import { AccountCircle, VpnKey } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IProduct, IStore } from 'src/core/declarations/app';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'src/core/events';
import { useBoundStore } from 'src/core/store';

const LoginPage = () => {

  const product = useBoundStore(state => state.product);
  const store = useBoundStore(state => state.store);
  const navigate = useNavigate();

  const { appCredential } = useAppContext();

  useEffect(() => {
    if (!store) {
      navigate('/initialize');
    }
  });

  const [credential, setUserCredential] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredential({ ...credential, username: event.target.value });
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredential({ ...credential, password: event.target.value });
  };

  const handleSubmit = () => {
    appCredential.next(credential);
    if (!product) {
      navigate('/');
    } else {
      navigate('/ar-page?showArPage=true');
    }
  }

  return (
    <AppGrid sx={{
      alignItems: "start",
      gridTemplateRows: "auto 1fr"
    }}>
      <Toolbar />
      {store && (
        <Grid sx={{ p: 2 }}>
          <Grid sx={{ mb: 1 }}>
            <TextField
              fullWidth
              id="username"
              label="Username"
              value={credential.username}
              onChange={handleUserName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </Grid>

          <Grid sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="password"
              label="Password"
              value={credential.password}
              type={showPassword ? 'text' : 'password'}
              onChange={handlePassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword
                        ? (<VisibilityOffIcon />)
                        : (<VisibilityIcon />)}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              variant="standard"
            />
          </Grid>

          <Grid>
            <AppButton
              onClick={() => handleSubmit()}
              fullWidth
              variant="contained"
              color="primary">Sign in</AppButton>
          </Grid>

        </Grid>
      )}

    </AppGrid>

  )
}

export default LoginPage;
