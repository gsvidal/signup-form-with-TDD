import { useState } from 'react';
import './App.css';
import validator from 'validator';

function App() {
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validator.isEmail(inputValue.email)) {
      setError('Email input is invalid');
    } else if (inputValue.password.length < 5) {
      setError('The password you entered should contain 5 or more characters');
    } else if (inputValue.password !== inputValue.passwordConfirmation) {
      setError("Password don't match");
    } else {
      setError('');
    }
  };

  const handleChange = (event) => {
    setInputValue({
      ...inputValue,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="form-control"
            value={inputValue.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            value={inputValue.password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="passwordConfirmation"
            id="confirm-password"
            className="form-control"
            value={inputValue.passwordConfirmation}
            onChange={handleChange}
          />
        </div>
        {error !== '' && <p className="text-danger">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
