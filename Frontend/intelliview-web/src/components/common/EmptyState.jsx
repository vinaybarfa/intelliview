import React from 'react'

const EmptyState = ({title = "Nothing here yet", description = "New activity will appear here when it is available."}) => {
  return (
    <>
        <div className='empty-state'>
            <strong>
                {title}
            </strong>
            <p>{description}</p>
        </div>
    </>
  )

}

export default EmptyState
