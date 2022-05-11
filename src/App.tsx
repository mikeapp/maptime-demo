import React, {useEffect, useState} from 'react';
import './App.css';
import {Collection} from "iiif-maptime/iiif/Collection";
import {Alert, AppBar, Box, LinearProgress, Toolbar, Typography} from "@mui/material";
import CollectionMap from "iiif-maptime/components/CollectionMap";
import CollectionInputDialog from "./CollectionInputDialog";

function App() {
    const APP_NAME = "Collection Viewer";
    const [collectionURI, setCollectionURI] = useState(new URLSearchParams(window.location.search).get("collection") || null)
    const [collection, setCollection] = useState<Collection | null>(null);
    const [collectionLabel, setCollectionLabel] = useState<any | null>(APP_NAME);
    const [progress, setProgess] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const collectionDialog = () => (
        <Box ml={5}>
            <CollectionInputDialog uri={collectionURI} setUri={setCollectionURI} />
        </Box>
    );

    const updateProgress = (percent:number) => {
        setProgess(percent);
    }

    const execute = async (options = {}) => {
        setErrorMessage(null);
        if (collectionURI !== null) {
            setCollectionLabel(APP_NAME);
            const c = new Collection(collectionURI);
            c.fetch(updateProgress).then(() => {
                const l = c.iiif?.getDefaultLabel();
                setCollection(c);
                setCollectionLabel(l);
            }).catch((e) => {
                setErrorMessage("An error has occurred when loading the collection or one of its objects.  Please check the collection URL.");
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
                    {collectionDialog()}
                </Box>;
        } else if (collectionURI === null) {
            return (
                <Box alignContent="center" width="100%">
                    <Alert variant="filled" severity="warning">No collection was specified</Alert>
                    <Typography m={5}>To view a collection, please provide its URL.</Typography>
                    {collectionDialog()}
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
                {collectionDialog()}
            </Box>;
        }
        return <CollectionMap collection={collection} viewerPath="./uv.html#?manifest=" />;
    }

    return (
        <>
            <AppBar position="fixed">
                <Toolbar sx={{backgroundColor:"dimgray"}}>
                    <Typography variant="h5" component="h1" p={2}>{collectionLabel}</Typography>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            {collectionMap()}
        </>
    );

}

export default App;
