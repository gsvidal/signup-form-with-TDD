import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  userEvent.type(passwordInputElement, 'password');
  expect(passwordInputElement.value).toBe('password');
});

test('should be able to type a password confirmation', () => {
  render(<App />);
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);
  userEvent.type(confirmPasswordInputElement, 'password');
  expect(confirmPasswordInputElement.value).toBe('password');
});

test('should show email error message on invalid email', () => {
  render(<App />);

  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  const submitButton = screen.getByRole('button', { name: /submit/i });
  const errorEmailMessageElement = screen.queryByText('Email input is invalid');

  expect(errorEmailMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalovidal.devgmail.com');
  userEvent.click(submitButton);
  const errorEmailMessageElementAfterClick = screen.getByText(
    'Email input is invalid'
  );
  expect(errorEmailMessageElementAfterClick).toBeInTheDocument();
});

test('should show password error message on invalid password length (less than 5 characters) only if there"s a valid email address', () => {
  render(<App />);
  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  const errorPasswordMessageElement = screen.queryByText(
    'The password you entered should contain 5 or more characters'
  );

  expect(errorPasswordMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalovidal@gmail.com');
  userEvent.type(passwordInputElement, '1234');
  userEvent.click(submitButton);

  const errorPasswordMessageElementAfterClick = screen.getByText(
    'The password you entered should contain 5 or more characters'
  );

  expect(errorPasswordMessageElementAfterClick).toBeInTheDocument();
});

test('should NOT show password error message after entering a valid password length (greater than or equal to 5 characters) and having a valid email address', () => {
  render(<App />);

  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  const errorPasswordMessageElement = screen.queryByText(
    'The password you entered should contain 5 or more characters'
  );

  expect(errorPasswordMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalovidal@gmail.com');
  userEvent.type(passwordInputElement, '12345');
  userEvent.click(submitButton);

  const errorPasswordMessageElementAfterClick = screen.queryByText(
    'The password you entered should contain 5 or more characters'
  );
  expect(errorPasswordMessageElementAfterClick).not.toBeInTheDocument();
});

test('password and confirmation password should be equal', () => {
  render(<App />);

  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: /submit/i });

  userEvent.type(passwordInputElement, '123456');
  userEvent.type(confirmPasswordInputElement, '123456');

  userEvent.click(submitButton);

  expect(passwordInputElement.value).toMatch(confirmPasswordInputElement.value);
});

test("should show a 'Password don't match' error message if both passwords are diferent", () => {
  render(<App />);

  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  const errorConfirmPasswordMessageElement = screen.queryByText(
    "Password don't match"
  );
  expect(errorConfirmPasswordMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalo.v@hotmail.com');
  userEvent.type(passwordInputElement, '123456');
  userEvent.type(confirmPasswordInputElement, '123457');

  userEvent.click(submitButton);

  const errorConfirmPasswordMessageElementAfterClick = screen.queryByText(
    "Password don't match"
  );
  expect(errorConfirmPasswordMessageElementAfterClick).toBeInTheDocument();
});

test(" the 'Password don't' match error message should disappear if both passwords are now equal after being diferent", async () => {
  render(<App />);

  const emailInputElement = screen.getByRole('textbox', {
    name: /Email address/i,
  });
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  const errorConfirmPasswordMessageElement = screen.queryByText(
    "Password don't match"
  );
  console.log(errorConfirmPasswordMessageElement);
  expect(errorConfirmPasswordMessageElement).not.toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalo@hotmail.com');
  userEvent.type(passwordInputElement, '123456');
  userEvent.type(confirmPasswordInputElement, '1234567');

  userEvent.click(submitButton);

  const errorConfirmPasswordMessageElementAfterClick = screen.getByText(
    "Password don't match"
  );

  expect(errorConfirmPasswordMessageElementAfterClick).toBeInTheDocument();

  userEvent.type(emailInputElement, 'gonzalo@hotmail.com');
  userEvent.type(passwordInputElement, '123456');
  userEvent.type(confirmPasswordInputElement, '123456');
  userEvent.click(submitButton);

  const errorConfirmPasswordMessageElementAfter2ndClick = screen.queryByText(
    "Password don't match"
  );

  expect(
    errorConfirmPasswordMessageElementAfter2ndClick
  ).not.toBeInTheDocument();
});
