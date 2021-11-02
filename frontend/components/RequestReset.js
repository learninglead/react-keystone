import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

import Form from './styles/Form';

const REQUEST_RESET_PASSWORD_MUTATION = gql`
  mutation REQUEST_RESET_PASSWORD_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [requestReset, { data, loading, error }] = useMutation(
    REQUEST_RESET_PASSWORD_MUTATION,
    {
      variables: inputs,
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestReset().catch(console.error);
    resetForm();
  };
  return (
    <Form method='POST' onSubmit={handleSubmit}>
      <h2>Request a Password Reset</h2>
      {data?.sendUserPasswordResetLink === null && (
        <p>Success! check your email for a link.</p>
      )}
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

        <button type='submit'>Request Reset</button>
      </fieldset>
    </Form>
  );
}
