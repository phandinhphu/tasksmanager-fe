import React, { useState } from 'react';
import { Avatar, Button, TextField, Typography, Grid, Paper, IconButton, InputAdornment, Box } from '@mui/material';
import { Visibility, VisibilityOff, PhotoCamera } from '@mui/icons-material';
import SnackbarAlert from '../../components/SnackbarAlert';
import LoadingDialog from '../../components/LoadingDialog';
import { useAuth } from '../../hooks/auth';
import * as userService from '../../services/userServices';

const AccountSettings = () => {
    const { user, saveUser } = useAuth();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name === '') {
            setResponse({
                status: 'error',
                message: 'Tên người dùng không được để trống',
            });
            setSnackbarOpen(true);
            return;
        }

        if (password !== '' && password.length < 6) {
            setResponse({
                status: 'error',
                message: 'Mật khẩu phải có ít nhất 6 ký tự',
            });
            setSnackbarOpen(true);
            return;
        }

        if (password !== confirmPassword) {
            setResponse({
                status: 'error',
                message: 'Mật khẩu không khớp',
            });
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            let updatedUser = { name, password };

            if (avatarFile) {
                const base64String = await readFileAsBase64(avatarFile);
                updatedUser.avatar = base64String;
            }

            const response = await userService.updateUser(updatedUser);
            if (response) {
                setResponse({
                    status: 'success',
                    message: 'Cập nhật thành công',
                });
                saveUser({ ...user, ...updatedUser });
            }
        } catch (error) {
            setResponse({
                status: 'error',
                message: 'Cập nhật thất bại',
            });
        } finally {
            setLoading(false);
            setAvatarFile(null);
            setAvatarPreview(null);
            setPassword('');
            setConfirmPassword('');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="h5" gutterBottom>
                    Cài đặt tài khoản
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} textAlign="center">
                            {avatarPreview || user.avatar ? (
                                <Avatar
                                    src={avatarPreview || user.avatar}
                                    sx={{ width: 100, height: 100, margin: 'auto', border: '2px solid #3f51b5' }}
                                    alt={user.name}
                                />
                            ) : (
                                <Avatar sx={{ width: 100, height: 100, margin: 'auto', border: '2px solid #3f51b5' }} />
                            )}
                            <input
                                accept="image/*"
                                id="upload-avatar"
                                type="file"
                                hidden
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="upload-avatar">
                                <IconButton color="primary" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Tên người dùng"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Mật khẩu mới"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Xác nhận mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                sx={{ marginTop: 2 }}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="center">
                            <Button type="submit" variant="contained" color="primary">
                                Lưu thay đổi
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {response.message && (
                <SnackbarAlert snackbarOpen={snackbarOpen} onClose={() => setSnackbarOpen(false)} response={response} />
            )}

            {loading && <LoadingDialog open={loading} />}
        </Box>
    );
};

export default AccountSettings;
