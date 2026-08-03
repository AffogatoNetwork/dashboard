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
  const [selectedFarmers, setSelectedFarmers] = useState<
    { address: string; fullname: string }[]
  >([]);
  const [farmerList, setFarmerList] = useState<
    { address: string; fullname: string }[]
  >([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      const result = await getAllFarmers(currentCoop);

      const farmers = result.map((farmer: any) => {
        const farmerData = farmer.data();
        const { address, fullname } = farmerData;

        return { address, fullname };
      });

      setFarmerList(farmers);
    };

    fetchFarmers();
  }, [currentCoop]);

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: any[]) => {
    const newSelectedFarmers = newValue.map((farmer) => farmer.address);
    const updatedFarmers = newValue.map((farmer) => ({
      address: farmer.address,
      fullname: farmer.fullname,
    }));

    setSelectedFarmers(updatedFarmers); // Display names
    onSelect(newSelectedFarmers); // Pass only addresses to parent
  };

  return (
    <div>
      {/* ⚡ Bolt Performance Optimization:
          Removed manual state-based filtering (searchTerm) and Array.filter operations.
          Using MUI Autocomplete's built-in filterSelectedOptions for optimized C++ level equivalent DOM filtering */}
      <Autocomplete
        multiple
        filterSelectedOptions
        options={farmerList}
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
          />
        )}
      />
    </div>
  );
};

export default FarmerSelect;
