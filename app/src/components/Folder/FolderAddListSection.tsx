import React, { useEffect, useCallback, FC } from "react";
import { useMutation, ApolloError, ApolloQueryResult } from "@apollo/client";
import { S_ADD_LISTS } from "../../api/graphql/folderQueries";
import { useDispatch, useSelector } from "react-redux";
import { useFolderActions } from "../../features/folder/folderFeatureSlice";
import { useFolderHelpers } from "../../features/folder/folderHelpers";
import { useWSHelpers } from "../../features/workspace/wsHelpers";
import {
  Box,
  Button,
  Divider,
  Grid,
  Icon,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { StyledAppBar } from "../Parts/StyleAppBar";
import ListEditPageTable from "../List/ListEditPageTable";

interface Props {
  is_addable: boolean;
  folder_id: string;
  lists: ApparatusList.ListData[];
  callSnackBarOpenHandler: () => void;
  refetchFolder: (
    variables?:
      | Partial<{
          id: string;
          wsId: number;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
}
export const FolderAddListSection: FC<Props> = (props) => {
  const {
    is_addable,
    folder_id,
    lists,
    callSnackBarOpenHandler,
    refetchFolder,
  } = props;
  const {
    addSelectedListToAddable,
    removeSelectedListToAddable,
  } = useFolderActions();
  const { getAddable } = useFolderHelpers;
  const { selected_lists } = useSelector(getAddable);
  const dispatch = useDispatch();

  const onAddSelectedListHandler = (id: string) =>
    dispatch(addSelectedListToAddable({ list_id: id }));
  const onRemoveSelectedListHandler = (id: string) =>
    dispatch(removeSelectedListToAddable({ list_id: id }));

  const selectable: Folder.Selectable = {
    is_selectable: true,
    add: onAddSelectedListHandler,
    remove: onRemoveSelectedListHandler,
    selected: selected_lists,
  };

  const [s_addLists] = useMutation(S_ADD_LISTS, {
    onCompleted({ addLists }) {
      callSnackBarOpenHandler();
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });

  let addListsToFolderHandler = useCallback(async () => {
    const variables = {
      folderId: Number(folder_id),
      lists: selected_lists.map((listId: string) => Number(listId)),
    };
    await s_addLists({ variables });
    refetchFolder();
  }, [s_addLists, selected_lists, folder_id, refetchFolder]);

  useEffect(() => {}, [lists]);

  return (
    <>
      {is_addable ? (
        <Box>
          <Typography
            variant="h5"
            color="textPrimary"
            component="p"
            style={{ marginLeft: 10, marginTop: 30 }}
          >
            Add Form
          </Typography>
          <Divider style={{ marginBottom: 10 }} />
          <StyledAppBar position="static">
            <Toolbar variant="dense">
              <Grid container alignItems="center" direction="row" spacing={1}>
                <Grid item>
                  <Typography variant="h6" color="inherit">
                    Add From List
                  </Typography>
                </Grid>

                {selected_lists?.length > 0 ? (
                  <>
                    <Grid item>
                      <Typography variant="h6" color="inherit">
                        {selected_lists?.length + " selected"}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Icon>arrow_right</Icon>}
                        disableRipple
                        disableTouchRipple
                        onClick={addListsToFolderHandler}
                      >
                        Add
                      </Button>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>
            </Toolbar>
          </StyledAppBar>
          {lists?.length > 0 ? (
            <ListEditPageTable data={lists} selectable={selectable} />
          ) : (
            <div>No list found</div>
          )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
