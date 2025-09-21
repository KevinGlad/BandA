import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ImageDocDTO } from '../../types/common/ImageTypes';

interface ImageListFormProps {
  imageList: ImageDocDTO[]
  editHandler: (id: string) => void
  deleteHandler: (id: string) => void
}

export default function ImageListForm({imageList, editHandler, deleteHandler}: ImageListFormProps) {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="image table">
        <TableHead>
          <TableRow>
            <TableCell>Thumbnails</TableCell>
            <TableCell>Image Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {imageList.map((image: ImageDocDTO) => (
            <TableRow key={image.imageId}>
              <TableCell component="th" scope="row">
                <img src={image.bImageURL} alt={image.name} width={50} height={50} />
                <img src={image.aImageURL} alt={image.name} width={50} height={50} />
              </TableCell>
              <TableCell>{image.name}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <IconButton aria-label="edit" onClick={() => editHandler(image.imageId)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => deleteHandler(image.imageId)}>
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
