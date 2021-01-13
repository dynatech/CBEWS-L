import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageGallery from 'react-image-gallery';

import '../../styles/image-gallery.css';

export default function PhotoAttachmentList(props) {
    const { data: images, imageRef } = props;

    return (
            <ImageGallery ref={imageRef} items={images} />
    );
}
