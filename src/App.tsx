import React, {useEffect, useState} from 'react';
import './App.css';
import {Collection, CollectionMap, Manifest} from "iiif-maptime";
import {Alert, AppBar, Box, LinearProgress, Toolbar, Typography, Button} from "@mui/material";
import CollectionInputDialog from "./CollectionInputDialog";
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

function App() {
    const APP_NAME = "Collection Viewer";
    const [collectionURI, setCollectionURI] = useState(new URLSearchParams(window.location.search).get("iiif-content") || null)
    const [collection, setCollection] = useState<Collection | null>(null);
    const [collectionLabel, setCollectionLabel] = useState<any | null>(APP_NAME);
    const [progress, setProgess] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const updateProgress = (percent:number) => {
        setProgess(percent);
    }
    const execute = async (options = {}) => {
        setErrorMessage(null);
        if (collectionURI !== null) {
            setCollectionLabel(APP_NAME);
            const c = new Collection(collectionURI);
            c.fetch(updateProgress).then(() => {
                if (!c.iiif?.isCollection()) throw("IIIF resource is not a collection");
                const l = c.iiif?.getDefaultLabel();
                setCollection(c);
                setCollectionLabel(l);
            }).catch((e) => {
                setErrorMessage("An error has occurred when loading the collection or one of its objects.  Please verify the collection URL.");
            });
        }
    }
    useEffect(() => {
        execute();
    }, [collectionURI]);

    const collectionMap = () => {
        if (errorMessage !== null) {
            console.log(errorMessage);
            return <Box alignContent="center" width="100%">
                    <Alert variant="filled" severity="error">An error has occurred</Alert>
                    <Typography m={5}>{errorMessage}</Typography>
                </Box>;
        } else if (collectionURI === null) {
            return (
                <Box alignContent="center" width="100%">
                    <Alert variant="filled" severity="warning">No collection was specified</Alert>
                    <Typography m={5}>To view a collection, please provide its URL.</Typography>
                </Box>
            );
        } else if (collection === null) {
            return <Box m={5}>
                <Typography mt={5}>Loading</Typography>
                <Box mt={2} mb={2}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
                </Box>
            </Box>;
        } else if (collection.manifests().length === 0) {
            return <Box alignContent="center" width="100%">
                <Alert variant="filled" severity="warning">The collection is empty.</Alert>
                <Typography m={5}>The collection contains no objects.</Typography>
            </Box>;
        }
        return <CollectionMap collection={collection} viewerPath="./uv.html#?manifest=" />;
    }

    const showCollectionDialog = () => {
        setShowDialog(true);
    }

    return (
        <>
            <CollectionInputDialog uri={collectionURI} setUri={setCollectionURI} open={showDialog} updateState={setShowDialog}/>
            <AppBar position="relative">
                <Toolbar sx={{backgroundColor:"dimgray"}}>
                    <Typography variant="h5" component="h1" p={2}  sx={{ flexGrow: 1 }}>{collectionLabel}</Typography>
                    <Button variant="contained"
                            startIcon={<OpenInBrowserIcon/>}
                            onClick={() => showCollectionDialog()}>Open a collection</Button>
                </Toolbar>
            </AppBar>
            {collectionMap()}
        </>
    );

}

export default App;
