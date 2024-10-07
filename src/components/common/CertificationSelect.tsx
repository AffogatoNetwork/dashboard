// CertificationSelect.tsx
import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { getCertifications } from '../../db/firebase'; // Adjust the import based on your project structure

interface CertificationSelectProps {
  currentCoop: string;
  onSelect: (selectedCertifications: string[]) => void; // Callback to pass selected certifications back to the parent
}

const CertificationSelect: React.FC<CertificationSelectProps> = ({
  currentCoop,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [certificationList, setCertificationList] = useState<string[]>([]);

  useEffect(() => {
    const fetchCertifications = async () => {
      const result = await getCertifications(currentCoop);
      const certifications = result.map((certificationDoc: any) => {
        const certificationData = certificationDoc.data();
        return certificationData.certification; // Adjust the property if needed
      });

      setCertificationList(certifications);
    };

    fetchCertifications();
  }, [currentCoop]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    setSelectedCertifications(newValue);
    onSelect(newValue); // Pass selected certifications to the parent component
  };

  const handleRemove = (certification: string) => {
    const updatedSelected = selectedCertifications.filter(
      (item) => item !== certification
    );
    setSelectedCertifications(updatedSelected);
    onSelect(updatedSelected); // Update selected certifications array
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={certificationList}
        value={selectedCertifications} // Set selected certifications
        onChange={handleSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Certifications"
            variant="outlined"
            onChange={handleSearchChange}
          />
        )}
        getOptionLabel={(option) => option} // Display the option as the string itself
        renderOption={(props, option) => (
          <li {...props}>
            {option}
            <button onClick={() => handleRemove(option)}>Remove</button>{' '}
            {/* Optionally, you can add a remove button */}
          </li>
        )}
      />
    </div>
  );
};

export default CertificationSelect;
