import React from 'react'
import {graphql, Link, useStaticQuery} from 'gatsby'
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;
    .count {
      background: white;
      padding: 2px 5px;
    }
    &[aria-current = "page"] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas){
    //return pizzas with counts
  const counts = pizzas.map((pizza)=>(pizza.toppings))
    .flat()
    .reduce((acc,topping)=>{

        const toppingExists = acc[topping.id]
        if(toppingExists){
            acc[topping.id].count += 1
        }else{
            acc[topping.id] = {
                name: topping.name,
                id: topping.id,
                count: 1
            }
        }
        console.log(acc)
        return acc;
    },{})
    
    //sort them based on their count
    const sortedToppings = Object.values(counts).sort(
        (a,b) => b.count - a.count
    )
return sortedToppings
}

export default function ToppingsFilter() {

   
//Get a list of all the toppings.     Not really we are not actually using the toppings so we can safely omit this query.
   const {toppings, pizzas} = useStaticQuery(graphql`
   query {
    toppings: allSanityTopping {
      nodes {
        name
        id
        vegetarian
      }
    }
    pizzas: allSanityPizza{
      nodes{
        toppings {
          id
          name
        }
      }
    }
  }
  
   `)
//    console.log({toppings,pizzas})

//Count how many pizzas are in each topping 
const toppingsWithCounts = countPizzasInToppings(pizzas.nodes)
// console.log(toppingsWithCounts)

    return (
        <ToppingsStyles>
          <Link to="/pizzas/">
            <span className="name">All</span>
            <span className="count">{pizzas.nodes.length}</span>
          </Link>
          {toppingsWithCounts.map(topping => (
              <Link key={topping.id} to={`/topping/${topping.name}`}>
                  <span className="name">{topping.name}</span> 
                  <span className="count">{topping.count}</span> 
                  </Link>
          ))}
        </ToppingsStyles>
    )
}
