import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading(){
  const nav = useNavigate();
  useEffect(()=> {
    const t = setTimeout(()=> nav('/landing'), 1000); // 1s
    return ()=> clearTimeout(t);
  }, [nav]);
  return (
    <div style={styles.container}>
      <h1>Jhuria Party Room</h1>
      <p>Loading amazing features...</p>
      <div style={{fontSize:48}}>◐</div>
    </div>
  );
}

const styles = {
  container: { height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background: 'linear-gradient(180deg,#7b5cff,#9a6bff)', color:'white' }
};
