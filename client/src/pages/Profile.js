import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile(){
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  useEffect(()=>{
    const tokenFromQ = searchParams.get('token');
    const token = tokenFromQ || localStorage.getItem('token');
    if (tokenFromQ) localStorage.setItem('token', tokenFromQ);

    if (!token) {
      nav('/');
      return;
    }

    axios.get('/api/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data.user))
      .catch(err => {
        console.error(err);
        nav('/');
      });
  }, [nav, searchParams]);

  if (!user) return <div style={{padding:20}}>Loading profile...</div>;

  return (
    <div style={{padding:20}}>
      <h2>Welcome, {user.displayName}</h2>
      <img src={user.photo} alt="avatar" style={{width:100, borderRadius:50}} />
      <p>Email: {user.email}</p>
      <p>Coins: {user.coins}</p>
      <p>Wallet balance: {user.wallet?.balance ?? 0}</p>
    </div>
  );
}
