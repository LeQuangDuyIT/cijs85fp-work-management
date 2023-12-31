import { Link, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import signupStyles from '../Login/Login.module.scss';
import { useAuth } from '../../../contexts/AuthContext';
import { useRef, useState } from 'react';
import SidebarLayout from '../../../layouts/SidebarLayout/SidebarLayout';
import { eyeIcon, closedEyeIcon, arrowRightIcon } from '../../../utils/icons';
import loginStyles from '../Login/Login.module.scss';
import Button from '../../../components/Button';

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { signup, currentUser, signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    let regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    if (!regex.test(passwordRef.current.value)) {
      return setError('Your password is not strong enough; please use a stronger password');
    }
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate(`/u/home`);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const googleSignUpHandler = async e => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate(`/u/home`);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };
  const hasCurrentUser = !!currentUser;
  return (
    <>
      {hasCurrentUser ? (
        <SidebarLayout>
          <div className={signupStyles.wrapper}>
            <div className={signupStyles.logoTxt}>
              <h2>Error: Please log out first</h2>
            </div>
          </div>
        </SidebarLayout>
      ) : (
        <div className={signupStyles.wrapper}>
          <Button to={'/'} rigthIcon={arrowRightIcon} className={loginStyles.linkToLadingPage}>
            Learn more about us
          </Button>
          <div className={signupStyles.logo}>
            <img src="/assets/logo.png" width="auto" height="80" alt="logo" />
          </div>
          <div className={signupStyles.container}>
            <div className={signupStyles.logoTxt}>
              <h2>SIGN UP</h2>
            </div>
            <form className={signupStyles.myform} onSubmit={handleSubmit}>
              <div className="mb-3 form-section">
                <label className={signupStyles.formLabel}>Email address</label>
                <div className={signupStyles.fieldControl}>
                  <input
                    type="email"
                    className={signupStyles.formInput}
                    id="user-email"
                    aria-describedby="emailHelp"
                    placeholder="Enter your email here"
                    ref={emailRef}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 form-section">
                <label className={signupStyles.formLabel}>Password</label>
                <div className={signupStyles.fieldControl}>
                  <input
                    type={hidePassword ? 'password' : 'text'}
                    className={signupStyles.formInput}
                    id="password"
                    placeholder="Enter your password here"
                    ref={passwordRef}
                    required
                  />
                  <span
                    className={signupStyles.viewpwIcon}
                    onClick={() => setHidePassword(!hidePassword)}
                  >
                    {hidePassword ? eyeIcon : closedEyeIcon}
                  </span>
                </div>
              </div>
              <div className="mb-3 form-section">
                <label className={signupStyles.formLabel}>Password</label>
                <div className={signupStyles.fieldControl}>
                  <input
                    type={hidePassword ? 'password' : 'text'}
                    className={signupStyles.formInput}
                    id="password"
                    placeholder="Enter your password here"
                    ref={confirmPasswordRef}
                    required
                  />
                  <span
                    className={signupStyles.viewpwIcon}
                    onClick={() => setHidePassword(!hidePassword)}
                  >
                    {hidePassword ? eyeIcon : closedEyeIcon}
                  </span>
                </div>
              </div>
              <div className={signupStyles.info}>
                <div className={signupStyles.error}>{error}</div>
                <div className={signupStyles.infoText + ' info-text'}>
                  <Link to="/login" element={<Login />}>
                    Already have an account? <span className={loginStyles.nav}>Log in here</span>
                  </Link>
                </div>
                <button disabled={loading} type="submit" className={signupStyles.btn}>
                  Sign up
                </button>
                <div className={signupStyles.orText}>
                  <span>OR</span>
                </div>
                <div className={signupStyles.socialMedia}>
                  <button
                    disabled={loading}
                    type="button"
                    className={signupStyles.btn}
                    onClick={googleSignUpHandler}
                  >
                    <img src="/assets/google-logo.webp" alt="" width="32px" height="auto" />
                    <span>Continue with Google</span>
                  </button>
                  <button disabled={loading} type="button" className={signupStyles.btn}>
                    <img src="/assets/facebook-logo.webp" alt="" width="32px" height="auto" />
                    <span>Continue with Facebook</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default Signup;
