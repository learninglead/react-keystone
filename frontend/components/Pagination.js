import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';

import DisplayError from './ErrorMessage';
import { perPage } from '../config';

import PaginationStyles from './styles/PaginationStyles';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { data, error, loading } = useQuery(PAGINATION_QUERY);

  if (loading) return null;
  if (error) return <DisplayError error={error} />;
  const { count } = data._allProductsMeta;
  const pages = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits - Page {page} of {pages}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>Prev</a>
      </Link>
      <p>
        Page {page} of {pages}
      </p>
      <p>{count} Items of total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pages}>Next</a>
      </Link>
    </PaginationStyles>
  );
}
