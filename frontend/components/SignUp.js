import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

import Form from './styles/Form';

const SIGNUP_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup().catch(console.error);
    resetForm();
  };
  return (
    <Form method='POST' onSubmit={handleSubmit}>
      <h2>Sign Up For an Account</h2>
      {data?.createUser && (
        <p>
          Signed up with {data.createUser.email} Please go ahead and sign in.
        </p>
      )}
      <DisplayError error={error} />
      <fieldset disabled={loading}>
        <label htmlFor='name'>
          Your name
          <input
            type='text'
            id='name'
            name='name'
            placeholder='Enter your name'
            autoComplete='name'
            required
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
        <button type='submit'>Sign Up</button>
      </fieldset>
    </Form>
  );
}
