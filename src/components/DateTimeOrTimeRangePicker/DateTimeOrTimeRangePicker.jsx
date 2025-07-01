import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Box, FormLabel } from '@mui/material';
import vi from 'date-fns/locale/vi';

const DateTimeOrTimeRangePicker = ({ value, mainTask, onChange }) => {
    const [start, setStart] = React.useState(value?.start || new Date());
    const [end, setEnd] = React.useState(value?.end || new Date());
    const [startDateError, setStartDateError] = React.useState('');
    const [endDateError, setEndDateError] = React.useState('');

    const mainStart = mainTask?.start_date ? dayjs(mainTask.start_date) : null;
    const mainEnd = mainTask?.end_date ? dayjs(mainTask.end_date) : null;

    // Memoize hàm normalizeDate để tránh tạo mới mỗi lần render
    const normalizeDate = React.useCallback((date) => {
        if (!date) return date;
        const normalized = new Date(date);
        normalized.setSeconds(0);
        normalized.setMilliseconds(0);
        return normalized;
    }, []);

    // Memoize giá trị để tránh tạo object mới mỗi lần
    const normalizedValue = React.useMemo(
        () => ({
            start: normalizeDate(start),
            end: normalizeDate(end),
        }),
        [start, end, normalizeDate],
    );

    React.useEffect(() => {
        if (onChange) {
            onChange(normalizedValue);
        }
    }, [normalizedValue]);

    // Tách riêng useEffect cho việc cập nhật từ props để tránh loop
    React.useEffect(() => {
        if (value && (value.start?.getTime() !== start?.getTime() || value.end?.getTime() !== end?.getTime())) {
            setStart(value.start || new Date());
            setEnd(value.end || new Date());
        }
    }, [value?.start, value?.end]);

    // Memoize các helper functions để tránh re-render
    const getMinDateTime = React.useCallback(
        (selectedDate) => {
            if (!mainStart) return null;
            const selected = dayjs(selectedDate);
            return selected.isSame(mainStart, 'day') ? mainStart.toDate() : mainStart.startOf('day').toDate();
        },
        [mainStart],
    );

    const getMaxDateTime = React.useCallback(
        (selectedDate) => {
            if (!mainEnd) return null;
            const selected = dayjs(selectedDate);
            return selected.isSame(mainEnd, 'day') ? mainEnd.toDate() : mainEnd.endOf('day').toDate();
        },
        [mainEnd],
    );

    // Helper function to get min datetime for end date
    const getMinDateTimeForEnd = React.useCallback(
        (selectedDate) => {
            if (mainTask) {
                return getMinDateTime(selectedDate);
            }
            // Nếu không có mainTask, cho phép end date từ đầu ngày được chọn
            // Điều này cho phép end time nhỏ hơn start time trong cùng ngày
            return dayjs(selectedDate).startOf('day').toDate();
        },
        [mainTask, getMinDateTime],
    );

    return (
        <Box>
            <FormLabel component="legend" sx={{ mb: 2 }}>
                Chọn khoảng thời gian
            </FormLabel>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <DateTimePicker
                        label="Ngày giờ bắt đầu"
                        value={start}
                        onChange={(newValue) => setStart(newValue)}
                        onError={(reason) => setStartDateError(reason)}
                        minDateTime={mainTask ? getMinDateTime(start) : dayjs().startOf('day').toDate()}
                        maxDateTime={mainTask ? getMaxDateTime(start) : null}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: TextField }}
                        slotProps={{
                            textField: {
                                margin: 'dense',
                                fullWidth: true,
                                error: !!startDateError,
                                helperText: startDateError ? 'Ngày không hợp lệ' : '',
                            },
                        }}
                    />
                    <DateTimePicker
                        label="Ngày giờ kết thúc"
                        value={end}
                        onChange={(newValue) => setEnd(newValue)}
                        onError={(reason) => setEndDateError(reason)}
                        minDateTime={mainTask ? getMinDateTime(end) : getMinDateTimeForEnd(end)}
                        maxDateTime={mainTask ? getMaxDateTime(end) : null}
                        enableAccessibleFieldDOMStructure={false}
                        slots={{ textField: TextField }}
                        slotProps={{
                            textField: {
                                margin: 'dense',
                                fullWidth: true,
                                error: !!endDateError,
                                helperText: endDateError ? 'Ngày không hợp lệ' : '',
                            },
                        }}
                    />
                </Box>
            </LocalizationProvider>
        </Box>
    );
};

export default React.memo(DateTimeOrTimeRangePicker);
