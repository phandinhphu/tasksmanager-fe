import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReCAPTCHA from 'react-google-recaptcha';
import LoadingDialog from '../../components/LoadingDialog';
import { useAuth } from '../../hooks/auth';
import { GOOGLE_CAPTCHA_SITE_KEY } from '../../utils/constants';
import * as userServices from '../../services/userServices';

const Feedback = () => {
    const { user } = useAuth();

    const [feedback, setFeedback] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (GOOGLE_CAPTCHA_SITE_KEY === '') {
            console.error('Vui lòng cấu hình GOOGLE_CAPTCHA_SITE_KEY trong .env');
            alert('Vui lòng cấu hình GOOGLE_CAPTCHA_SITE_KEY trong .env');
            setError('Vui lòng cấu hình GOOGLE_CAPTCHA_SITE_KEY trong .env');
            return;
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (!feedback) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (!captchaToken) {
            setError('Vui lòng xác minh CAPTCHA.');
            return;
        }

        setLoading(true);

        try {
            const response = await userServices.sendFeedback(feedback, captchaToken);
            setSuccess(response.message);
            setFeedback('');
            setCaptchaToken('');
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mx: 'auto', mt: 6, mb: 6, p: 2 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight={700} mb={2} align="center">
                    Gửi phản hồi
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3} align="center">
                    Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện ứng dụng Tasks Manager tốt hơn!
                </Typography>
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField label="Tên của bạn" value={user.name} fullWidth aria-readonly />
                        <TextField label="Email" type="email" value={user.email} fullWidth aria-readonly />
                        <TextField
                            label="Nội dung phản hồi"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            fullWidth
                            required
                            multiline
                            minRows={4}
                        />
                        <ReCAPTCHA
                            sitekey={GOOGLE_CAPTCHA_SITE_KEY}
                            style={{ marginTop: '20px' }}
                            onChange={(value) => setCaptchaToken(value)}
                            onExpired={() => setCaptchaToken('')}
                            onErrored={() => console.log('Captcha error')}
                        />
                        <Button type="submit" variant="contained" endIcon={<SendIcon />} fullWidth sx={{ mt: 2 }}>
                            Gửi phản hồi
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {loading && <LoadingDialog open={loading} />}
        </Box>
    );
};

export default Feedback;
