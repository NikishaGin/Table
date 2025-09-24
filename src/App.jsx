import React from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import TopBar from './components/TopBar.jsx';
import DataTable from './components/DataTable.jsx';
import CommentDialog from './components/CommentDialog.jsx';
import { hideAlert } from './store/uiSlice.js';


export default function App() {
    const dispatch = useDispatch();
    const alert = useSelector(s => s.ui.alert);


    const handleClose = () => dispatch(hideAlert());


    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TopBar />
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <DataTable />
            </Box>
            <CommentDialog />
            <Snackbar open={!!alert} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                {alert ? <Alert severity={alert.severity} onClose={handleClose}>{alert.message}</Alert> : null}
            </Snackbar>
        </Box>
    );
}
