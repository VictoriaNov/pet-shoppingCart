import { useState } from "react";
import { useQuery } from "react-query";
//Components
import Item from "./Item/Item";
import Drawer from "@mui/material/Drawer";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AddShoppingCart } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
// Styles
import { Wrapper, StyledButton } from "./App.styles";
import Cart from "./Cart/Cart";
// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json(); //первый авайт предназначен чтобы перевести в JSON (это тоже асинхронная ф-ция), второй аваайт в скобках - непосредственно для фетча

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  ); //первый аргумент - ключ, можно назвать как угодно, второй - ф-ция

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce((acc: number, el) => acc + el.amount, 0);
  };

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      // Is the item already in Cart?
      const isInCart = prev.find((el) => el.id === clickedItem.id);
      if (isInCart) {
        return prev.map(
          (el) =>
            el.id === clickedItem.id ? { ...el, amount: el.amount + 1 } : el //&&&&&
        );
      }
      //First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((acc, el) => {
        if (el.id === id) {
          if (el.amount === 1) return acc;
          return [...acc, { ...el, amount: el.amount - 1 }];
        } else {
          return [...acc, el];
        }
      }, [] as CartItemType[])
    );
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;
  return (
    <Wrapper>
      <Drawer anchor="left" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item handleAddToCart={handleAddToCart} item={item} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
