import ToDo from './ToDo'
import InProgress from './InProgress'
import Completed from './Completed'

const ProjectContainer = () => {
  return (
    <section className='w-full grid grid-cols-1 gap-y-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-4'>
        <ToDo/>
        <InProgress/>
        <Completed/>
    </section>
  )
}

export default ProjectContainer