import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { violet_theme } from "../../../theme/AppThemes";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import DefaultAvatarSelection from "./DefaultAvatarSelection";
import { useSetUserAvatar } from "../../../db/dbUser";
import { useSnackbarUtils } from "../../../utils/useSnackbarUtils";
import AvatarUploader from "./AvatarUploader";
import AvatarInputUrl from "./AvatarInputUrl";

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

export default function AvatarSelection() {
  const [value, setValue] = React.useState(0);
  const user = useSelector((state) => state.user.user);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <ThemeProvider theme={violet_theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          height: "100%",
        }}
        border={1}
        borderColor="divider"
        borderRadius={1}
        width="100%"
      >
        <Typography variant="h6" color="primary">
          Avatar
        </Typography>
        <Box
          sx={{ maxWidth: "400px", height: "200px" }}
          border={1}
          borderColor="divider"
          borderRadius={1}
          width="100%"
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }} width="100%">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Url" {...a11yProps(0)} />
              <Tab label="Upload file" {...a11yProps(1)} />
              <Tab label="Default" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <AvatarInputUrl />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AvatarUploader />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <DefaultAvatarSelection />
          </CustomTabPanel>
        </Box>

        <Avatar
          src={user.avatarImageUrl}
          alt="avatar"
          style={{
            width: "200px",
            height: "auto",
          }}
        />
      </Box>
    </ThemeProvider>
  );
}
