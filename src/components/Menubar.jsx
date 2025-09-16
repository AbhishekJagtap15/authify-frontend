import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, use, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const MenuBar = () => {
    const navigate = useNavigate();
    const {userData,backendURL,setUserData, SetIslLoggedIn}=useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response= await axios.post(backendURL+'/logout');
            if(response.status===200){
                SetIslLoggedIn(false);
                setUserData(false);
                navigate('/login');
            }
        } catch (err) {
            console.error(err.response.data.message);
        }
    }

    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(backendURL + '/send-otp');
            if (response.status === 200) {
                navigate('/email-verify');
                toast.success("Verification OTP sent to your email.");
            } else {
                toast.error("Could not send OTP. Please try again later.");
            }
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }

    
    
    return (
        <nav className="navbar bg-white px-5 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
                <img src={assets.logo} alt="logo" width={32} height={32} />
                <span className="fw-bold fs-4 text-dark">Authify</span>
            </div>

            {userData ? (
                <div className='position-relative' ref={dropdownRef}>
                    <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center" style={{width: '40px', height: '40px', cursor: 'pointer', userSelect: 'none'}} onClick={() => setDropdownOpen(prev => !prev)}>
                        {userData.name.charAt(0).toUpperCase()}
                    </div>
                    {dropdownOpen && (
                        <div className="position-absolute bg-white shadow rounded p-2" style={{top: '50px', right: '0', zIndex: 100}}>
                          {userData.isAccountVerified && (
                            <div className="dropdown-item py-1 px-2" style={{cursor: 'pointer'}} onClick={sendVerificationOtp}>
                                Verify Email
                            </div>
                            )}  
                            <div className="drop-down-item py-1 px-2 text-danger" style={{cursor: 'pointer'}}
                             onClick={handleLogout}> 
                                Logout
                            </div>
                        </div>
                    )}
                </div>

            ) : (
                <div className="btn btn-outline-dark rounded-pill px-3" onClick={() => navigate('/login')}>
                Login <i className="bi bi-arrow-right ms-2"></i>
                </div>
            )}

            
        </nav>
    )
}
export default MenuBar;