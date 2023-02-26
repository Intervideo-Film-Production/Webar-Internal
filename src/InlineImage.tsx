import { makeStyles } from '@mui/styles';
import { memo, useCallback, useRef } from 'react';
import { LazyImage } from './components';
import { urlFor } from './crud/api';

const inlineImageStyles = makeStyles(() => ({
  featureImage: {
    maxHeight: '30px',
    marginBottom: '5px',
    objectFit: 'fill'
  },
  firstImage: {
    width: '30px',
    height: '30px',
    marginRight: '5px',
    objectFit: 'contain'
  },
  nextImage: {
    alignSelf: 'center',
    height: 'auto !important'
  }
}));

const InlineImage = memo(({ imgObj, isFirst }: { imgObj: any, isFirst: boolean }) => {
	const classes = inlineImageStyles();

	const imageRef = useRef<{ self: () => HTMLImageElement | null }>(null);

	const imageLoadHandle = useCallback(() => {
		const img = imageRef.current?.self();
		if (!!img) {
			// img.setAttribute('style', 'width: calc(100% - 35px)');
			// if the second image's height is less than 26px, the image should be in the next line
			if (img.height < 26) {
				img.removeAttribute('style');
			}
		}
	}, []);

	return (
		<LazyImage
			ref={imageRef}
			// className={`${classes.featureImage} ${isFirst ? classes.firstImage : classes.nextImage}`}
			style={{
				objectFit: 'contain'
			}}
			src={process.env.REACT_APP_STATIC_DATA !== 'TRUE' ? urlFor(imgObj.image.asset) : imgObj.url}
			onImageLoad={isFirst ? undefined : imageLoadHandle}
		/>
	)
});

export default InlineImage;
