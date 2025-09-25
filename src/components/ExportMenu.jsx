import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSelector } from 'react-redux';
import { selectFilteredRows } from '../selectors/tableSelectors.js';
import { exportXLSX } from '../utils/export.js';

export default function ExportMenu() {
    const rows = useSelector(selectFilteredRows); // или: useSelector(s => s.table.rows)

    const handleExport = () => {
        if (!rows?.length) return;
        exportXLSX(rows);
    };

    return (
        <Button
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            onClick={handleExport}
        >
            Экспорт
        </Button>
    );
}
