import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { AppConfig } from '@dynaslope/commons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 'auto',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
function AttachmentsGridList(props) {
    const { data: tileData } = props;
    const classes = useStyles();


    const handleDownloadInt = (link) => () => {
        console.log(link)
        window.open(link,'_blank');
    };

    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                    <ListSubheader component="div">
                        {tileData.length === 0 && ("No ")}
                        Attachments
                    </ListSubheader>
                </GridListTile>
                {
                    tileData.map((tile) => {
                        const temp = `${tile.value}${tile.title}`.split("html/");
                        const temp2 = `${AppConfig.HOST_DIR}${temp[1]}`
                        return (
                            <GridListTile key={tile.value}>
                                <img src={temp2} alt={tile.title} />
                                <GridListTileBar
                                    title={tile.title}
                                    subtitle={<span>Path: {tile.value}</span>}
                                    actionIcon={
                                        <IconButton onClick={handleDownloadInt(temp2)} aria-label={`File Type ${tile.sub_title}`} className={classes.icon}>
                                            <InfoIcon />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        )
                    })
                }
            </GridList>
        </div>
    );
}

export default AttachmentsGridList