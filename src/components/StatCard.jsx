import React from 'react'

export default function StatCard({title, description}) {
  return (
    <div className="px-10 py-5 text-center bg-orange-100 rounded-xl max-md:w-full max-sm:p-4">
        <h2 className="mb-1.5 text-2xl font-semibold">{title}</h2>
        <p className="text-stone-500">{description}</p>
    </div>
  )
}
