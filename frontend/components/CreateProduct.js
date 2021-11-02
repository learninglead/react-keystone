import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';

import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

import Form from './styles/Form';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        price: $price
        description: $description
        name: $name
        photo: { create: { image: $image, altText: $name } }
        status: "AVAILABLE"
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: 'Hoodie',
    price: 12345,
    description: 'This is nice!!',
  });

  const [createProduct, { data, error, loading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await createProduct();
        clearForm();
        Router.push({
          pathname: `/product/${res.data.CreateProduct.id}`,
        });
      }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor='name'>
          Image
          <input
            type='file'
            name='image'
            id='image'
            onChange={handleChange}
            required
          />
        </label>
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
        <button type='submit'> Add Product</button>
      </fieldset>
    </Form>
  );
}
