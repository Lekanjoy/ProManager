import React from 'react'
import ToDo from './ToDo'
import InProgress from './InProgress'
import Completed from './Completed'

const ProjectContainer = () => {
  return (
    <section className='w-full grid grid-cols-3 gap-x-4'>
        <ToDo/>
        <InProgress/>
        <Completed/>
    </section>
  )
}

export default ProjectContainer