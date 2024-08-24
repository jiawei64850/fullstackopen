interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseWithDesc extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartBaseWithDesc {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBaseWithDesc {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartBaseWithDesc {
  requirements: Array<string>;
  kind: "special"
}
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface HeaderProps {
  name: string;
}

interface ContentProps {
  courseParts: Array<CoursePart>;
}

interface PartProps {
  part: CoursePart;
}

interface TotalProps {
  totalExercises: number;
}

const Header = (props: HeaderProps) => {
  return <div><h1>{props.name}</h1></div>
}

const Part = (props: PartProps) => {
  const { part } = props
    
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br />
          <em>{part.description}</em>
        </p>
      );
    case "group":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br />
          project exercise {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br />
          <em>{part.description}</em><br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong><br />
          <em>{part.description}</em><br />
          required skills: {part.requirements.join(', ')}
        </p>
      )
    default: 
      return assertNever(part);
    }
  }


const Content = (props: ContentProps) => {
  return (
    <>
    {props.courseParts.map((part) => {
      return (
      <Part key={part.name} part={part} />
    )})}
    </>
  )
}

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercises}</p>
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};


const App = () => {
  const courseName = "Half Stack application development";
  
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    },
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;