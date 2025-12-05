import { useEffect, useRef } from "react";
import { CartItemList, useCart } from "@nghiaute/cart-ui-lib";
import {
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  TOGGLE_SELECT,
} from "../graphql/cartQueries";
import { graphQLRequest } from "../graphql/graphQLClient";

// Wrapper để sync các thay đổi từ CartItemList lên GraphQL
export const CartItemListWrapper = ({ emptyText, onSync }) => {
  const { state, dispatch } = useCart();
  const prevItemsRef = useRef(state.items);
  const syncingRef = useRef(false);

  // Sync changes to GraphQL
  useEffect(() => {
    // Skip nếu đang sync hoặc chưa có items trước đó
    if (syncingRef.current || prevItemsRef.current.length === 0) {
      prevItemsRef.current = state.items;
      return;
    }

    const prevItems = prevItemsRef.current;
    const currentItems = state.items;

    // Tìm các thay đổi
    const syncPromises = [];

    // Check for removed items
    prevItems.forEach((prevItem) => {
      const currentItem = currentItems.find((i) => i.id === prevItem.id);
      if (!currentItem) {
        // Item was removed
        syncPromises.push(
          graphQLRequest(REMOVE_CART_ITEM, { id: prevItem.id }).catch(
            console.error
          )
        );
      }
    });

    // Check for updated items
    currentItems.forEach((currentItem) => {
      const prevItem = prevItems.find((i) => i.id === currentItem.id);
      if (prevItem) {
        if (prevItem.quantity !== currentItem.quantity) {
          // Quantity changed
          syncPromises.push(
            graphQLRequest(UPDATE_CART_ITEM, {
              id: currentItem.id,
              quantity: currentItem.quantity,
            }).catch(console.error)
          );
        }
        if (prevItem.selected !== currentItem.selected) {
          // Selection changed
          syncPromises.push(
            graphQLRequest(TOGGLE_SELECT, { id: currentItem.id }).catch(
              console.error
            )
          );
        }
      }
    });

    if (syncPromises.length > 0) {
      syncingRef.current = true;
      Promise.all(syncPromises).finally(() => {
        syncingRef.current = false;
        if (onSync) onSync();
      });
    }

    prevItemsRef.current = state.items;
  }, [state.items, onSync]);

  return <CartItemList emptyText={emptyText} />;
};
