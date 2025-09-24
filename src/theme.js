import {createTheme} from '@mui/material/styles';


// Цвета для статусов и подсветки
const theme = createTheme({
    palette: {
        verified: {main: '#2e7d32', light: '#e8f5e9'}, // зелёный
        invalid: {main: '#c62828', light: '#ffebee'}, // красный
        warning: {main: '#ef6c00', light: '#fff3e0'} // оранжевый
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    backgroundColor: '#f5f7fa',   // более заметный фон шапки
                    fontWeight: 700,
                    color: 'rgba(0,0,0,0.87)',    // контрастный текст
                    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.12)', // тонкая линия снизу
                },
                root: {
                    borderRight: '1px solid rgba(0,0,0,0.12)',
                    borderBottom: '1px solid rgba(0,0,0,0.12)',
                },
            },
        },
    }
});


export default theme;