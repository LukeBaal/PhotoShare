/// <reference types="react-scripts" />
declare module 'react-firebase-file-uploader';
declare module 'algoliasearch/lite';
declare module 'react-instantsearch-dom';
declare module 'react-lazy-load';

function createRef<T>(): RefObject<T>;
interface RefObject<T> {
  readonly current: T | null;
  readonly startUpload: any;
}
