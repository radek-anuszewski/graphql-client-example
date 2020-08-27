import React, {useState} from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";

const AnimalData = ({name}) => {
  const {data} = useQuery(gql`
      query ($name: String!){
          animal(name: $name) {
              name
              birthPlace
          }
      }
  `, {
    variables: {
      name,
    }
  })

  if (!data) {
    return null;
  }

  return (
    <p>
      Name: {data.animal.name}
      <br />
      Birth place: {data.animal.birthPlace}
    </p>
  )
}

const Animal = ({name}) => {
  const [clicked, setClicked] = useState(false)

  if (!clicked) {
    return (
      <p>
        <button onClick={() => setClicked(true)}>
          {name}
        </button>
      </p>
    )
  }

  return <AnimalData name={name} />
}

const Animals = () => {
  const {data} = useQuery(gql`
      query {
          animals {
              name
          }
      }
  `);

  return (
    <p>
      Animals:
      {data?.animals.map(({name}) => (
        <Animal name={name} />
      ))}
    </p>
  )
}

const Owners = () => {
  const {data, refetch} = useQuery(gql`
      query {
          owners {
              name
          }
      }
  `);

  const [createOwner] = useMutation(gql`
    mutation ($name: String!){
      createOwner(owner: {name: $name}) {
        id,
        name,
      }
    }
  `, {onCompleted: refetch});

  const [name, setName] = useState('')

  const onSubmit = e => {
    e.preventDefault()
    createOwner({
      variables: {
        name,
      }
    })
    setName('')
  }

  return (
    <p>
      Owners:
      <div>
        {data?.owners.map(el => el.name).join(', ')}
      </div>
      <form onSubmit={onSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </p>
  )
}

const App = () => {
  return (
    <div>
      <Animals />
      <Owners />
    </div>
  );
}

export default App;
