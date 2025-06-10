import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../../components/ForgotPassword';
import LoadingDialog from '../../components/LoadingDialog';
import { useAuth } from '../../hooks/auth';
import { getCurrentUser } from '../../services/authServices';
const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function SignIn() {
    const [loading, setLoading] = React.useState(false);
    const [generalErrorMessage, setGeneralErrorMessage] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const user = useAuth();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        if (emailError || passwordError) {
            event.preventDefault();
            return;
        }
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);

        try {
            await user.login(data.get('email'), data.get('password'));

            const response = await getCurrentUser();

            user.saveUser(response);
            setGeneralErrorMessage('');
            navigate('/');
        } catch (error) {
            setGeneralErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = () => {
        setGeneralErrorMessage('');
        setSuccessMessage('');
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleForgotPassword = async (email) => {
        setLoading(true);
        try {
            const response = await user.forgotPassword(email);
            setSuccessMessage(response.message || 'Password reset link sent to your email.');
        } catch (error) {
            setGeneralErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="center"
                alignItems="center"
                spacing={4}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        pr: 4,
                        maxWidth: 400, // Giới hạn chiều rộng
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                        Chào mừng đến với Tasks Manager!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                        Tasks Manager là nền tảng giúp bạn:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20, color: '#555', fontSize: 16 }}>
                        <li>Quản lý công việc cá nhân và lịch học dễ dàng</li>
                        <li>Theo dõi tiến độ từng công việc</li>
                        <li>Nhắc nhở deadline tự động</li>
                        <li>Truy cập mọi lúc, mọi nơi</li>
                    </ul>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                        Đăng nhập để bắt đầu trải nghiệm quản lý công việc hiệu quả hơn!
                    </Typography>
                </Box>

                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign in
                    </Typography>

                    {generalErrorMessage && <Alert severity="error">{generalErrorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>

                        <ForgotPassword
                            open={open}
                            handleClose={handleClose}
                            handleForgotPassword={handleForgotPassword}
                        />

                        <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                            Sign in
                        </Button>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Forgot your password?
                        </Link>
                        <RouterLink to="/register" variant="body2" sx={{ alignSelf: 'center' }}>
                            Don't have an account? Sign up
                        </RouterLink>
                    </Box>

                    {/* Login with social media */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ flexGrow: 1, mr: 1 }}
                            onClick={() => {
                                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
                            }}
                        >
                            Login with Google
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ flexGrow: 1, ml: 1 }}
                            onClick={() => {
                                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/facebook`;
                            }}
                        >
                            Login with Facebook
                        </Button>
                    </Stack>
                </Card>
            </SignInContainer>

            {/* Loading indicator */}
            {loading && <LoadingDialog open={loading} />}
        </>
    );
}
