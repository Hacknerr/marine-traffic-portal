import React, { useEffect, forwardRef } from 'react';
import { Marker } from 'react-leaflet';

const RotatingMarker = forwardRef((props, ref) => {
  useEffect(() => {
    if (ref.current) {
      const marker = ref.current;
      const icon = marker.getElement();
      icon.style.transform = icon.style.transform.replace(/rotate\([0-9.]*deg\)/, '') + ` rotate(${props.angle}deg)`;
    }
  }, [props.angle, ref]);

  return <Marker {...props} ref={ref} />;
});

export default RotatingMarker;
