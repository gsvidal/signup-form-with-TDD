import { useState } from 'react';
import './App.css';
import validator from 'validator';

function App() {
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState({
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputValue.email);
    if (validator.isEmail(inputValue.email)) {
      setError({
        ...error,
        email: false,
      });
      return;
    }
    setError({
      ...error,
      email: true,
    });
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
            onChange={handleChange}
            value={inputValue.email}
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            className="form-control"
          />
        </div>
        {error.email && <p className="text-danger">Email input is invalid</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
