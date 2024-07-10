import Course from './Course'

const Courses = ({courses}) => {
    return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map((course, index) => 
      <Course 
        key={index} course={course}  
      />
      )}
    </>
    )
  }

export default Courses