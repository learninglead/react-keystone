import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

import Form from './styles/Form';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          name
          email
        }
      }

      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const error =
    data?.authenticateUserWithPassword?.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signin();
    resetForm();
  };
  return (
    <Form method='POST' onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <DisplayError error={error} />
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
        <button type='submit'>Sign In</button>
      </fieldset>
    </Form>
  );
}
