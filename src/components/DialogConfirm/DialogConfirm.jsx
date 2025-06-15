import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const DialogConfirm = ({ openDialog, onOpen, onDelete }) => {
    return (
        <Dialog
            open={openDialog}
            onClose={onOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Bạn có chắc chắn muốn xóa công việc này?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onOpen} color="primary">
                    Hủy
                </Button>
                <Button onClick={onDelete} color="primary" autoFocus>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogConfirm;
