import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as authAction from '../../redux/auth/authSlice'
import { useDispatch } from "react-redux";
import { userLogin } from '../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Loading } from '@nextui-org/react';

const theme = createTheme();

function LoginAdmin() {
    const dispatch = useDispatch();
    const [loading, setLoad] = React.useState(false)
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const handleChangUsername = (e) => {
        setUsername(e.target.value)
    }
    const handleChangePass = (e) => {
        setPassword(e.target.value)
    }
    const login = async ({ username, password }) => {
        const res = await userLogin({ username, password })
        if (res.data.success) {
            if (res.data.data.role === 'ROLE_ADMIN' || res.data.data.role === 'ROLE_STAFF') {
                await dispatch(authAction.login(res.data));
                window.location.href = '/admin'
            } else {
                toast.error('Sai tài khoản hoặc mật khẩu', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                setLoad(false)
            }
        }
        else {
            toast.error('Sai tài khoản hoặc mật khẩu', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            setLoad(false)
        }
    }
    const handleLogin = () => {
        setLoad(true)
        login({ username, password })
    }
    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(	https://www.grati.works/images/auth_background.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            ĐĂNG NHẬP
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                value={username}
                                onChange={handleChangUsername}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                value={password}
                                onChange={handleChangePass}
                            />
                            <Button css={{width:'100%',marginTop:'$2'}} ghost disabled={(loading || username === '' || password === '') ? true : false} color="warning" onClick={handleLogin}>
                                {loading ?
                                    <Loading color={'currentColor'} type='points-opacity' />
                                    : "Đăng nhập"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer/>
        </ThemeProvider>
    );
}

export default LoginAdmin;