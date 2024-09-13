import * as React from "react";

import Dashboard from "../components/dashboard/Dashboard";
import Grid from "@mui/material/Grid";
import { violet_theme } from "../../theme/AppThemes";
import { ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { syncProductStructure } from "../../db/dbProduct";
import { useSnackbarUtils } from "../../utils/useSnackbarUtils";
import { syncUserStructure } from "../../db/dbUser";
import { syncCartModel } from "../../db/dbCart";

function DatabaseControlViewport() {
  const { showSnackbar } = useSnackbarUtils();

  return (
    <ThemeProvider theme={violet_theme}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Button
            startIcon={<CloudSyncIcon />}
            variant="contained"
            color="primary"
            onClick={() => {
              syncProductStructure(
                () => {
                  showSnackbar("Database synced successfully", "success");
                },
                (error) => {
                  showSnackbar("Database sync failed: " + error, "error");
                }
              );
            }}
          >
            Sync Product Model
          </Button>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Button
            startIcon={<CloudSyncIcon />}
            variant="contained"
            color="primary"
            onClick={() => {
              syncUserStructure(
                () => {
                  showSnackbar("Database synced successfully", "success");
                },
                (error) => {
                  showSnackbar("Database sync failed: " + error, "error");
                }
              );
            }}
          >
            Sync User Model
          </Button>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Button
            startIcon={<CloudSyncIcon />}
            variant="contained"
            color="primary"
            onClick={() => {
              syncCartModel(
                () => {
                  showSnackbar("Database synced successfully", "success");
                },
                (error) => {
                  showSnackbar("Database sync failed: " + error, "error");
                }
              );
            }}
          >
            Sync Cart Model
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default function DatabaseControlPage() {
  return (
    <Dashboard selectedIndex={4} childComponent={DatabaseControlViewport} />
  );
}
