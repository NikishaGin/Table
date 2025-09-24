import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSelector } from 'react-redux';
import { selectFilteredRows } from '../selectors/tableSelectors.js';
import { exportCSV, exportJSON } from '../utils/export.js';


export default function ExportMenu() {
    const rows = useSelector(selectFilteredRows);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const doExport = (type) => () => {
        if (type === 'csv') exportCSV(rows);
        else exportJSON(rows);
        handleClose();
    };

    return (
        <>
            <Button startIcon={<FileDownloadIcon />} variant="outlined" onClick={handleClick}>
                Экспорт
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={doExport('csv')}>CSV</MenuItem>
                <MenuItem onClick={doExport('json')}>JSON</MenuItem>
            </Menu>
        </>
    );
}