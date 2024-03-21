'use client';
import * as React from 'react';

import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

// This function returns a new component that fetches data from the API and passes it to the wrapped component
export const withParent = <
  Parent extends Record<string, any> = {},
  P extends Record<string, any> = {},
>(
  WrappedComponent: React.ComponentType<P>,
  opts: {
    mountCallback?: () => void;
    unmountCallback?: React.EffectCallback;
    Parent?: React.ComponentType<Parent>;
    parentProps?: Parent;
    deps?: React.DependencyList;
  },
) => {
  // Return a new component

  return (props: P) => {
    const { Parent, parentProps, mountCallback, unmountCallback, deps = [] } = opts;

    useEnhancedEffect(() => {
      if (mountCallback) {
        mountCallback();
      }
      if (unmountCallback) {
        return unmountCallback();
      }
    }, deps); // Empty dependency array to ensure the effect runs only once on mount

    if (Parent) {
      return (
        <Parent {...(parentProps as Parent)}>
          <WrappedComponent {...(props as P)} />
        </Parent>
      );
    }

    // Render the wrapped component with the fetched data as a prop
    return <WrappedComponent {...(props as P)} />;
  };
};
