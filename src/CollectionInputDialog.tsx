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
    open: boolean;
    updateState: (open:boolean) => void;
}

const CollectionInputDialog = ({uri, setUri, open, updateState}:CollectionInputDialogProps) => {
    const [tempUri, setTempUri] = useState(uri || "https://mikeapp.github.io/manifest-fixtures/collection/test.json");

    const handleClickOpen = () => {
        updateState(true);
    };

    const handleView = () => {
        setUri(tempUri);
        updateState(false);
    };

    const handleCancel = () => {
        updateState(false);
    };

    return (
        <div>
            <Dialog open={open}
                    disableScrollLock
                    onClose={handleCancel}
                    disableRestoreFocus
                    fullWidth={true}>
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