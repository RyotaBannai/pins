import React, { useEffect, FC } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import ItemListTableRow from "../../components/Item/ItemListTableRow";

interface Props {
  data: Item.Items | undefined;
  returnData: any;
  createData: any;
  selectable: {
    is_selectable: boolean;
    add?: any;
    remove?: any;
    selected?: any;
  };
}

const ItemListTable: FC<Props> = (props) => {
  const { data, returnData, selectable } = props;

  useEffect(() => {}, [data, selectable]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size={"small"}>
        <TableHead>
          <TableRow>
            {selectable.is_selectable ? (
              <TableCell style={{ width: "10%" }} />
            ) : (
              <></>
            )}
            <TableCell>Data</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {returnData(data).map((row: ApparatusSet.createDataType) => (
            <ItemListTableRow
              key={uuidv4()}
              row={row}
              selectable={selectable}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ItemListTable as default };