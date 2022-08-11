import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { click } from '@testing-library/user-event/dist/click';
import App from './App';

test('inputs should be initially empty', () => {
  render(<App />);
  const emailInputElement = screen.getByRole('textbox');
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  expect(emailInputElement.value).toBe('');
  expect(passwordInputElement.value).toBe('');
  expect(confirmPasswordInputElement.value).toBe('');
});

test('should be able to type an email', () => {
  render(<App />);
  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  userEvent.type(emailInputElement, 'gonzalovidal.dev@gmail.com');
  expect(emailInputElement.value).toBe('gonzalovidal.dev@gmail.com');
});

test('should be able to type a password', () => {
  render(<App />);
  const passwordInputElement = screen.getByLabelText('Password');
  userEvent.type(passwordInputElement, 'pass');
  expect(passwordInputElement.value).toBe('pass');
});

test('should be able to type a password confirmation', () => {
  render(<App />);
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  userEvent.type(confirmPasswordInputElement, 'pass');
  expect(confirmPasswordInputElement.value).toBe('pass');
});

test('should show email error message on invalid email', () => {
  render(<App />);
  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  const submitButton = screen.getByRole('button', { name: /submit/i });
  const errorEmailMessage = screen.getByText('Email input is invalid');
  expect(errorEmailMessage).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalovidal.devgmail.com');
  userEvent.click(submitButton);
  expect(errorEmailMessage).toBeInTheDocument();
});
