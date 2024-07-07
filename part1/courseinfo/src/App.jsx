const Header = ({course}) => {
  return <div><h1>{course.name}</h1></div>
}

const Parts = ({course}) => {
  return (
  <div>
    <Part name={course.parts[0].name} exercises={course.parts[0].exercises} />
    <Part name={course.parts[1].name} exercises={course.parts[1].exercises} />
    <Part name={course.parts[2].name} exercises={course.parts[2].exercises} />
  </div>
  )
}

const Part = ({name, exercises}) => <div><p>{name} {exercises}</p></div>

const Total = ({a,b,c}) => <div><p>Number of exercises {a + b + c}</p></div>

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Parts course={course} />
      <Total a={course.parts[0].exercises} b={course.parts[1].exercises} c={course.parts[2].exercises} />

    </div>
  )
}

export default App