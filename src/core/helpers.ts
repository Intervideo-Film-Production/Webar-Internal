import { useEffect, useRef } from "react"
import { IProduct } from "./declarations/app";

/**
 * since the body tag takes full height
 * this is to avoid the content is not trimmed of the screen
*/

const iOS15 = /OS 15/.test(navigator.userAgent);

export const useTrackBrowserHeight = () => {
  const trackBrowserHeight = () => {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  useEffect(() => {
    trackBrowserHeight();

    window.addEventListener('resize', trackBrowserHeight);

    return () => {
      window.removeEventListener('resize', trackBrowserHeight);
    }
  }, [])

  // force scroll top on iOS 15 to fix navigation bar minimizing issue in Safari
  useEffect(() => {

    if (iOS15) {
      const documentScrollHandler = () => {
        window.document.documentElement.scrollTop = 0;
      };

      document.addEventListener('scroll', documentScrollHandler);

      return () => { document.removeEventListener('scroll', documentScrollHandler) }
    }
  }, [])
}

/**
 * Remember previous value
*/
export const usePrevious = (value: unknown) => {
  const ref = useRef<unknown>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const deepCopyObject = <T extends object>(obj: T): T => {
  if (Array.isArray(obj)) {
    let newArray: Array<any> = [];
    obj.forEach(item => {
      newArray.push(deepCopyObject(item));
    });

    return (newArray as T);
  }

  if (typeof obj === 'object') {
    let newObject: { [key: string]: any } & object = {};
    const objKeys = Object.keys(obj);
    objKeys.forEach((key: string) => {
      newObject[key] = deepCopyObject((obj as { [key: string]: any })[key]);
    })
    return (newObject as T);
  }

  return obj;
}

export const sortFunction = (x: IProduct, y: IProduct) => {
  // check model series based on the first number in product name
  const rg = /^\D*([1-9]{1,2}).*$/;
  const xSeries = rg.exec(x.name);
  const ySeries = rg.exec(y.name);

  // if one of the products does not have series number => priortize the product with series number
  if (!xSeries && ySeries) return 1;
  if (xSeries && !ySeries) return -1;
  // if both have series number, priortize one with higher series number or order by name if the series number are equal
  if (xSeries && ySeries) return +ySeries[1] === +xSeries[1] ? y.name.localeCompare(x.name) : +ySeries[1] - +xSeries[1];

  // if any name is undefined => only apply when data from CMS is not properly provided
  if (!x.name && !!y.name) return -1;
  if (!!x.name && !y.name) return -1;
  // otherwise, sort by name
  return y.name.localeCompare(x.name);
}

export const isIOS = () => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const getRootSubPath = () => {
  const href = window.location.href;
  const pathGroups = href.match(/^https:\/\/[^\/]+((\/[^\/]+)*)\/.+$/m);
  return !!pathGroups
    ? pathGroups[1]
    : undefined
}