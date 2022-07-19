import sanityClient from '@sanity/client';
import { format } from 'date-fns';
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId: string = process.env.REACT_APP_PROJECT_ID as string;
const dataset: string = process.env.REACT_APP_DATASET as string;

const client = sanityClient({
  projectId,
  dataset,
  apiVersion: format(new Date(), "yyyy-MM-dd"),
  useCdn: false
})


const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImageSource) => builder.image(source);

export default client;
