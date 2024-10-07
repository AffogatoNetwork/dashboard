import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { getVarieties } from '../../db/firebase'; // Assuming you have a Firebase function

interface VarietySelectProps {
  onSelect: (selectedVarieties: string[]) => void; // We'll store selected varieties
}

const VarietySelect: React.FC<VarietySelectProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
      } catch (error) {
        console.error('Error fetching varieties:', error);
      }
    };

    fetchVarieties();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: any[]) => {
    const newSelectedVarieties = newValue.map((variety) => variety.id);
    const updatedVarieties = newValue.map((variety) => ({
      id: variety.id,
      name: variety.name,
    }));

    setSelectedVarieties(updatedVarieties); // Display names
    onSelect(newSelectedVarieties); // Pass only ids to parent
  };

  const handleRemove = (name: string) => {
    const updatedSelected = selectedVarieties.filter(
      (variety) => variety.name !== name
    );
    setSelectedVarieties(updatedSelected);
    onSelect(updatedSelected.map((variety) => variety.id)); // Update selected ids array
  };

  const filteredVarieties = varietyList.filter(
    (variety) =>
      variety.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedVarieties.some((selected) => selected.id === variety.id) // Remove already selected
  );

  return (
    <div>
      <Autocomplete
        multiple
        options={filteredVarieties}
        getOptionLabel={(option) => option.name}
        value={selectedVarieties} // Set selected varieties
        onChange={(event, newValue) => handleSelect(event, newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id} // To prevent duplicates
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecionar Variedades"
            variant="outlined"
            onChange={handleSearchChange}
          />
        )}
      />
    </div>
  );
};

export default VarietySelect;
