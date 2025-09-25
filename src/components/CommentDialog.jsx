// src/components/CommentDialog.jsx
import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    RadioGroup, FormControlLabel, Radio, TextField,
    Button, Stack, Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeCommentModal } from '../store/uiSlice.js';
import { setRowComment, setRowStatus } from '../store/tableSlice.js';

// Справочник причин (пример — скорректируй под себя)
const REASONS = [
    { value: 'missing_fields',  label: 'Отсутствуют обязательные поля' },
    { value: 'wrong_format',    label: 'Неверный формат данных' },
    { value: 'mismatch',        label: 'Несоответствие справочнику/реестру' },
    { value: 'duplicate',       label: 'Дубликат записи' },
    { value: 'other',           label: 'Другое' },
];

export default function CommentDialog() {
    const dispatch = useDispatch();
    const rowId   = useSelector(s => s.ui.commentModalRowId);
    const intent  = useSelector(s => s.ui.commentModalIntent); // 'invalid' | null
    const row     = useSelector(s => s.table.rows.find(r => r.id === rowId));

    const open = Boolean(rowId);

    // Предзаполнение, если раньше была причина
    const parseExisting = React.useMemo(() => {
        if (!row?.comment) return { value: '', other: '' };
        const isOther = row.comment.startsWith('Другое:');
        return {
            value: isOther ? 'other' : '',
            other: isOther ? row.comment.replace(/^Другое:\s?/, '') : row.comment
        };
    }, [row]);

    const [value, setValue] = React.useState(parseExisting.value);
    const [other, setOther] = React.useState(parseExisting.other);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        setValue(parseExisting.value);
        setOther(parseExisting.other);
        setError('');
    }, [parseExisting]);

    const handleClose = () => {
        setError('');
        dispatch(closeCommentModal());
    };

    const handleSave = () => {
        let comment = '';
        if (value && value !== 'other') {
            // Сохраняем «человеческую» метку
            const item = REASONS.find(r => r.value === value);
            comment = item?.label ?? '';
        } else if (value === 'other') {
            if (!other.trim()) {
                setError('Укажите причину в поле «Другое».');
                return;
            }
            comment = `Другое: ${other.trim()}`;
        } else {
            setError('Выберите причину.');
            return;
        }

        // 1) Сохраняем причину в комментарий (совместимо со старой логикой)
        dispatch(setRowComment({ rowId, comment }));

        // 2) Если пришли из «крестика» — сразу ставим статус invalid
        if (intent === 'invalid' && row?.status !== 'invalid') {
            dispatch(setRowStatus({ rowId, status: 'invalid' }));
        }

        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Причина некорректной записи</DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                        Выберите причину, по которой запись считается некорректной.
                    </Typography>

                    <RadioGroup
                        value={value}
                        onChange={(e) => { setValue(e.target.value); setError(''); }}
                    >
                        {REASONS.map(r => (
                            <FormControlLabel
                                key={r.value}
                                value={r.value}
                                control={<Radio />}
                                label={r.label}
                            />
                        ))}
                    </RadioGroup>

                    {value === 'other' && (
                        <TextField
                            label="Другое"
                            value={other}
                            onChange={(e) => { setOther(e.target.value); setError(''); }}
                            multiline
                            minRows={2}
                            fullWidth
                            autoFocus
                            error={!!error}
                            helperText={error || 'Опишите причину в свободной форме'}
                        />
                    )}

                    {!!error && value !== 'other' && (
                        <Typography variant="caption" color="error">{error}</Typography>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}
