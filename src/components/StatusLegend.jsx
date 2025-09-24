import React from 'react';
import { Stack, Chip } from '@mui/material';


export default function StatusLegend() {
    return (
        <Stack direction="row" spacing={1}>
            <Chip label="Верифицирована" variant="outlined" sx={{ bgcolor: 'verified.light', borderColor: 'verified.main', color: 'verified.main' }} />
            <Chip label="Некорректная" variant="outlined" sx={{ bgcolor: 'invalid.light', borderColor: 'invalid.main', color: 'invalid.main' }} />
            <Chip label="Подсветка ячеек" variant="outlined" sx={{ bgcolor: 'warning.light', borderColor: 'warning.main', color: 'warning.main' }} />
        </Stack>
    );
}