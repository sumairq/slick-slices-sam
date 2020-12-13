import React from 'react';
import Layout from '../components/Layout';
import {graphql} from 'gatsby';
import PizzaList from '../components/PizzaList'
import ToppingsFilter from '../components/ToppingsFilter';
import SEO from '../components/SEO';


export default function PizzasPage({data:{pizzas}},pageContext) {


  return (
    <>
    <SEO title={pageContext.topping ? `Pizzas With ${pageContext.topping}`: `All Pizzas`}/>
    <ToppingsFilter/>
      <PizzaList pizzas={pizzas}/>
    </>
  );
}
export const query = graphql`
  query PizzaQuery($topping: [String]) {
    pizzas: allSanityPizza(
      filter: {toppings:{elemMatch: { name: {in: $topping } } } }
    ) {
      nodes {
        name
        id
        slug {
          current
        }
        toppings {
          id
          name
        }
        image {
          asset {
            fluid(maxWidth: 400){
            ...GatsbySanityImageFluid
          
            }
            fixed(width: 200, height: 200){
              ...GatsbySanityImageFixed
            }
          }
        }
      }
    }
  }
  
 
  `
