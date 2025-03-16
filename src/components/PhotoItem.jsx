import React from 'react'

function PhotoItem({ src, alt }) {
  return (
    <figure className="overflow-hidden rounded-xl aspect-square">
        <img src={src} alt={alt} className="object-cover size-full" />
    </figure>
  )
}

export default PhotoItem;
