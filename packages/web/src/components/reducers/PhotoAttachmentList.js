import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageGallery from 'react-image-gallery';
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

const sample = [
    {
        original: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
        thumbnail: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
    },
    {
        original: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
        thumbnail: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
    },
    {
        original: 'https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg',
        thumbnail: 'https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg',
    }
]

export default function PhotoAttachmentList(props) {
    const { data: images } = props;
    const classes = useStyles();

    return (
            <ImageGallery items={sample} />
    );
}
