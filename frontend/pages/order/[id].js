import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import Head from 'next/head';

import formatMoney from '../../lib/formatMoney';
import DisplayError from '../../components/ErrorMessage';

import OrderStyles from '../../components/styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id },
  });
  if (loading) return <p>loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>SICK FITS - ORDER</title>
      </Head>
      <p>
        <span>Order ID :</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge :</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Total Item:</span>
        <span>{order.items.length}</span>
      </p>
      <p>
        <span>Total Amount :</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <div className='items'>
        {order.items.map((item) => {
          return (
            <div className='order-item' key={item.id}>
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.title}
              />
              <div className='item-details'>
                <h2>{item.name}</h2>
                <p>Qty: {item.quantity}</p>
                <p>Each: {formatMoney(item.price)} </p>
                <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </OrderStyles>
  );
}
