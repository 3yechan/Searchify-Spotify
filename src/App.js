// IMPORTS - - - - - - - - - - - - - - 
import React from 'react';
import { Provider, History, Trigger } from 'react-history-search';
import 'react-history-search/dist/index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';


//Constants required for Spotify API to function: These are most referenced in the URL's
const CLIENT_ID='08e24c9731f84df9834d076afbad160f';
const CLIENT_SECRET='c1ef5160e2314c219a1fc8e5c5c79e08';
const REDIRECT_URI = 'http://localhost:3000'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const RESPONSE_TYPE = 'token'

// This is our authentication


function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, 'users');
  const createUser = async () => {
    await addDoc(usersCollectionRef, {name: newUsername, age: newPassword })

  };


  useEffect(() => {
    // API call to Firebase:
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id })));      
    }
    getUsers();
    //API Access Token: In order to get this access token, you need to make a specific request to the Spotify API to return a token for the Client to use
    var authParameters = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
        'Content-type': 'Application/x-www-form-urlencoded'  
      },
      body: 'grant_type=client_credentials'
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, []);
  
  // Search
  async function search() {
    console.log('Search for ' + searchInput); //Taylor Swift

    //Get request using search to get the Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })

      console.log('Artist ID is ' + artistID);

    //GET REQUEST WITH ARTIST ID TO GRAB ALL THE ALBUMS FROM THAT ARTIST
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      });
    // DISPLAY THOSE ALBUMS TO THE USER
  }
  return (
    <div className='App'>
      <input 
        placeholder='Username...' 
        onChange={(event) => {
          setNewUsername(event.target.value);
        }}
      />
      <input 
        placeholder='Password...'
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}/>
      <button class='button' onClick={createUser}>Enter User Information</button>
             <br></br>
             <a class='login to spotify' href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
      {users.map((user) => { 
        return (
        <div>
          {" "} 
          <h1>Search-ify Spotify!</h1>
        </div>
        );
      })}
      
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl 
            placeholder='Search For Artist'  
            type='input' 
            onKeyPress={event => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button type='button' class='btn btn-success' onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row row-cols-5'>
          {albums.map( (album, i) =>{
            console.log(album);
            return (
              <Card key={i}>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}

        </Row>
      </Container>
      
    </div>
  );
}

export default App;
