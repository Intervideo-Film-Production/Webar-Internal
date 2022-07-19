import React, { memo, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from '@mui/styles';
import { urlFor } from 'src/crud/api';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import { usePrevious } from 'src/core/helpers';

interface LazyImageProps {
  src?: SanityImageSource | ImageUrlBuilder | string;
  alt?: string;
  styles?: React.CSSProperties;
  noImageComponent?: React.ComponentElement<any, any>;
  onImageLoad?: () => void;
};

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%'
  }
}));

/**
 * Get image size from Sanity url string (format: http://....-{width}x{height}.{extension})
 * Only works for Sanity
*/
const checkImgWidth = (src?: SanityImageSource | ImageUrlBuilder) => {
  if (typeof src !== 'string') return [0, 0];
  // eslint-disable-next-line no-useless-escape
  const imgSizes = (src as string).match(/\-([0-9]{1,4})\x([0-9]{1,4})\.(png|jpg|jpeg|webp)/);
  if (!imgSizes) return [0, 0];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_originalUrl, widthString, heightString] = imgSizes;
  return [+widthString, +heightString];
}

const LazyImage = memo(forwardRef(
  ({ src, alt = '', styles, className, noImageComponent, onImageLoad }: LazyImageProps & React.HtmlHTMLAttributes<HTMLImageElement>, ref) => {
    const classes = useStyles();
    const imgRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(ref, () => ({
      self: () => imgRef.current
    }));

    const previousSrc = usePrevious(src);

    useEffect(() => {
      if (src !== previousSrc) {
        if (!!imgRef.current && !!imgRef.current.getAttribute('src')) {
          imgRef.current.removeAttribute('src');
          if (!imgRef.current.classList.contains('lazy')) {
            imgRef.current.classList.add('lazy');
          }
        }
      }
    }, [previousSrc, src])

    const urls = useMemo(() => {
      let dummyUrl: string = '', realUrl: string = '';

      if (src !== undefined && src !== null) {
        const [width] = checkImgWidth(src);

        dummyUrl = width > 1000
          ? process.env.REACT_APP_STATIC_DATA !== 'TRUE'
            ? (typeof src === 'string' ? urlFor(src).width(1000) : src as ImageUrlBuilder).auto('format').blur(300).url() as string
            : src as string
          : process.env.REACT_APP_STATIC_DATA !== 'TRUE'
            ? (typeof src === 'string' ? urlFor(src) : src as ImageUrlBuilder).auto('format').blur(300).url() as string
            : src as string;

        realUrl = width > 1000
          ? process.env.REACT_APP_STATIC_DATA !== 'TRUE'
            ? (typeof src === 'string' ? urlFor(src).width(1000) : src as ImageUrlBuilder).auto('format').url() as string
            : src as string
          : process.env.REACT_APP_STATIC_DATA !== 'TRUE'
            ? (typeof src === 'string' ? urlFor(src) : src as ImageUrlBuilder).auto('format').url() as string
            : src as string;
      }

      return { dummyUrl, realUrl };

    }, [src]);

    useEffect(() => {
      if (imgRef.current && urls.dummyUrl !== '' && urls.realUrl !== '') {
        imgRef.current.setAttribute('src', urls.dummyUrl);

        const realImage = new Image();

        realImage.onload = () => {

          if (imgRef.current) {
            imgRef.current.src = urls.realUrl;
            imgRef.current.classList.remove('lazy');

            if (onImageLoad) onImageLoad();
          }
        };

        realImage.src = urls.realUrl;

      }
    }, [urls, onImageLoad]);

    return urls.dummyUrl !== '' && urls.realUrl !== ''
      ? (<img style={{ ...styles }} ref={imgRef} className={`${className} ${classes.root} lazy`} alt={alt} />)
      : (<>{noImageComponent}</>)
  })
);

export default LazyImage;
