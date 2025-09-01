
// types.d.ts
import * as framerMotion from 'framer-motion';

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> extends framerMotion.HTMLMotionProps<T> {
    className?: string;
  }
}