import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import Head from 'next/head';

import formatMoney from '../lib/formatMoney';
import DisplayError from '../components/ErrorMessage';

import OrderItemStyles from '../components/styles/OrderItemStyles';
import styled from 'styled-components';

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
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

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <p>loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;

  function countItemsInOrder(order) {
    return order.items.reduce((tally, item) => tally + item.quantity, 0);
  }

  return (
    <div>
      <Head>
        <title>SICK FITS - ORDERS</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map((order) => {
          return (
            <OrderItemStyles key={order.id}>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className='order-meta'>
                    <p>{countItemsInOrder(order)} Items</p>
                    <p>
                      {order.items.length} Product
                      {order.items.length > 1 ? 's' : ''}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className='images'>
                    {order.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.photo.image.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </div>
  );
}
