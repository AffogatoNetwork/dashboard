import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { getAllFarmers } from '../../db/firebase'; // Assuming you have a Firebase function

interface FarmerSelectProps {
  currentCoop: string;
  onSelect: (selectedFarmers: string[]) => void; // We'll store selected farmers' addresses
}

const FarmerSelect: React.FC<FarmerSelectProps> = ({
  currentCoop,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmers, setSelectedFarmers] = useState<
    { address: string; fullname: string }[]
  >([]);
  const [farmerList, setFarmerList] = useState<
    { address: string; fullname: string }[]
  >([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      const result = await getAllFarmers(currentCoop);
      console.log(result);

      const farmers = result.map((farmer: any) => {
        const farmerData = farmer.data();
        const { address, fullname } = farmerData;

        return { address, fullname };
      });

      setFarmerList(farmers);
    };

    fetchFarmers();
  }, [currentCoop]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: any[]) => {
    const newSelectedFarmers = newValue.map((farmer) => farmer.address);
    const updatedFarmers = newValue.map((farmer) => ({
      address: farmer.address,
      fullname: farmer.fullname,
    }));

    setSelectedFarmers(updatedFarmers); // Display names
    onSelect(newSelectedFarmers); // Pass only addresses to parent
  };

  const handleRemove = (fullname: string) => {
    const updatedSelected = selectedFarmers.filter(
      (farmer) => farmer.fullname !== fullname
    );
    setSelectedFarmers(updatedSelected);
    onSelect(updatedSelected.map((farmer) => farmer.address)); // Update selected addresses array
  };

  const filteredFarmers = farmerList.filter(
    (farmer) =>
      farmer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedFarmers.some((selected) => selected.address === farmer.address) // Remove already selected
  );

  return (
    <div>
      <Autocomplete
        multiple
        options={filteredFarmers}
        getOptionLabel={(option) => option.fullname}
        value={selectedFarmers} // Set selected farmers
        onChange={(event, newValue) => handleSelect(event, newValue)}
        isOptionEqualToValue={(option, value) =>
          option.address === value.address
        } // To prevent duplicates
        renderInput={(params) => (
          <TextField
            {...params}
            label="Selecionar Productores"
            variant="outlined"
            onChange={handleSearchChange}
          />
        )}
      />
    </div>
  );
};

export default FarmerSelect;
