import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCT_PRODUCTS_QUERY = gql`
  query SEARCT_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerm: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  resetIdCounter();
  const router = useRouter();

  const [findTerm, { data, loading, error }] = useLazyQuery(
    SEARCT_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const items = data?.searchTerm || [];

  const findItemsButChill = debounce(findTerm, 350);

  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange() {
      findItemsButChill({ variables: { searchTerm: inputValue } });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    itemToString: (item) => item?.name || '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item })}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width='50'
              />
              {item.name}
            </DropDownItem>
          ))}
      </DropDown>
      {isOpen && !items.length && !loading && (
        <DropDownItem> Sorry, no items found for {inputValue}</DropDownItem>
      )}
    </SearchStyles>
  );
}
