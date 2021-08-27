import React, { useEffect, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useMutation,
  useQuery,
} from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import { GET_USERS } from './queries/user';
import { CREATE_USER, DELETE_USER, EDIT_USER } from './mutations/user';

const restLink = new RestLink({ uri: 'http://localhost:8081/api/' });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const App = () => {
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    pollInterval: 500,
  });
  const [newUser] = useMutation(CREATE_USER);
  const [editUser] = useMutation(EDIT_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState();
  const [changeName, setChangeName] = useState('');

  useEffect(() => {
    if (!loading) {
      setUsers(data.users);
    }
  }, [data]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error: {error}</h1>;
  }

  const addUser = (e) => {
    e.preventDefault();
    newUser({
      variables: {
        input: { name },
      },
    }).then(({ data }) => {
      console.log(data);
      setName('');
    });
  };

  const getUsers = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleCancel = () => {
    setId();
    setChangeName('');
  };

  const handleEditUser = (user) => {
    setId(user._id);
    setChangeName(user.name);
  };

  const handleSaveChanges = () => {
    editUser({
      variables: {
        input: { id: id, name: changeName },
      },
    }).then(({ data }) => {
      console.log(data);
      handleCancel();
    });
  };

  const handleDeleteUser = (user) => {
    deleteUser({
      variables: {
        id: user._id,
      },
    });
  };

  return (
    <div>
      <form>
        <input onChange={(e) => setName(e.target.value)} value={name} />
        <button onClick={(e) => addUser(e)}>Create</button>
        <button onClick={(e) => getUsers(e)}>Get List</button>
      </form>

      <div>
        {users.map((user) => (
          <div key={user._id} className="user">
            {id === user._id ? (
              <input
                onChange={(e) => setChangeName(e.target.value)}
                value={changeName}
              />
            ) : (
              <span>Name: {user.name}</span>
            )}
            <div>
              {id === user._id ? (
                <button onClick={() => handleCancel()} className="btn-cancel">
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => handleEditUser(user)}
                  className="btn-edit"
                >
                  Edit
                </button>
              )}
              {id === user._id ? (
                <button
                  onClick={() => handleSaveChanges(user)}
                  className="btn-save"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="btn-delete"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default ApolloApp;
