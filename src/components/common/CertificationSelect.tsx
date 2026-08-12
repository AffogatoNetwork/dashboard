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

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    // ⚡ Bolt: Maintain referential equality for selected items in Autocomplete
    setSelectedCertifications(newValue);
    onSelect(newValue); // Pass selected certifications to the parent component
  };

  return (
    <div>
      <Autocomplete
        multiple
        filterSelectedOptions
        options={certificationList}
        value={selectedCertifications} // Set selected certifications
        onChange={handleSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Certifications"
            variant="outlined"
          />
        )}
        getOptionLabel={(option) => option} // Display the option as the string itself
      />
    </div>
  );
};

export default CertificationSelect;
