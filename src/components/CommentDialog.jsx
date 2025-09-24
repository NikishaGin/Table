import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeCommentModal } from '../store/uiSlice.js';
import { setRowComment, applyRowStatus } from '../store/tableSlice.js';


export default function CommentDialog() {
    const dispatch = useDispatch();
    const rowId = useSelector(s => s.ui.commentModalRowId);
    const row = useSelector(s => s.table.rows.find(r => r.id === rowId));
    const [value, setValue] = React.useState('');


    React.useEffect(() => {
        setValue(row?.comment || '');
    }, [rowId]);


    const handleClose = () => dispatch(closeCommentModal());
    const handleSave = () => {
// Сохраняем комментарий и сразу применяем INVALID
        dispatch(setRowComment({ rowId, comment: value }));
        dispatch(applyRowStatus({ rowId, status: 'invalid' }));
        dispatch(closeCommentModal());
    };


    return (
        <Dialog open={!!rowId} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Причина некорректности</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Комментарий (обязательно)"
                    fullWidth
                    multiline
                    minRows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave} disabled={!value.trim()}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}