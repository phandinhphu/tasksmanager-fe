import { Backdrop, CircularProgress } from '@mui/material';

const LoadingDialog = ({ open }) => {
    return (
        <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default LoadingDialog;
