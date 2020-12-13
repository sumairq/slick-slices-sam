import path from 'path';
import fetch from 'isomorphic-fetch'

async function turnPizzasIntoPages({graphql, actions}){

//1 get a template for this page
const pizzaTemplate = path.resolve('./src/templates/Pizza.js')
//2 query all the pizzas

const {data} = await graphql(`
  query {
     pizzas :allSanityPizza {
         nodes {
             name
             slug {
                 current
             }
         }
     }
  }

`);
console.log(data)
//3. Loop over each pizza and create a page for that pizza

data.pizzas.nodes.forEach((pizza) => {
    actions.createPage({
        //What is the URL for this new page??
        path: `pizza/${pizza.slug.current}`,
        component: pizzaTemplate,
        context: {
            slug: pizza.slug.current,
        }
    }) 
});
}
async function turnToppingsIntoPages({graphql, actions}){
console.log(`Turning the Topping into Page!!!`);
//1.  Get the template
 const toppingTemplate = path.resolve('./src/pages/pizzas.js')
// 2. query all the toppings
const {data} = await graphql(`
query {
    toppings: allSanityTopping {
        nodes {
            name
            id
        }
    }
}
`)


// 3. createPage for that topping
data.toppings.nodes.forEach((topping)=>{
    actions.createPage({
        path: `topping/${topping.name}`,
        component: toppingTemplate,
        context: {
            topping: topping.name,
            //TODO regex for topping 
        }
    })
})
// 4. Pass topping data to pizza.js
}
async function fetchBeersAndTurnIntoNodes({actions, createNodeId, createContentDigest}) {
const res = await fetch('https://sampleapis.com/beers/api/ale')
const beers = await res.json();

for(const beer of beers){
const nodeMeta = {
    id: createNodeId(`beer-${beer.name}`),
    parent: null,
    children: [],
    internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
    },
};
// 3. Create a node for that beer

actions.createNode({
    ...beer,
    ...nodeMeta,
});
}
}

async function turnSlicemasterIntoPages({graphql,actions}){
//1 Query all slicemasters
const {data} = await graphql(`
query {
   slicemasters :allSanityPerson {
        totalCount
        nodes {
            name
            id
            slug{
                current
            }
        }
    }
}`)
// TODO: 2. Turn each slicemaster into their own page (TODO)

data.slicemasters.nodes.forEach(slicemaster => {
     actions.createPage({
         component: path.resolve('./src/templates/Slicemaster.js'),
         path: `slicemaster/${slicemaster.slug.current}`,
         context: {
             name: slicemaster.person,
             slug: slicemaster.slug.current
         }
     })
})
// 3.Figure out how many pages there are based on how many slicemasters there are , and how many per page.
const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
console.log(`There are ${data.slicemasters.totalCount} total people.
And we have ${pageCount} pages with ${pageSize} per page`)
// 4. Loop from 1 to n  and create the pages for them.

Array.from({length: pageCount }).forEach((_,i)=>{
    actions.createPage({
        path: `/slicemasters/${i + 1}`,
        component: path.resolve(`./src/pages/slicemasters.js`),
        context: {
            skip: i * pageSize,
             currentPage: i + 1,
             pageSize
        }
    })
})
}

export async function sourceNodes(params){
    // fetch a list of beers and source them into your nodes
    await Promise.all([
        fetchBeersAndTurnIntoNodes(params),
    ]) 
}
 

export async function createPages(params){

// create pages dynamically
await Promise.all([
 turnPizzasIntoPages(params), 
turnToppingsIntoPages(params),
turnSlicemasterIntoPages(params)
 ])

// 1. Pizzas
// 2. Toppings
// 3. Slicemasters

}
