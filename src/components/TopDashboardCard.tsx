import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  IconButton,
  Modal,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import MultipleChipSelect from "./MultipleChipSelect";

interface TopDashboardCardProps {
  analyzeSessions: (chosenValues: string[]) => Promise<void>;
  isLoading: boolean;
  value: number;
  totalSessions: number;
  unanalizedSessions: number;
  setValue: (value: number) => void;
  analyzedSessions?: number;
}

const TopDashboardCard: React.FC<TopDashboardCardProps> = ({
  analyzeSessions,
  isLoading,
  analyzedSessions = 0,
  value,
  setValue,
  totalSessions,
  unanalizedSessions,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [chosenValues, setChosenValues] = useState<string[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAnalyzeSessions = () => {
    analyzeSessions(chosenValues)
      .then(() => {
        handleCloseModal();
      })
      .catch((error) => {
        // Handle error if needed
      });
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    console.log("chosenValues,", chosenValues)
  }, [chosenValues]);

  const modalContent = (
    <Box sx={style}>
      <Typography variant="h6">Analyze {unanalizedSessions} responses</Typography>
      <MultipleChipSelect selectedValues={chosenValues} setSelectedValues={setChosenValues} />
      <Button onClick={handleAnalyzeSessions}>Analyze</Button>
    </Box>
  );

  return (
    <Card sx={{ marginTop: 2, pt: 3, pb: 0, pl: 3, pr: 3 }}>
      <Stack
        display={"flex"}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body1">{totalSessions} Responses</Typography>
        <div>
          <Button
            onClick={handleOpenModal}
            disabled={isLoading}
            color="primary"
            size="small"
          >
            {isLoading ? "Analyzing..." : `Analyze ${unanalizedSessions} responses`}
          </Button>
          <IconButton aria-label="more">
            <MoreVertIcon />
          </IconButton>
        </div>
      </Stack>
      <Stack display={"flex"} flexDirection="row" justifyContent="flex-end">
        <FormControlLabel
          control={<Switch defaultChecked color="primary" />}
          label="Accepting Responses"
          dir="rtl"
        />
      </Stack>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        centered
        aria-label="disabled tabs example"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Summary" />
        <Tab label="Analyzed responses" />
        <Tab label="Raw Response" />
      </Tabs>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        <div>{modalContent}</div>
      </Modal>
    </Card>
  );
};



export default TopDashboardCard;