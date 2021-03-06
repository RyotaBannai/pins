import React, { useState, useEffect, useCallback, FC } from "react";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import EditIcon from "@material-ui/icons/Edit";
import { COLOR } from "../../constants/color";

interface IProps {
  createNewFolder: () => Promise<void>;
  deleteFolder: () => Promise<void>;
  editFolder: () => void;
  is_edit_mode: boolean;
  is_deletable: boolean;
  is_addable: boolean;
  toggleDeletableHandler: () => void;
  toggleAddableHandler: () => void;
}

export const FolderTitleControls: FC<IProps> = (props) => {
  const {
    createNewFolder,
    deleteFolder,
    editFolder,
    is_edit_mode,
    is_deletable,
    is_addable,
    toggleDeletableHandler,
    toggleAddableHandler,
  } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onColorAdd = useCallback(
    (value: boolean) => (value ? COLOR.PRIMARY : "inherit"),
    []
  );

  interface IAction {
    icon: JSX.Element;
    name: string;
    handler: () => void;
  }

  const actions: IAction[] = [
    {
      icon: <ViewHeadlineIcon style={{ color: onColorAdd(is_addable) }} />,
      name: is_addable ? "Quit Add List" : "Add List",
      handler: toggleAddableHandler,
    },
    {
      icon: <ClearAllIcon style={{ color: onColorAdd(is_deletable) }} />,
      name: is_deletable ? "Quit Delete List" : "Delete List",
      handler: toggleDeletableHandler,
    },
    {
      icon: <ViewColumnIcon />,
      name: "Add Folder",
      handler: createNewFolder,
    },
    {
      icon: <EditIcon style={{ color: onColorAdd(is_edit_mode) }} />,
      name: is_edit_mode ? "Quit Edit Folder" : "Edit Folder",
      handler: editFolder,
    },
    { icon: <DeleteIcon />, name: "Delete Folder", handler: deleteFolder },
  ];
  useEffect(() => {}, [
    createNewFolder,
    deleteFolder,
    editFolder,
    is_deletable,
    is_addable,
    toggleDeletableHandler,
    toggleAddableHandler,
  ]);

  return (
    <StyledSpeedDial
      ariaLabel="SpeedDial openIcon example"
      icon={<SpeedDialIcon openIcon={<BlurOnIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction={"down"}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            handleClose();
            action.handler();
          }}
        />
      ))}
    </StyledSpeedDial>
  );
};

const StyledSpeedDial = styled(SpeedDial)`
  position: absolute;
  right: 35px !important;
  bottom: unset !important;
`;
