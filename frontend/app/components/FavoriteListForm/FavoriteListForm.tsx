import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TvIcon from "@mui/icons-material/Tv";
import type { FavoriteDocDTO } from "../../types/common/favoriteTypes";

interface FavoriteListFormProps {
  favoriteList: FavoriteDocDTO[];
  displayHandler: (id: string) => void;
  editHandler: (id: string) => void;
  deleteHandler: (id: string) => void;
}

export default function FavoriteListForm({
  favoriteList,
  displayHandler,
  editHandler,
  deleteHandler,
}: FavoriteListFormProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="image table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {favoriteList.map((favorite: FavoriteDocDTO) => (
            <TableRow key={favorite.favoriteId}>
              <TableCell>{favorite.name}</TableCell>
              <TableCell>{favorite.provider}</TableCell>
              <TableCell align="right">
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <IconButton
                    aria-label="display"
                    onClick={() => displayHandler(favorite.favoriteId)}
                  >
                    <TvIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => editHandler(favorite.favoriteId)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteHandler(favorite.favoriteId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
