import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      price
      description
      photo {
        id
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $price: Int
    $description: String!
    $name: String!
  ) {
    updateProduct(
      id: $id
      data: { name: $name, price: $price, description: $description }
    ) {
      id
      name
      price
      description
    }
  }
`;

export default function UpdateProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  const [
    UpdateProduct,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);

  if (loading) return <p>Loading...</p>;

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await UpdateProduct({
          variables: {
            id,
            name: inputs.name,
            price: inputs.price,
            description: inputs.description,
          },
        }).catch(console.error);
        console.log(res.data);
        // clearForm();
        // Router.push({
        //   pathname: `/product/${res.data.CreateProduct.id}`,
        // });
      }}
    >
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        {/* <label htmlFor='name'>
          Image
          <input
            type='file'
            name='image'
            id='image'
            onChange={handleChange}
            required
          />
        </label> */}
        <label htmlFor='name'>
          Enter Name
          <input
            type='text'
            name='name'
            id='name'
            placeholder='Name'
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor='price'>
          Enter price
          <input
            type='number'
            name='price'
            id='price'
            placeholder='price'
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor='description'>
          Enter description
          <textarea
            type='number'
            name='description'
            id='description'
            placeholder='Description'
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type='submit'> Update Product</button>
      </fieldset>
    </Form>
  );
}
