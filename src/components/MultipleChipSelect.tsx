import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];
interface MultipleChipSelectProps {
    selectedValues: string[];
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultipleChipSelect: React.FC<MultipleChipSelectProps> = ({ selectedValues, setSelectedValues }) => {


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        if (inputValue.trim() === "") {
            return;
        }

        if (
            event.target.value &&
            event.target.value.slice(-1) === " " &&
            !selectedValues.includes(inputValue.trim())
        ) {
            setSelectedValues((prevSelectedValues) => [
                ...prevSelectedValues,
                inputValue.trim(),
            ]);
        }
    };

    const handleDeleteChip = (value: string) => {
        setSelectedValues((prevSelectedValues) =>
            prevSelectedValues.filter((item) => item !== value)
        );
    };

    return (
        <Autocomplete
            multiple
            freeSolo
            options={names}
            value={selectedValues}
            onChange={(event, newValue) => {
                setSelectedValues(newValue);
            }}
            renderTags={(value: string[]) =>
                value.map((item: string, index: number) => (
                    <Chip
                        key={item}
                        label={item}
                        onDelete={() => handleDeleteChip(item)}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add tags"
                    variant="outlined"
                    onChange={handleInputChange}
                />
            )}
        />
    );
}

export default MultipleChipSelect;
