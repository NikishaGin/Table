import React from 'react';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, CircularProgress, TablePagination, Stack, Tooltip
} from '@mui/material';
import {alpha} from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import {useDispatch, useSelector} from 'react-redux';
import {
    fetchRowsPage,
    setPage,
    setPageSize,
    toggleCellFlag,
    applyRowStatus
} from '../store/tableSlice.js';
import {openCommentModal} from '../store/uiSlice.js';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link as RouterLink } from 'react-router-dom';

// ВНЕ компонента — нет useMemo после условных return
const COLUMNS = Array.from({length: 40}, (_, i) => `col${i + 1}`);

export default function DataTable() {
    const dispatch = useDispatch();
    const {rows, rowCount, loading, page, pageSize} = useSelector(s => s.table);

    // Загружаем ТЕКУЩУЮ страницу при изменении page/pageSize
    React.useEffect(() => {
        const promise = dispatch(fetchRowsPage({page, pageSize}));
        return () => {
            // отменяем предыдущий запрос, если страница/размер изменились до завершения
            promise.abort();
        };
    }, [dispatch, page, pageSize]);

    const onDblClickCell = (rowId, columnKey) => () =>
        dispatch(toggleCellFlag({rowId, columnKey}));

    // Красим именно ячейки строки
    const rowSx = (status) => ({
        '& > td': {
            backgroundColor:
                status === 'verified' ? '#e8f5e9' :
                    status === 'invalid' ? '#ffebee' :
                        'transparent',
        },
    });

    if (loading) {
        return (
            <Box sx={{p: 4, display: 'flex', justifyContent: 'center'}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!rows.length) {
        return <Box sx={{p: 4, textAlign: 'center'}}>Нет данных</Box>;
    }

    return (
        <>
            <TableContainer component={Paper} sx={{maxHeight: 'calc(100vh - 160px)'}}>
                <Table
                    stickyHeader
                    size="small"
                    sx={{
                        '& th, & td': {borderRight: '1px solid', borderColor: 'divider'},
                        '& th': {borderBottom: '1px solid', borderColor: 'divider'},
                        '& td': {borderBottom: '1px solid', borderColor: 'divider'},
                        '& th:last-of-type, & td:last-of-type': {borderRight: 'none'},
                    }}
                >
                    <TableHead
                        sx={(t) => ({
                            '& th': {
                                backgroundColor: '#f5f7fa',
                                fontWeight: 700,
                                color: t.palette.text.primary,
                                position: 'sticky', top: 0, zIndex: 2,
                                boxShadow: `inset 0 -1px 0 ${t.palette.divider}`,
                            },
                        })}
                    >
                        <TableRow>
                            <TableCell align="right" sx={{ width: 72 }}>№</TableCell>
                            <TableCell sx={{ minWidth: 150 }}>Действия</TableCell>
                            {COLUMNS.map((c) => (
                                <TableCell key={c} align="right">{c}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, idx) => {
                            const isVerified = row.status === 'verified';
                            const isInvalid = row.status === 'invalid';
                            const rowNumber = page * pageSize + idx + 1; // абсолютный номер

                            return (
                                <TableRow key={row.id} hover sx={rowSx(row.status)}>
                                    <TableCell
                                        align="right"
                                        sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
                                    >
                                        {rowNumber}
                                    </TableCell>
                                    <TableCell sx={{whiteSpace: 'nowrap'}}>
                                        <Stack direction="row" spacing={1} alignItems="center" useFlexGap
                                               flexWrap="nowrap">
                                            {/* Галочка */}
                                            <IconButton
                                                aria-label="верифицировать"
                                                onClick={() => dispatch(applyRowStatus({
                                                    rowId: row.id,
                                                    status: 'verified'
                                                }))}
                                                sx={(t) => ({
                                                    width: 36, height: 36, borderRadius: '50%',
                                                    border: '1px solid', borderColor: t.palette.success.main,
                                                    color: isVerified ? t.palette.common.white : t.palette.success.main,
                                                    bgcolor: isVerified ? t.palette.success.main : 'transparent',
                                                    transition: 'all .15s ease',
                                                    '&:hover': {
                                                        borderColor: t.palette.success.dark,
                                                        bgcolor: isVerified ? t.palette.success.dark : alpha(t.palette.success.main, 0.08),
                                                    },
                                                })}
                                                size="small"
                                            >
                                                <DoneIcon/>
                                            </IconButton>

                                            {/* Крестик */}
                                            <IconButton
                                                aria-label="пометить как некорректную"
                                                onClick={() => dispatch(applyRowStatus({
                                                    rowId: row.id,
                                                    status: 'invalid'
                                                }))}
                                                sx={(t) => ({
                                                    width: 36, height: 36, borderRadius: '50%',
                                                    border: '1px solid', borderColor: t.palette.error.main,
                                                    color: isInvalid ? t.palette.common.white : t.palette.error.main,
                                                    bgcolor: isInvalid ? t.palette.error.main : 'transparent',
                                                    transition: 'all .15s ease',
                                                    '&:hover': {
                                                        borderColor: t.palette.error.dark,
                                                        bgcolor: isInvalid ? t.palette.error.dark : alpha(t.palette.error.main, 0.08),
                                                    },
                                                })}
                                                size="small"
                                            >
                                                <CloseIcon/>
                                            </IconButton>

                                            {/* Комментарий — без круга */}
                                            <IconButton
                                                aria-label="добавить комментарий"
                                                onClick={() => dispatch(openCommentModal(row.id))}
                                                sx={{
                                                    p: 0.5,
                                                    border: 'none',
                                                    borderRadius: 0,
                                                    bgcolor: 'transparent',
                                                    color: 'text.secondary',
                                                    '&:hover': {bgcolor: 'transparent', color: 'text.primary'},
                                                }}
                                                disableRipple
                                                size="small"
                                            >
                                                <ChatIcon fontSize="small"/>
                                            </IconButton>
                                        </Stack>
                                    </TableCell>

                                    {COLUMNS.map((c) => {
                                        const flagged = !!row.cellFlags[c];
                                        return (
                                            <TableCell
                                                key={c}
                                                align="right"
                                                onDoubleClick={onDblClickCell(row.id, c)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    bgcolor: flagged ? '#fff3e0' : undefined,
                                                    outline: flagged ? '2px solid' : 'none',
                                                    outlineColor: flagged ? '#ef6c00' : 'transparent',
                                                    outlineOffset: '-2px',
                                                }}
                                            >
                                                {row.cols[c]}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*/!* Пагинация снизу *!/*/}
            {/*<Box sx={{*/}
            {/*    px: 2,*/}
            {/*    py: 1,*/}
            {/*    display: 'flex',*/}
            {/*    justifyContent: 'flex-end',*/}
            {/*    borderTop: '1px solid',*/}
            {/*    borderColor: 'divider'*/}
            {/*}}>*/}
            {/*    <TablePagination*/}
            {/*        component="div"*/}
            {/*        count={rowCount}*/}
            {/*        page={page}*/}
            {/*        rowsPerPage={pageSize}*/}
            {/*        onPageChange={(_, newPage) => dispatch(setPage(newPage))}*/}
            {/*        onRowsPerPageChange={(e) => dispatch(setPageSize(parseInt(e.target.value, 10)))}*/}
            {/*        rowsPerPageOptions={[10, 25, 50, 100]}*/}
            {/*        labelRowsPerPage="Строк на странице"*/}
            {/*    />*/}
            {/*</Box>*/}
            <Box
                sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {/* СЛЕВА: Выход */}
                <Tooltip title="Выход">
                    <IconButton
                        component={RouterLink}
                        to="/login"
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                    >
                        <LogoutRoundedIcon />
                    </IconButton>
                </Tooltip>

                {/* СПРАВА: Пагинация */}
                <TablePagination
                    component="div"
                    count={rowCount}
                    page={page}
                    rowsPerPage={pageSize}
                    onPageChange={(_, newPage) => dispatch(setPage(newPage))}
                    onRowsPerPageChange={(e) => dispatch(setPageSize(parseInt(e.target.value, 10)))}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    labelRowsPerPage="Строк на странице"
                />
            </Box>

        </>
    );
}
