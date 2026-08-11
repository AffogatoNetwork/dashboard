import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { getVarieties } from '../../db/firebase'; // Assuming you have a Firebase function

interface VarietySelectProps {
  onSelect: (selectedVarieties: string[]) => void; // We'll store selected varieties
}

const VarietySelect: React.FC<VarietySelectProps> = ({ onSelect }) => {
  const [selectedVarieties, setSelectedVarieties] = useState<
    { id: string; name: string }[]
  >([]);
  const [varietyList, setVarietyList] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const result = await getVarieties();
        const varieties: { id: string; name: string }[] = [];

        for (let i = 0; i < result.length; i++) {
          const element = result[i].data();
          const { id, name } = element; // Assuming these fields exist
          varieties.push({ id, name });
        }

        setVarietyList(varieties);
      } catch (error) {}
    };

    fetchVarieties();
  }, []);

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: any[]) => {
    const newSelectedVarieties = newValue.map((variety) => variety.id);

    // ⚡ Bolt: Maintain referential equality for selected items in Autocomplete
    // Using the newValue directly instead of mapping to new objects prevents
    // unnecessary re-renders and allows filterSelectedOptions to work correctly.
    setSelectedVarieties(newValue); // Display names
    onSelect(newSelectedVarieties); // Pass only ids to parent
  };

  return (
    <div>
      <Autocomplete
        multiple
        filterSelectedOptions
        options={varietyList}
        getOptionLabel={(option) => option.name}
        value={selectedVarieties} // Set selected varieties
        onChange={(event, newValue) => handleSelect(event, newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id} // To prevent duplicates
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecionar Variedades"
            variant="outlined"
          />
        )}
      />
    </div>
  );
};

export default VarietySelect;
