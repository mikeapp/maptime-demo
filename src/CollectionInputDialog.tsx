import {useState} from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type CollectionInputDialogProps = {
    uri: string | null;
    setUri: (uri:string|null) => void;
}

const CollectionInputDialog = ({uri, setUri}:CollectionInputDialogProps) => {
    const [open, setOpen] = useState(false);
    const [tempUri, setTempUri] = useState(uri || "https://mikeapp.github.io/manifest-fixtures/collection/test.json");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleView = () => {
        setUri(tempUri);
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                View a collection
            </Button>
            <Dialog open={open} onClose={handleCancel}>
                <DialogTitle>Collection Address</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide the web address (URI) of the IIIF Collection.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="collectionUri"
                        label="IIIF collection URI"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={tempUri}
                        onChange={(e) => {setTempUri(e.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleView}>View</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CollectionInputDialog;