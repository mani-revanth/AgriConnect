import React, { useEffect } from 'react'
import Profile from './Profile'
import Navbar from '../Navbar/Navbar'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';


export default function Dashboard(props) {
  const Navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', address: '', email: '', phone: '', bio: '', role: '' });
  const [progress, setProgress] = useState(0);

  useEffect(() => {

    if (localStorage.getItem('token') == null) {
      Navigate('/signin');

    }
    else {
      setShow(true);
      const getProfile = async () => {
        setProgress(30);
        const response = await fetch('http://localhost:5000/api/auth/getuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token')
          }
        })
        setProgress(50);
        const data = await response.json();
        setProgress(70);
        if (data.success === false) {
          alert(data.error);
          Navigate('/signin');
        }
        else {
         
          localStorage.setItem("userid", data._id);
          setProfileData({ name: data.name, address: data.address, email: data.email, phone: data.phone, bio: data.bio, role: data.role, fb: data.fb, insta: data.insta, whatsapp: data.whatsapp, telegram: data.telegram, gmail: data.gmail });
          setProgress(100);
        }

      }
      getProfile();
    }

  }, [])
  return (


    <div >

      {show && (
        <>
          <Navbar />
          <LoadingBar
            color='#00ff15'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
          />
          <div className="container " >

            <Profile data={profileData} setData={setProfileData} showEdit={true} />

          </div>
        </>)}

    </div>

  )
}
