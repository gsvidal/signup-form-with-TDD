import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  render(<App />);
});

const clickSubmitButton = () => {
  const submitButton = screen.getByRole('button', { name: /submit/i });
  userEvent.click(submitButton);
  return submitButton;
};

const typeIntoInput = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole('textbox');
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  if (email) userEvent.type(emailInputElement, email);
  if (password) userEvent.type(passwordInputElement, password);
  if (confirmPassword)
    userEvent.type(confirmPasswordInputElement, confirmPassword);

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

test('inputs should be initially empty', () => {
  const emailInputElement = screen.getByRole('textbox');
  const passwordInputElement = screen.getByLabelText('Password');
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  expect(emailInputElement.value).toBe('');
  expect(passwordInputElement.value).toBe('');
  expect(confirmPasswordInputElement.value).toBe('');
});

test('should be able to type an email', () => {
  const { emailInputElement } = typeIntoInput({
    email: 'gonzalovidal.dev@gmail.com',
  });
  expect(emailInputElement.value).toBe('gonzalovidal.dev@gmail.com');
});

test('should be able to type a password', () => {
  const { passwordInputElement } = typeIntoInput({
    password: 'password',
  });
  expect(passwordInputElement.value).toBe('password');
});

test('should be able to type a password confirmation', () => {
  const { confirmPasswordInputElement } = typeIntoInput({
    confirmPassword: 'password',
  });
  expect(confirmPasswordInputElement.value).toBe('password');
});

test('should show email error message on invalid email', () => {
  const errorEmailMessageElement = screen.queryByText('Email input is invalid');

  expect(errorEmailMessageElement).not.toBeInTheDocument();

  typeIntoInput({ email: 'gonzalovidal.devgmail.com' });
  clickSubmitButton();

  const errorEmailMessageElementAfterClick = screen.getByText(
    'Email input is invalid'
  );
  expect(errorEmailMessageElementAfterClick).toBeInTheDocument();
});

test('should show password error message on invalid password length (less than 5 characters) only if there"s a valid email address', () => {
  const errorPasswordMessageElement = screen.queryByText(
    'The password you entered should contain 5 or more characters'
  );

  expect(errorPasswordMessageElement).not.toBeInTheDocument();

  typeIntoInput({ email: 'gonzalovidal.dev@gmail.com', password: '1234' });

  clickSubmitButton();
  const errorPasswordMessageElementAfterClick = screen.getByText(
    'The password you entered should contain 5 or more characters'
  );

  expect(errorPasswordMessageElementAfterClick).toBeInTheDocument();
});

test('should NOT show password error message after entering a valid password length (greater than or equal to 5 characters) and having a valid email address', () => {
  const errorPasswordMessageElement = screen.queryByText(
    'The password you entered should contain 5 or more characters'
  );

  expect(errorPasswordMessageElement).not.toBeInTheDocument();

  typeIntoInput({ email: 'gonzalovidal.dev@gmail.com', password: '12345' });
  clickSubmitButton();

  const errorPasswordMessageElementAfterClick = screen.queryByText(
    'The password you entered should contain 5 or more characters'
  );
  expect(errorPasswordMessageElementAfterClick).not.toBeInTheDocument();
});

test('password and confirmation password should be equal', () => {
  const { passwordInputElement, confirmPasswordInputElement } = typeIntoInput({
    email: 'gonzalovidal.dev@gmail.com',
    password: '123456',
  });
  clickSubmitButton();

  expect(passwordInputElement.value).toMatch(confirmPasswordInputElement.value);
});

test("should show a 'Password don't match' error message if both passwords are diferent", () => {
  const errorConfirmPasswordMessageElement = screen.queryByText(
    "Password don't match"
  );
  expect(errorConfirmPasswordMessageElement).not.toBeInTheDocument();

  typeIntoInput({
    email: 'gonzalo.v@hotmail.com',
    password: '123456',
    confirmPassword: '1234567',
  });

  clickSubmitButton();

  const errorConfirmPasswordMessageElementAfterClick = screen.queryByText(
    "Password don't match"
  );
  expect(errorConfirmPasswordMessageElementAfterClick).toBeInTheDocument();
});

test(" the 'Password don't' match error message should disappear if both passwords are now equal after being diferent", async () => {
  clickSubmitButton();
  const errorConfirmPasswordMessageElement = screen.queryByText(
    "Password don't match"
  );

  expect(errorConfirmPasswordMessageElement).not.toBeInTheDocument();

  typeIntoInput({
    email: 'gonzalo@hotmail.com',
    password: '123456',
    confirmPassword: '1234567',
  });

  clickSubmitButton();

  const errorConfirmPasswordMessageElementAfterClick = screen.getByText(
    "Password don't match"
  );

  expect(errorConfirmPasswordMessageElementAfterClick).toBeInTheDocument();

  typeIntoInput({
    email: 'gonzalo@hotmail.com',
    password: '123456',
    confirmPassword: '123456',
  });

  const submitButton = clickSubmitButton();
  userEvent.click(submitButton);

  const errorConfirmPasswordMessageElementAfter2ndClick = screen.queryByText(
    "Password don't match"
  );

  expect(
    errorConfirmPasswordMessageElementAfter2ndClick
  ).not.toBeInTheDocument();
});
