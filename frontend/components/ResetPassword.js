import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

import Form from './styles/Form';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function ResetPassword({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [
    resetPassword,
    { data, loading, error: validationError },
  ] = useMutation(RESET_PASSWORD_MUTATION, {
    variables: inputs,
  });

  const error = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword().catch(console.error);
    resetForm();
  };
  return (
    <Form method='POST' onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      {data?.redeemUserPasswordResetToken === null && (
        <p>Success! You can now sign in.</p>
      )}
      <DisplayError error={validationError || error} />
      <fieldset disabled={loading}>
        <label htmlFor='email'>
          Email
          <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email'
            autoComplete='email'
            required
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            type='password'
            id='password'
            name='password'
            placeholder='*********'
            required
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type='submit'>Reset Password</button>
      </fieldset>
    </Form>
  );
}
