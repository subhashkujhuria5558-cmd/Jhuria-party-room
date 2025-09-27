import React from 'react';

const BACKEND = process.env.REACT_APP_BACKEND || 'http://localhost:5000';

export default function Landing(){
  const handleSignIn = () => {
    // navigate to backend oauth start
    window.location.href = `${BACKEND}/auth/google`;
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{fontSize:48}}>🎉</div>
        <h1>Jhuria Party Room</h1>
        <p>Professional Voice Chat & Gaming Platform</p>

        <button onClick={handleSignIn} style={styles.googleBtn}>
          <img src="https://www.gstatic.com/images/branding/product/1x/googlelogo_light_color_18dp.png" alt="g" style={{width:18, marginRight:8}}/>
          Sign in with Google
        </button>

        <button style={styles.loginBtn} onClick={()=> alert('Use Google sign in')}>
          Login with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(180deg,#7b5cff,#9a6bff)'},
  card: { width: '90%', maxWidth: 420, padding:24, borderRadius:18, background:'rgba(255,255,255,0.08)', color:'white', textAlign:'center' },
  googleBtn: { marginTop:20, padding:'12px 16px', borderRadius:8, border:'none', background:'white', color:'#000', display:'flex', alignItems:'center', justifyContent:'center' },
  loginBtn: { marginTop:12, padding:'12px 16px', borderRadius:8, border:'none', background:'white', color:'#000' }
};
