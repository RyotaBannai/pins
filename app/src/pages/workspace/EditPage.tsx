import React, { useState, useEffect, SyntheticEvent, FC } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import {
  L_GET_WORKSPACE,
  S_GET_WORKSPACE,
  S_EDIT_WORKSPACE,
} from "../../modules/workspace/queries";
import { useWorkspace, getCurrentWS } from "../../modules/workspace/actions";
import { useStyles } from "../../assets/style/workspace/page.style";
import { SnakbarAlert } from "../../components/parts/SnakbarAlert";
import {
  Button,
  Grid,
  Icon,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@material-ui/core";

interface Props {}
export const EditPage: FC<Props> = () => {
  const { addateWS } = useWorkspace();
  const classes = useStyles();
  const [saveSnackBarOpen, setOpen] = useState(false);

  const onChangeName = (e: any) => handleEvent(e, "name");
  const onChangeDescription = (e: any) => handleEvent(e, "description");
  const handleEvent = (e: any, form_name: string) => {
    e.preventDefault();
    setChange(e.target.value, form_name);
  };
  const setChange = (value: string, update_data: string) => {
    addateWS({
      [update_data]: value,
      type: update_data,
    });
  };

  const { loading: sg_loading, error: sg_error, data } = useQuery(
    S_GET_WORKSPACE,
    {
      variables: {
        id: getCurrentWS().id,
      },
    }
  );
  const { data: l_data } = useQuery(L_GET_WORKSPACE);

  const [
    s_editWorkspace,
    { loading: sa_loading, error: sa_error, called: sa_called },
  ] = useMutation(S_EDIT_WORKSPACE, {
    onCompleted({ res }) {
      setOpen(!saveSnackBarOpen);
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  if (sg_loading) return <p>Loading...</p>;
  if (sg_error) return <p>Error :(</p>;
  return (
    <div>
      <h2>Edit Current Workspace</h2>
      {/* <pre>{JSON.stringify(data, null, 1)}</pre>
      <pre>{JSON.stringify(l_data, null, 1)}</pre> */}
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridName}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            required
            defaultValue={data?.getWorkspace.name ?? "Workspace"}
            className={classes.name}
            onChange={onChangeName}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item className={classes.gridDescription}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <TextField
            id="description"
            required
            multiline
            rowsMax={4}
            variant="outlined"
            defaultValue={
              data?.getWorkspace.description ?? "Describe your workspace"
            }
            className={classes.description}
            onChange={onChangeDescription}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center" direction="row" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            endIcon={<Icon>arrow_right</Icon>}
            disableRipple
            disableTouchRipple
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              s_editWorkspace({
                variables: { ...l_data.l_getWorkspace, id: getCurrentWS().id },
              });
            }}
          >
            Edit Workspace
          </Button>
        </Grid>
      </Grid>
      <SnakbarAlert isOpen={saveSnackBarOpen} />
    </div>
  );
};