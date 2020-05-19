import React from "react";
import { Grid, Typography, Button, Card } from "@material-ui/core";

export default function PageNotFound() {
  return (
    <Grid container>
      <Grid xs={12}>
        <Typography variant='h2'>We cannot find what you are looking for :(</Typography>
      </Grid>
    </Grid>
  );
}
