import React from 'react';
import { Box, Stack, Typography, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../store/uiSlice.js';
import ExportMenu from './ExportMenu.jsx';
import StatusLegend from './StatusLegend.jsx';


export default function TopBar() {
    const dispatch = useDispatch();
    const filters = useSelector(s => s.ui.filters);


    const onChange = (key) => (e) => {
        dispatch(setFilters({ [key]: e.target.checked }));
    };


    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Typography variant="h6">Верификация данных</Typography>
                    <StatusLegend />
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControlLabel control={<Checkbox checked={filters.showInvalid} onChange={onChange('showInvalid')} />} label="Только некорректные" />
                    <FormControlLabel control={<Checkbox checked={filters.showVerified} onChange={onChange('showVerified')} />} label="Только верифицированные" />
                    <FormControlLabel control={<Checkbox checked={filters.showNoStatus} onChange={onChange('showNoStatus')} />} label="Без статуса" />
                    <Divider orientation="vertical" flexItem />
                    <ExportMenu />
                </Stack>
            </Stack>
        </Box>
    );
}