import { useRef, useState, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

// Default CSS styles
const defaultStyles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-family: 'Nunito', sans-serif;
    font-size: 22px;
    color: #fff;
}

body {
    min-height: 100vh;
    background-color: dodgerblue;
}

.App {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  padding: 1rem 0.5rem;
}

section {
    width: 100%;
    max-width: 420px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
    background-color: rgba(0,0,0,0.4);
}

form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-grow: 1;
    padding-bottom: 1rem;
}

a, a:visited {
    color: #fff;
}

input[type="text"],
input[type="password"],
button,
textarea {
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

label,
button {
  margin-top: 1rem;
}

button {
  padding: 0.5rem;
}

.instructions {
    font-size: 0.75rem;
    border-radius: 0.5rem;
    background: #000;
    color: #fff;
    padding: 0.25rem;
    position: relative;
    bottom: -10px;
}

.instructions > svg {
    margin-right: 0.25rem;
}

.offscreen {
    position: absolute;
    left: -9999px;
}

.hide {
    display: none;
}

.valid {
    color: limegreen;
    margin-left: 0.25rem;
}

.invalid {
    color: red;
    margin-left: 0.25rem;
}

.errmsg {
    background-color: lightpink;
    color: firebrick;
    font-weight: bold;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
}

.line {
    display: inline-block;
}

.flexGrow {
    flex-grow: 1;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
}
`;

// Apply default styles
const styleTag = document.createElement('style');
styleTag.innerHTML = defaultStyles;
document.head.appendChild(styleTag);

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validPwd || !validMatch) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      setSuccess(true);
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  const isButtonDisabled = !validName || !validPwd || !validMatch;

  return (
    <>
      {success ? (
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">Success!</h1>
          <p>
            <a href="#" className="text-blue-500">
              Sign In
            </a>
          </p>
        </section>
      ) : (
        <section className=" mx-auto mt-10 p-4 bg-opacity-40 bg-black text-white">
          <p
            ref={errRef}
            className={`${
              errMsg
                ? 'bg-lightpink text-firebrick font-bold p-2 mb-2'
                : 'hidden'
            }`}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="text-4xl font-bold mb-4">Register</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between flex-grow pb-4"
          >
            <label
              htmlFor="username"
              className="mb-2 relative flex items-center"
            >
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={`${validName ? 'valid' : 'hidden'} ml-1`}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={`${
                  validName || !user ? 'hidden' : 'text-red ml-1'
                }`}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              className={`${
                validName ? 'border-limegreen' : 'border-white'
              } text-black border-b-2 py-1 outline-none`}
              aria-invalid={validName ? 'false' : 'true'}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={`${
                userFocus && user && !validName
                  ? 'text-sm text-white mt-1'
                  : 'hidden'
              }`}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? 'valid' : 'hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? 'hide' : 'invalid'}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              className="text-black"
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{' '}
              <span aria-label="exclamation mark">!</span>{' '}
              <span aria-label="at symbol">@</span>{' '}
              <span aria-label="hashtag">#</span>{' '}
              <span aria-label="dollar sign">$</span>{' '}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? 'valid' : 'hide'}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? 'hide' : 'invalid'}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              className="text-black"
              aria-invalid={validMatch ? 'false' : 'true'}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? 'instructions' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={isButtonDisabled}
              className={`text-white bg-blue-500 py-2 px-4 rounded-md mt-4 ${
                isButtonDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              Sign Up
            </button>
          </form>
          <p className="text-white">
            Already registered?
            <br />
            <span className="line">
              <Link to="/" className="text-blue-500">
                Sign In
              </Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
