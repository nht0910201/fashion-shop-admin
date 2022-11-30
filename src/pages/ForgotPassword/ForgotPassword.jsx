import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { resetPassword, verifyUser } from '../../services/AuthService';
import { useState } from 'react';
import validator from 'validator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToLocalStorage } from './../../utils/tokenHandle';
import { forgotPassword } from '../../services/UserService';
import { UpdateSuccessReload } from './../../components/Alert/UpdateSuccessReload';
import { UpdateSuccessNavigate } from "../../components/Alert/UpdateSuccessNavigate";
import {UpdateError } from '../../components/Alert/UpdateError'

const steps = ['Tài khoản', 'Xác thực', 'Đặt mật khẩu'];

const theme = createTheme();

function ForgotPassword() {
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfrimPassword] = useState('');
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleChangeOtp = (e) => {
        setOtp(e.target.value)
    }
    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value)
    }
    const handleChangeConfirmPass = (e) => {
        setConfrimPassword(e.target.value)
    }
    const type = 'reset'

    const [id, setId] = useState('')
    const handleNext = async (e) => {
        const wait = toast.loading("Vui lòng chờ ...")
        let checkEmail = validator.isEmail(email)
        let checkOtp = !validator.isEmpty(otp)
        if (activeStep === 0) {
            if (checkEmail) {
                let check = await resetPassword({ email })
                UpdateSuccessReload(wait,'Mã xác thực đã được gửi đến email',false)
                if (check.data.success) {
                    setActiveStep(activeStep + 1);
                }
            } else {
                UpdateError(wait,'Vui lòng nhập chính xác email')
            }
        }
        else if (activeStep === 1) {
            if (checkOtp) {
                let checkOtp = await verifyUser({ otp, email, type })
                if (checkOtp.data.success) {
                    UpdateSuccessReload(wait,'Xác thực OTP thành công',false)
                    setId(checkOtp.data.data.id);
                    addToLocalStorage(checkOtp.data.data.token)
                    setActiveStep(activeStep + 1);
                } else {
                    UpdateError(wait,'OTP không đúng')
                }
            }
            else {
                UpdateError(wait,'Vui lòng nhập OTP')
            }
        }
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };
    let oldPassword = otp
    const updatePass = async () => {
        const w = toast.loading("Vui lòng chờ ...")
        let checkPassword = !validator.isEmpty(newPassword) && newPassword.length >= 6
        let checkConfirmPass = !validator.isEmpty(confirmPassword) && (newPassword === confirmPassword)
        if (checkPassword && checkConfirmPass) {
            let res = await forgotPassword({ oldPassword, newPassword }, id)
            if (res.success) {
                let url = '/'
                UpdateSuccessNavigate(w,'Đổi mật khẩu thành công',url)
            } else {
                UpdateError(w,'Đổi mật khẩu thất bại')
            }
        } else {
            UpdateError(w,'Vui lòng nhập lại mật khẩu')
        }
    }
    const handleOnClick = () => {
        updatePass();
    }
    const sendOTPagain = async () => {
        const Wait = toast.loading("Vui lòng chờ ...")
        let res = await resetPassword({ email })
        if (res.data.success) {
            UpdateSuccessReload(Wait,'Gửi OTP thành công',false)
        } else {
            UpdateError(Wait,'Gửi OTP thất bại')
        }
    }
    const sendOTP = () => {
        sendOTPagain()
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
                        KHÔI PHỤC MẬT KHẨU
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === 0 ? <>
                            <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>
                                Tài khoản
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="email"
                                        name="email"
                                        label="Email"
                                        fullWidth
                                        type={'email'}
                                        variant="standard"
                                        value={email}
                                        onChange={handleChangeEmail}
                                    />
                                </Grid>
                            </Grid>
                        </> : <></>}
                        {activeStep === 1 ? <>
                            <Typography variant="h6" align="center" gutterBottom>
                                XÁC THỰC
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="OTP"
                                        label="OTP"
                                        fullWidth
                                        variant="standard"
                                        value={otp}
                                        onChange={handleChangeOtp}

                                    />
                                </Grid>
                                <Button style={{ fontSize: 12, marginLeft: 'auto', marginRight: 'auto', marginTop: '3px' }} color="secondary" onClick={sendOTP}>Gửi lại OTP</Button>
                            </Grid>
                        </> : <></>}
                        {activeStep === 2 ? <>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="newPassword"
                                        label="Mật khẩu mới"
                                        type={'password'}
                                        fullWidth
                                        variant="standard"
                                        value={newPassword}
                                        onChange={handleChangeNewPassword}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="confirmPass"
                                        label="Xác nhận lại mật khẩu"
                                        type={'password'}
                                        fullWidth
                                        variant="standard"
                                        value={confirmPassword}
                                        onChange={handleChangeConfirmPass}
                                    />
                                </Grid>
                            </Grid>
                        </> :
                            <></>
                        }
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleBack}
                                sx={{ mt: 3, ml: 1 }}
                                disabled={activeStep === 0 ? true : false}
                            >
                                <ArrowBackIcon />
                            </Button>
                            <Button
                                onClick={handleNext}
                                sx={{ mt: 3, ml: 1 }}
                                disabled={activeStep === steps.length - 1 ? true : false}
                            >
                                <ArrowForwardIcon />
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleOnClick}
                                sx={{ mt: 3, ml: 1 }}
                                // hidden={activeStep !== steps.length - 1 ? true : false}
                                disabled={activeStep === steps.length - 1 ? false : true}
                            >
                                Lưu
                            </Button>
                        </Box>
                    </React.Fragment>
                </Paper>
                <ToastContainer />
            </Container>
        </ThemeProvider>
    );
}

export default ForgotPassword;