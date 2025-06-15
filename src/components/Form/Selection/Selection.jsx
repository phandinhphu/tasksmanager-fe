import * as React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Selection = ({ title, value, onChange, menuitems }) => {
    return (
        <FormControl fullWidth margin="normal">
            <InputLabel>{title}</InputLabel>
            <Select name={title} value={value} label={title} onChange={onChange} required>
                {menuitems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default React.memo(Selection);
