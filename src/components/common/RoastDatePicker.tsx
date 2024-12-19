import React from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface RoastDatePickerProps {
  value: string; // Assuming the value is a string in 'YYYY-MM-DD' format
  onChange: (newDate: string) => void; // Callback to handle date change
  label: string; // Label for the date picker
}

const RoastDatePicker: React.FC<RoastDatePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <div>
      <label>{label}</label>
      <DatePicker
        value={dayjs(value)}
        onChange={(newValue) => onChange(newValue?.format('YYYY-MM-DD') || '')}
        slotProps={{ textField: { className: 'input-bordered input w-full' } }}
      />
    </div>
  );
};

export default RoastDatePicker;
