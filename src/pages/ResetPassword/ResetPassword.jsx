import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingDialog from '../../components/LoadingDialog';
import { useAuth } from '../../hooks/auth';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    const [generalErrorMessage, setGeneralErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirm, setConfirm] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralErrorMessage('');
        setPasswordError('');
        setConfirmError('');

        if (password === '' && password.length < 6) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password !== confirm) {
            setConfirmError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, password);
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đặt lại mật khẩu:', error);
            setGeneralErrorMessage('Đặt lại mật khẩu không thành công. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" fontWeight={600} mb={2} align="center">
                    Đặt lại mật khẩu
                </Typography>

                {generalErrorMessage && <Alert severity="error">{generalErrorMessage}</Alert>}

                <Typography variant="body2" color="text.secondary" mb={3} align="center">
                    Vui lòng nhập mật khẩu mới của bạn.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        error={passwordError !== ''}
                        helperText={passwordError}
                        label="Mật khẩu mới"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        error={confirmError !== ''}
                        helperText={confirmError}
                        label="Xác nhận mật khẩu"
                        type={showConfirm ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm((show) => !show)} edge="end">
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={!password || !confirm || password !== confirm}
                    >
                        Đặt lại mật khẩu
                    </Button>
                </form>
            </Paper>

            {/* Loading indicator */}
            {loading && <LoadingDialog open={loading} />}
        </Box>
    );
};

export default ResetPassword;
