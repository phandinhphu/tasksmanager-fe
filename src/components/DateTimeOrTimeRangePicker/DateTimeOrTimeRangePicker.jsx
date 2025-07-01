import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import vi from 'date-fns/locale/vi';

const DateTimeOrTimeRangePicker = ({ value, mainTask, onChange }) => {
    const [pickerType, setPickerType] = React.useState('dateTime');
    const [start, setStart] = React.useState(value?.start || new Date());
    const [end, setEnd] = React.useState(value?.end || new Date());
    const [dateError, setDateError] = React.useState('');

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
            pickerType,
        }),
        [start, end, pickerType, normalizeDate],
    );

    React.useEffect(() => {
        if (onChange) {
            onChange(normalizedValue);
        }
    }, [normalizedValue]);

    // Tách riêng useEffect cho việc cập nhật từ props để tránh loop
    React.useEffect(() => {
        if (
            value &&
            (value.start?.getTime() !== start?.getTime() ||
                value.end?.getTime() !== end?.getTime() ||
                value.pickerType !== pickerType)
        ) {
            setStart(value.start || new Date());
            setEnd(value.end || new Date());
            setPickerType(value.pickerType || 'dateTime');
        }
    }, [value?.start, value?.end, value?.pickerType]);

    const handlePickerTypeChange = (event) => {
        setPickerType(event.target.value);
    };

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

    return (
        <Box>
            <RadioGroup row value={pickerType} onChange={handlePickerTypeChange} sx={{ mb: 2 }}>
                <FormControlLabel value="dateTime" control={<Radio />} label="Chọn ngày giờ" />
                <FormControlLabel value="timeRange" control={<Radio />} label="Chọn khoảng thời gian" />
            </RadioGroup>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                {pickerType === 'dateTime' ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <DateTimePicker
                            label="Ngày giờ bắt đầu"
                            value={start}
                            onChange={(newValue) => setStart(newValue)}
                            onError={(reason) => setDateError(reason)}
                            minDateTime={mainTask ? getMinDateTime(start) : dayjs().startOf('day').toDate()}
                            maxDateTime={mainTask ? getMaxDateTime(start) : null}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    margin: 'dense',
                                    fullWidth: true,
                                    error: !!dateError,
                                    helperText: dateError ? 'Ngày không hợp lệ' : '',
                                },
                            }}
                        />
                        <DateTimePicker
                            label="Ngày giờ kết thúc"
                            value={end}
                            onChange={(newValue) => setEnd(newValue)}
                            onError={(reason) => setDateError(reason)}
                            minDateTime={mainTask ? getMinDateTime(end) : start}
                            maxDateTime={mainTask ? getMaxDateTime(end) : null}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    margin: 'dense',
                                    fullWidth: true,
                                    error: !!dateError,
                                    helperText: dateError ? 'Ngày không hợp lệ' : '',
                                },
                            }}
                        />
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TimePicker
                            label="Giờ bắt đầu"
                            value={start}
                            onChange={(newValue) => setStart(newValue)}
                            onError={(reason) => setDateError(reason)}
                            minTime={mainTask ? mainStart?.toDate() : undefined}
                            maxTime={mainTask ? mainEnd?.toDate() : undefined}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    margin: 'dense',
                                    fullWidth: true,
                                    error: !!dateError,
                                    helperText: dateError ? 'Giờ không hợp lệ' : '',
                                },
                            }}
                        />
                        <TimePicker
                            label="Giờ kết thúc"
                            value={end}
                            onChange={(newValue) => setEnd(newValue)}
                            onError={(reason) => setDateError(reason)}
                            minTime={start}
                            maxTime={mainTask ? mainEnd?.toDate() : undefined}
                            enableAccessibleFieldDOMStructure={false}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    margin: 'dense',
                                    fullWidth: true,
                                    error: !!dateError,
                                    helperText: dateError ? 'Giờ không hợp lệ' : '',
                                },
                            }}
                        />
                    </Box>
                )}
            </LocalizationProvider>
        </Box>
    );
};

export default React.memo(DateTimeOrTimeRangePicker);
