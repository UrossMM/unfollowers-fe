import  React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from './config';
import * as Loader from "react-loader-spinner";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState();
    const [adminEmail, setAdminEmail] = useState();
    const [adminPassword, setAdminPassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleChangeEmail = value => {
        setAdminEmail(value);
    }
    const handleChangePassword = value => {
       setAdminPassword(value);
    }


  const navigate = useNavigate();
  const goToSignUp = async () => {
    const adminInputDataDto = {
        email: adminEmail,
        password: adminPassword
    }
    try{
    setLoading(true);
    await axios.get(`https://${URL}/api/login?` + 
    'username=' +
    adminInputDataDto.email +
    '&password=' +
    adminInputDataDto.password)
    .then((x) => {
        localStorage.setItem('username', adminInputDataDto.email);
        navigate("./statistic");
      })
      .catch((error) => {
        setErrorMessage('Pogresni podaci. Pokusajte ponovo.')
      });
    }
    catch(error){
        console.error(error);
    }
    finally{
        setLoading(false);
      }
  };

  return (
    <div className="adminLogin">
            <div className="card-container">
                    <div className="imageAdminLogin"><img id="profile-img" className="profile-img-card" src="https://www.edigitalagency.com.au/wp-content/uploads/new-Instagram-logo-png-full-colour-glyph.png" alt='slika' /></div>
                    <p id="profile-name" className="profile-name-card"></p>
                    {/* <form className="form-signin" onSubmit={this.naKlik.bind(this)}> */}
                    {/* <form className="form-signin"> */}
                        {/* <span id="reauth-email" className="reauth-email"></span> */}
                        <input className="emailAdminLogin" /*type="email"*/ name="username" id="inputEmail" placeholder="Username" required autoFocus 
                         value={adminEmail}
                         onChange={e => handleChangeEmail(e.target.value)}
                        />
                        <input className="passwordAdminLogin" type="password" name="password" id="inputPassword" placeholder="Password" required 
                         value={adminPassword}
                         onChange={e => handleChangePassword(e.target.value)}
                        />
                        <div style={{textAlign:"center"}}>
                        <label style={{color:"red"}}>{errorMessage}</label>
                        </div>
                        {loading && (
                            <div className="loader-container">
                                <Loader.TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
                            </div>
                        )}
                        <button  className="buttonAdminLogin" type="submit" onClick={goToSignUp}>Login</button>
                    {/* </form> */}
                </div>
    </div>
  );
};

export default Login;