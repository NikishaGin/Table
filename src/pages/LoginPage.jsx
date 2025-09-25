import React from 'react';
import {
    Box, Paper, TextField, Button, Typography, Stack, Link as MuiLink
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        // здесь позже будет реальная авторизация
        // сейчас просто возвращаем на главную:
        navigate('/', { replace: true });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Stack spacing={3} component="form" onSubmit={onSubmit}>
                    <Typography variant="h5" fontWeight={700}>
                        Вход в систему
                    </Typography>

                    <TextField
                        label="Логин"
                        name="login"
                        fullWidth
                        autoFocus
                        autoComplete="username"
                    />
                    <TextField
                        label="Пароль"
                        name="password"
                        type="password"
                        fullWidth
                        autoComplete="current-password"
                    />

                    <Button type="submit" variant="contained" size="large" fullWidth>
                        Войти
                    </Button>

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Или <MuiLink component={RouterLink} to="/">вернуться к таблице</MuiLink>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}
